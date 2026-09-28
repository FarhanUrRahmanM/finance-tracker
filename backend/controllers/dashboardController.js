const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// Helper to get month bounds
const getMonthRange = (month, year) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start, end };
};

// @desc    Get dashboard summary cards data
// @route   GET /api/dashboard/summary
// @access  Private
const getSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const currentMonth = req.query.month ? parseInt(req.query.month, 10) : now.getMonth() + 1;
    const currentYear = req.query.year ? parseInt(req.query.year, 10) : now.getFullYear();

    // 1. All-time total balance (Total Income - Total Expenses)
    const allTimeTotals = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let allTimeIncome = 0;
    let allTimeExpenses = 0;
    allTimeTotals.forEach((t) => {
      if (t._id === 'Income') allTimeIncome = t.total;
      if (t._id === 'Expense') allTimeExpenses = t.total;
    });
    const totalBalance = allTimeIncome - allTimeExpenses;

    // 2. Current Month Totals
    const { start: curStart, end: curEnd } = getMonthRange(currentMonth, currentYear);
    const curMonthTotals = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: curStart, $lte: curEnd },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let monthIncome = 0;
    let monthExpenses = 0;
    curMonthTotals.forEach((t) => {
      if (t._id === 'Income') monthIncome = t.total;
      if (t._id === 'Expense') monthExpenses = t.total;
    });

    // 3. Previous Month Expenses (for MoM indicator)
    let prevMonth = currentMonth - 1;
    let prevYear = currentYear;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear = currentYear - 1;
    }
    const { start: prevStart, end: prevEnd } = getMonthRange(prevMonth, prevYear);
    const prevMonthTotals = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'Expense',
          date: { $gte: prevStart, $lte: prevEnd },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    const prevMonthExpenses = prevMonthTotals.length > 0 ? prevMonthTotals[0].total : 0;
    let momExpenseChange = 0;
    if (prevMonthExpenses > 0) {
      momExpenseChange = Number((((monthExpenses - prevMonthExpenses) / prevMonthExpenses) * 100).toFixed(1));
    }

    // 4. Monthly Budget
    const budgetDoc = await Budget.findOne({ user: userId, month: currentMonth, year: currentYear });
    const monthlyBudget = budgetDoc ? budgetDoc.amount : 0;
    const remainingBudget = monthlyBudget - monthExpenses;
    const budgetUsedPercentage = monthlyBudget > 0 ? Number(((monthExpenses / monthlyBudget) * 100).toFixed(1)) : 0;

    res.json({
      success: true,
      summary: {
        totalBalance,
        monthIncome,
        monthExpenses,
        monthlyBudget,
        remainingBudget,
        budgetUsedPercentage,
        prevMonthExpenses,
        momExpenseChange,
        currentMonth,
        currentYear,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get category-wise expense breakdown for pie/donut charts
// @route   GET /api/dashboard/category-expenses
// @access  Private
const getCategoryExpenses = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const month = req.query.month ? parseInt(req.query.month, 10) : now.getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year, 10) : now.getFullYear();

    const { start, end } = getMonthRange(month, year);

    const categoriesAggregation = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'Expense',
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
    ]);

    const totalMonthExpenses = categoriesAggregation.reduce((acc, c) => acc + c.totalSpent, 0);

    const categoryData = categoriesAggregation.map((c) => ({
      category: c._id,
      totalSpent: c.totalSpent,
      percentage: totalMonthExpenses > 0 ? Number(((c.totalSpent / totalMonthExpenses) * 100).toFixed(1)) : 0,
      count: c.count,
    }));

    res.json({
      success: true,
      totalMonthExpenses,
      categoryData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get monthly summary analysis
// @route   GET /api/dashboard/monthly-summary
// @access  Private
const getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const month = req.query.month ? parseInt(req.query.month, 10) : now.getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year, 10) : now.getFullYear();

    const { start, end } = getMonthRange(month, year);

    const totals = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;
    let txCount = 0;

    totals.forEach((t) => {
      if (t._id === 'Income') totalIncome = t.total;
      if (t._id === 'Expense') totalExpenses = t.total;
      txCount += t.count;
    });

    const netSavings = totalIncome - totalExpenses;

    const budgetDoc = await Budget.findOne({ user: userId, month, year });
    const monthlyBudget = budgetDoc ? budgetDoc.amount : 0;
    const remainingBudget = monthlyBudget - totalExpenses;

    // Find highest spending category
    const topCategoryAgg = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'Expense',
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]);

    const highestCategory = topCategoryAgg.length > 0 ? topCategoryAgg[0]._id : 'None';
    const highestCategoryAmount = topCategoryAgg.length > 0 ? topCategoryAgg[0].total : 0;

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[month - 1];

    const formatCurrency = (val) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(val);
    };

    let summaryText = `In ${monthName} ${year}, you spent ${formatCurrency(totalExpenses)} and saved ${formatCurrency(netSavings >= 0 ? netSavings : 0)}.`;
    if (netSavings < 0) {
      summaryText = `In ${monthName} ${year}, your expenses exceeded your income by ${formatCurrency(Math.abs(netSavings))}.`;
    }

    res.json({
      success: true,
      month,
      year,
      monthName,
      totalIncome,
      totalExpenses,
      netSavings,
      monthlyBudget,
      remainingBudget,
      highestCategory,
      highestCategoryAmount,
      transactionCount: txCount,
      summaryText,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get monthly trend data for Bar and Line charts (last 6 months)
// @route   GET /api/dashboard/monthly-trend
// @access  Private
const getMonthlyTrend = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const monthsData = [];

    // Collect data for last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      const { start, end } = getMonthRange(m, y);

      const totals = await Transaction.aggregate([
        {
          $match: {
            user: userId,
            date: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' },
          },
        },
      ]);

      let income = 0;
      let expense = 0;
      totals.forEach((t) => {
        if (t._id === 'Income') income = t.total;
        if (t._id === 'Expense') expense = t.total;
      });

      monthsData.push({
        month: monthNames[m - 1],
        fullMonth: `${monthNames[m - 1]} ${y}`,
        monthNum: m,
        year: y,
        income,
        expense,
        savings: income - expense,
      });
    }

    res.json({
      success: true,
      trend: monthsData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dynamic financial insights
// @route   GET /api/dashboard/insights
// @access  Private
const getInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const { start: curStart, end: curEnd } = getMonthRange(currentMonth, currentYear);

    // Fetch month expenses & income
    const curMonthTotals = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: curStart, $lte: curEnd },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let monthIncome = 0;
    let monthExpenses = 0;
    curMonthTotals.forEach((t) => {
      if (t._id === 'Income') monthIncome = t.total;
      if (t._id === 'Expense') monthExpenses = t.total;
    });

    // Highest category
    const topCategoryAgg = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'Expense',
          date: { $gte: curStart, $lte: curEnd },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]);

    const highestCat = topCategoryAgg.length > 0 ? topCategoryAgg[0]._id : null;

    // Previous month expenses
    let prevMonth = currentMonth - 1;
    let prevYear = currentYear;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear = currentYear - 1;
    }
    const { start: prevStart, end: prevEnd } = getMonthRange(prevMonth, prevYear);
    const prevTotals = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'Expense',
          date: { $gte: prevStart, $lte: prevEnd },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);
    const prevExpenses = prevTotals.length > 0 ? prevTotals[0].total : 0;

    // Budget
    const budgetDoc = await Budget.findOne({ user: userId, month: currentMonth, year: currentYear });
    const monthlyBudget = budgetDoc ? budgetDoc.amount : 0;
    const budgetUsedPct = monthlyBudget > 0 ? ((monthExpenses / monthlyBudget) * 100) : 0;

    const insights = [];

    // Insight 1: Highest spending category
    if (highestCat) {
      insights.push({
        id: 'highest-category',
        type: 'info',
        icon: 'PieChart',
        text: `${highestCat} is your highest spending category this month.`,
      });
    }

    // Insight 2: Budget status
    if (monthlyBudget > 0) {
      if (budgetUsedPct >= 100) {
        insights.push({
          id: 'budget-exceeded',
          type: 'danger',
          icon: 'AlertTriangle',
          text: `Alert: You have exceeded your monthly budget by ${(budgetUsedPct - 100).toFixed(1)}%!`,
        });
      } else if (budgetUsedPct >= 80) {
        insights.push({
          id: 'budget-warning',
          type: 'warning',
          icon: 'AlertCircle',
          text: `You have used ${budgetUsedPct.toFixed(0)}% of your monthly budget. You are close to your limit.`,
        });
      } else {
        insights.push({
          id: 'budget-normal',
          type: 'success',
          icon: 'CheckCircle',
          text: `You have used ${budgetUsedPct.toFixed(0)}% of your monthly budget. Spending is well managed.`,
        });
      }
    } else {
      insights.push({
        id: 'no-budget',
        type: 'info',
        icon: 'Sliders',
        text: 'Set a monthly budget to track your spending progress.',
      });
    }

    // Insight 3: Month-over-month comparison
    if (prevExpenses > 0) {
      const diffPct = (((monthExpenses - prevExpenses) / prevExpenses) * 100).toFixed(1);
      if (diffPct > 0) {
        insights.push({
          id: 'mom-increase',
          type: 'warning',
          icon: 'TrendingUp',
          text: `Your expenses increased by ${diffPct}% compared with last month.`,
        });
      } else if (diffPct < 0) {
        insights.push({
          id: 'mom-decrease',
          type: 'success',
          icon: 'TrendingDown',
          text: `Great job! Your expenses decreased by ${Math.abs(diffPct)}% compared with last month.`,
        });
      }
    }

    // Insight 4: Net savings achieved
    const savings = monthIncome - monthExpenses;
    if (savings > 0) {
      const formattedSavings = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(savings);

      insights.push({
        id: 'net-savings',
        type: 'success',
        icon: 'DollarSign',
        text: `You saved ${formattedSavings} this month so far!`,
      });
    }

    res.json({
      success: true,
      insights,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSummary,
  getCategoryExpenses,
  getMonthlySummary,
  getMonthlyTrend,
  getInsights,
};

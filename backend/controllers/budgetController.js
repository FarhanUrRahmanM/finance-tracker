const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// @desc    Get monthly budget and calculation details
// @route   GET /api/budget
// @access  Private
const getBudget = async (req, res) => {
  try {
    const now = new Date();
    const month = req.query.month ? parseInt(req.query.month, 10) : now.getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year, 10) : now.getFullYear();

    let budgetDoc = await Budget.findOne({
      user: req.user._id,
      month,
      year,
    });

    const budgetAmount = budgetDoc ? budgetDoc.amount : 0;

    // Calculate total expenses for this month and year
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const expenseAggregation = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'Expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$amount' },
        },
      },
    ]);

    const spent = expenseAggregation.length > 0 ? expenseAggregation[0].totalSpent : 0;
    const remaining = budgetAmount - spent;
    const percentage = budgetAmount > 0 ? Number(((spent / budgetAmount) * 100).toFixed(1)) : 0;

    let status = 'normal'; // under 50%
    if (percentage >= 50 && percentage <= 80) {
      status = 'warning';
    } else if (percentage > 80 && percentage <= 100) {
      status = 'high';
    } else if (percentage > 100) {
      status = 'exceeded';
    }

    res.json({
      success: true,
      budget: {
        _id: budgetDoc ? budgetDoc._id : null,
        month,
        year,
        amount: budgetAmount,
        spent,
        remaining,
        percentage,
        status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Set or update monthly budget
// @route   POST /api/budget
// @access  Private
const setBudget = async (req, res) => {
  try {
    const { month, year, amount } = req.body;

    if (!month || !year || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide month, year, and budget amount',
      });
    }

    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    const amt = Number(amount);

    if (amt < 0) {
      return res.status(400).json({ success: false, message: 'Budget amount cannot be negative' });
    }

    // Upsert budget
    const budgetDoc = await Budget.findOneAndUpdate(
      { user: req.user._id, month: m, year: y },
      { amount: amt },
      { new: true, upsert: true, runValidators: true }
    );

    // Calculate current spending for response
    const startOfMonth = new Date(y, m - 1, 1);
    const endOfMonth = new Date(y, m, 0, 23, 59, 59, 999);

    const expenseAggregation = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'Expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$amount' },
        },
      },
    ]);

    const spent = expenseAggregation.length > 0 ? expenseAggregation[0].totalSpent : 0;
    const remaining = amt - spent;
    const percentage = amt > 0 ? Number(((spent / amt) * 100).toFixed(1)) : 0;

    let status = 'normal';
    if (percentage >= 50 && percentage <= 80) status = 'warning';
    else if (percentage > 80 && percentage <= 100) status = 'high';
    else if (percentage > 100) status = 'exceeded';

    res.json({
      success: true,
      message: 'Budget saved successfully',
      budget: {
        _id: budgetDoc._id,
        month: m,
        year: y,
        amount: amt,
        spent,
        remaining,
        percentage,
        status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBudget,
  setBudget,
};

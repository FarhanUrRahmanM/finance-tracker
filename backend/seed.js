const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Budget = require('./models/Budget');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing seed data for demo user...');
    const demoEmail = 'demo@fintrack.com';
    let user = await User.findOne({ email: demoEmail });

    if (user) {
      await Transaction.deleteMany({ user: user._id });
      await Budget.deleteMany({ user: user._id });
      await User.deleteOne({ _id: user._id });
    }

    console.log('Creating demo user...');
    user = await User.create({
      name: 'Alex Johnson',
      email: demoEmail,
      password: 'password123',
      currency: 'INR',
    });

    const now = new Date();
    const curMonth = now.getMonth() + 1;
    const curYear = now.getFullYear();

    console.log('Setting monthly budgets...');
    // Current month budget
    await Budget.create({
      user: user._id,
      month: curMonth,
      year: curYear,
      amount: 45000,
    });

    // Previous month budget
    let prevMonth = curMonth - 1;
    let prevYear = curYear;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear = curYear - 1;
    }
    await Budget.create({
      user: user._id,
      month: prevMonth,
      year: prevYear,
      amount: 40000,
    });

    console.log('Inserting sample realistic transactions...');
    const sampleTransactions = [
      // Current Month Income
      {
        user: user._id,
        type: 'Income',
        amount: 85000,
        category: 'Salary',
        description: 'Monthly Salary Credit - Tech Corp',
        date: new Date(curYear, curMonth - 1, 1),
        paymentMethod: 'Bank Transfer',
        notes: 'Direct deposit for current month',
      },
      {
        user: user._id,
        type: 'Income',
        amount: 18500,
        category: 'Freelance',
        description: 'UI/UX Design Project Payment',
        date: new Date(curYear, curMonth - 1, 5),
        paymentMethod: 'Bank Transfer',
        notes: 'Client invoice #1042',
      },

      // Current Month Expenses
      {
        user: user._id,
        type: 'Expense',
        amount: 15000,
        category: 'Rent',
        description: 'Apartment Rent Payment',
        date: new Date(curYear, curMonth - 1, 2),
        paymentMethod: 'UPI',
        notes: 'Paid via GPay to landlord',
      },
      {
        user: user._id,
        type: 'Expense',
        amount: 4200,
        category: 'Groceries',
        description: 'Weekly Organic Grocery Shopping',
        date: new Date(curYear, curMonth - 1, 4),
        paymentMethod: 'Credit Card',
        notes: 'Supermarket restock',
      },
      {
        user: user._id,
        type: 'Expense',
        amount: 2500,
        category: 'Food',
        description: 'Dinner with friends at Olive Bistro',
        date: new Date(curYear, curMonth - 1, 7),
        paymentMethod: 'Credit Card',
        notes: 'Weekend dinner',
      },
      {
        user: user._id,
        type: 'Expense',
        amount: 3200,
        category: 'Bills',
        description: 'Electricity & High-Speed Wifi Bill',
        date: new Date(curYear, curMonth - 1, 10),
        paymentMethod: 'UPI',
        notes: 'Monthly utility bills',
      },
      {
        user: user._id,
        type: 'Expense',
        amount: 1800,
        category: 'Travel',
        description: 'Uber Auto & Metro Commute Pass',
        date: new Date(curYear, curMonth - 1, 12),
        paymentMethod: 'UPI',
        notes: 'Office commute',
      },
      {
        user: user._id,
        type: 'Expense',
        amount: 3500,
        category: 'Shopping',
        description: 'New Noise-Canceling Earbuds',
        date: new Date(curYear, curMonth - 1, 15),
        paymentMethod: 'Credit Card',
        notes: 'Sale discount applied',
      },
      {
        user: user._id,
        type: 'Expense',
        amount: 1200,
        category: 'Books',
        description: 'Full-Stack Architecture & Design Books',
        date: new Date(curYear, curMonth - 1, 18),
        paymentMethod: 'Debit Card',
        notes: 'Tech learning material',
      },
      {
        user: user._id,
        type: 'Expense',
        amount: 1500,
        category: 'Entertainment',
        description: 'Movie IMAX Tickets & Streaming Subscriptions',
        date: new Date(curYear, curMonth - 1, 20),
        paymentMethod: 'UPI',
        notes: 'Weekend movie',
      },
      {
        user: user._id,
        type: 'Expense',
        amount: 2800,
        category: 'Healthcare',
        description: 'Routine Dental Checkup & Medicines',
        date: new Date(curYear, curMonth - 1, 22),
        paymentMethod: 'Credit Card',
        notes: 'Clinic consultation',
      },

      // Previous Month Data
      {
        user: user._id,
        type: 'Income',
        amount: 85000,
        category: 'Salary',
        description: 'Monthly Salary Credit',
        date: new Date(prevYear, prevMonth - 1, 1),
        paymentMethod: 'Bank Transfer',
      },
      {
        user: user._id,
        type: 'Expense',
        amount: 15000,
        category: 'Rent',
        description: 'Monthly Rent',
        date: new Date(prevYear, prevMonth - 1, 2),
        paymentMethod: 'UPI',
      },
      {
        user: user._id,
        type: 'Expense',
        amount: 5500,
        category: 'Food',
        description: 'Dining out & cafes',
        date: new Date(prevYear, prevMonth - 1, 14),
        paymentMethod: 'Credit Card',
      },
      {
        user: user._id,
        type: 'Expense',
        amount: 4800,
        category: 'Shopping',
        description: 'Clothing & Footwear',
        date: new Date(prevYear, prevMonth - 1, 19),
        paymentMethod: 'Credit Card',
      },
      {
        user: user._id,
        type: 'Expense',
        amount: 3100,
        category: 'Bills',
        description: 'Water, Gas & Broadband',
        date: new Date(prevYear, prevMonth - 1, 25),
        paymentMethod: 'UPI',
      },
    ];

    await Transaction.insertMany(sampleTransactions);

    console.log('✅ Database seeded successfully!');
    console.log('-----------------------------------');
    console.log(`Demo Login Email: ${demoEmail}`);
    console.log(`Demo Password: password123`);
    console.log('-----------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedData();

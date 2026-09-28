const express = require('express');
const router = express.Router();
const {
  getSummary,
  getCategoryExpenses,
  getMonthlySummary,
  getMonthlyTrend,
  getInsights,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/summary', getSummary);
router.get('/category-expenses', getCategoryExpenses);
router.get('/monthly-summary', getMonthlySummary);
router.get('/monthly-trend', getMonthlyTrend);
router.get('/insights', getInsights);

module.exports = router;

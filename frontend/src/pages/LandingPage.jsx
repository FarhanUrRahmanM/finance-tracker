import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Wallet,
  PieChart,
  Sliders,
  TrendingUp,
  Zap,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  BarChart3,
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between overflow-x-hidden">
      {/* Header Navigation */}
      <header className="max-w-7xl w-full mx-auto px-6 py-5 flex items-center justify-between z-10 bg-white border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">FinTrack</h1>
            <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest">Personal Finance</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition-all"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-slate-700 hover:text-slate-900 font-semibold text-sm transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl w-full mx-auto px-6 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-blue-700 font-semibold text-xs">
            <Zap className="w-4 h-4 text-blue-600" />
            <span>Modern Personal Finance Dashboard</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Take Control of <br />
            <span className="text-blue-600">
              Your Money
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 font-normal">
            Track your income, manage expenses, set budgets, and understand your spending — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl shadow-xs flex items-center justify-center space-x-2 transition-all"
            >
              <span>{isAuthenticated ? "Go to Dashboard" : "Get Started"}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            {!isAuthenticated && (
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 bg-white border border-slate-300 text-slate-800 font-bold text-base rounded-xl hover:bg-slate-50 transition-colors text-center shadow-xs"
              >
                Login
              </Link>
            )}
          </div>

          <div className="pt-6 flex items-center justify-center lg:justify-start space-x-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Real-time Analytics</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>JWT Authentication</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Dynamic Budgeting</span>
            </div>
          </div>
        </div>

        {/* Hero Feature Visual Card */}
        <div className="relative">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Monthly Preview</span>
                <h3 className="text-xl font-bold text-slate-900">₹45,250 Total Balance</h3>
              </div>
              <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold">
                +14.2% Saved
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600">Monthly Budget (₹30,000)</span>
                <span className="text-blue-600">61.7% Spent</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-blue-600 rounded-full w-[61.7%]"></div>
              </div>
            </div>

            {/* Quick Feature Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Total Income</span>
                <span className="text-base font-extrabold text-green-600">₹45,000</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Total Expenses</span>
                <span className="text-base font-extrabold text-red-600">₹18,500</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl w-full mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Complete Financial Tracking Suite
            </h3>
            <p className="text-slate-500 text-sm mt-2">
              Powerful tools designed to simplify your monthly budgeting and expense analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit border border-blue-100">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Track Expenses</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log and categorize daily expenses by Food, Travel, Shopping, Bills, Groceries, and more.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl w-fit border border-green-100">
                <Sliders className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Set Budgets</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Set monthly spending targets and get visual progress bars with warning thresholds.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit border border-purple-100">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Visualize Spending</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Interactive Recharts Donut charts, Bar charts, and Area line graphs for deep insights.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit border border-amber-100">
                <PieChart className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Monthly Insights</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated real-time text analysis on savings, highest spending categories, and progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-500 bg-slate-50">
        <p>© {new Date().getFullYear()} FinTrack – Personal Finance & Monthly Budget Tracker. Built with MERN Stack.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

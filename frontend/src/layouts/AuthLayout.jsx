import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 relative">
      {/* Soft Blue Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-blue-50/80 rounded-b-full blur-3xl pointer-events-none"></div>

      {/* Header Bar */}
      <header className="p-6 flex items-center justify-between z-10 max-w-7xl w-full mx-auto">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs group-hover:bg-blue-700 transition-colors">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">FinTrack</h1>
            <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest">Personal Finance</p>
          </div>
        </Link>
      </header>

      {/* Center Auth Card Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-500 z-10">
        © {new Date().getFullYear()} FinTrack – Personal Finance & Monthly Budget Tracker. Built with MERN.
      </footer>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default AuthLayout;

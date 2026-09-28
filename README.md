# FinTrack – Personal Finance & Monthly Budget Tracker

A modern, production-style full-stack **MERN** (MongoDB, Express.js, React, Node.js) web application designed for personal finance management, expense tracking, dynamic monthly budgeting, interactive data visualization, and automated financial analysis.

---

## 🌟 Key Features

- **Full Authentication System**:
  - Secure registration & login powered by **bcrypt.js** password hashing and **JWT** (JSON Web Tokens).
  - Protected API routes, persistent session state, auto-logout on token expiration, and route protection guards.

- **Interactive Financial Dashboard**:
  - Real-time Summary Cards: **Total Balance**, **Total Income**, **Total Expenses**, and **Remaining Budget**.
  - Visual Month-over-Month (MoM) spending change indicators.

- **Dynamic Monthly Budgeting**:
  - Set and update target budgets per month and year.
  - Visual progress bar with status indicators:
    - **Normal** (< 50% spent)
    - **Moderate Warning** (50% – 80% spent)
    - **High Spending** (80% – 100% spent)
    - **Budget Exceeded** (> 100% spent)

- **Complete Transaction Management (CRUD)**:
  - Add, edit, delete, search, filter, and sort transactions.
  - Separate categories for Income (*Salary, Freelance, Business, Investment, Gift, Other*) and Expenses (*Food, Travel, Shopping, Books, Education, Entertainment, Bills, Healthcare, Rent, Groceries, Other*).
  - Payment Methods support (*UPI, Cash, Credit Card, Debit Card, Bank Transfer, Other*).
  - Responsive layout: Desktop Data Table & Mobile Transaction Cards.

- **Interactive Recharts & Analytics**:
  - **Category Expense Breakdown**: Interactive Donut / Pie chart with tooltips and custom legends.
  - **Monthly Income vs Expense**: Dual-bar chart comparing income and spending trends.
  - **Spending Trend**: Area chart displaying expense patterns across recent billing cycles.

- **Automated Financial Insights**:
  - Real-time text insights calculated dynamically from user transaction data (e.g., highest spending category, budget percentage used, savings achieved).

- **Monthly Summary Page**:
  - Month & Year selector displaying Net Savings, Total Income, Total Expenses, Budget Target, Remaining Balance, and humanized summary descriptions.

- **Modern UI / UX**:
  - Light & Dark mode toggle with `localStorage` persistence.
  - Glassmorphism panels, loading skeletons, empty state placeholders, toast notifications (`React Toastify`), and confirmation dialogs.

---

## 🛠️ Technology Stack

### Frontend
- **React.js** (Vite template)
- **JavaScript (ES6+)**
- **Tailwind CSS** (v4 with `@tailwindcss/postcss`)
- **React Router DOM** (v6)
- **Axios** (With request & response interceptors)
- **Recharts** (Interactive financial graphs)
- **Lucide React** (Modern SVG icons)
- **React Toastify** (Toast notifications)

### Backend
- **Node.js** & **Express.js** (REST API architecture)
- **MongoDB** & **Mongoose** (Document schemas with compound indexing)
- **JWT (JsonWebToken)** (Authentication & Authorization middleware)
- **bcrypt.js** (Password hashing)
- **cors** & **dotenv**

---

## 📁 Directory Structure

```
finaince/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── authController.js        # Authentication & Profile logic
│   │   ├── transactionController.js # Transaction CRUD, search, filter, sort
│   │   ├── budgetController.js      # Monthly budget calculations
│   │   └── dashboardController.js   # Analytics, summaries & insights
│   ├── middleware/
│   │   ├── auth.js               # JWT bearer verification middleware
│   │   └── errorHandler.js       # Global error handler middleware
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt hooks
│   │   ├── Transaction.js        # Transaction schema & indexing
│   │   └── Budget.js             # Budget schema (unique month/year index)
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── transactionRoutes.js  # /api/transactions routes
│   │   ├── budgetRoutes.js       # /api/budget routes
│   │   └── dashboardRoutes.js    # /api/dashboard routes
│   ├── utils/
│   │   └── generateToken.js      # JWT token generator
│   ├── .env                      # Environment variables
│   ├── .env.example              # Sample environment template
│   ├── server.js                 # Express server entrypoint
│   └── seed.js                   # Development sample data seeder
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SummaryCard.jsx
│   │   │   ├── BudgetProgress.jsx
│   │   │   ├── TransactionTable.jsx
│   │   │   ├── TransactionCard.jsx
│   │   │   ├── TransactionForm.jsx
│   │   │   ├── CategoryChart.jsx
│   │   │   ├── MonthlyChart.jsx
│   │   │   ├── SpendingTrendChart.jsx
│   │   │   ├── FinancialInsights.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication state & actions
│   │   │   └── ThemeContext.jsx  # Light/Dark mode state
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx    # Dashboard layout wrapper
│   │   │   └── AuthLayout.jsx    # Fullscreen login/register wrapper
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Public landing page
│   │   │   ├── LoginPage.jsx     # Login with demo auto-fill
│   │   │   ├── RegisterPage.jsx  # Registration page
│   │   │   ├── DashboardPage.jsx # Main interactive dashboard
│   │   │   ├── TransactionsPage.jsx # Full transaction table & filter
│   │   │   ├── AddTransactionPage.jsx # New transaction page
│   │   │   ├── EditTransactionPage.jsx # Edit transaction page
│   │   │   ├── BudgetPage.jsx    # Dedicated budget manager
│   │   │   ├── AnalyticsPage.jsx # Advanced charts & breakdown
│   │   │   ├── MonthlySummaryPage.jsx # Dynamic monthly report
│   │   │   ├── SettingsPage.jsx # Profile & password settings
│   │   │   └── NotFoundPage.jsx # 404 page
│   │   ├── services/             # Axios API services
│   │   ├── utils/                # Date & currency formatting
│   │   ├── App.jsx               # Routes setup
│   │   ├── main.jsx              # Entrypoint
│   │   └── index.css             # Tailwind base styles
│   ├── tailwind.config.js
│   └── vite.config.js
├── README.md
└── package.json                  # Root npm scripts
```

---

## ⚡ Setup & Installation Instructions

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI

### 1. Clone & Install Dependencies

#### Install Root & Backend Dependencies:
```bash
cd backend
npm install
```

#### Install Frontend Dependencies:
```bash
cd ../frontend
npm install
```

---

### 2. Environment Variables Setup

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fintrack
JWT_SECRET=fintrack_super_secret_jwt_key_2026_finance_app
NODE_ENV=development
```

---

### 3. Seed Sample Demo Data (Optional but Recommended)

Populate MongoDB with realistic sample transactions and monthly budgets for instant demonstration:

```bash
cd backend
npm run seed
```

**Demo Login Credentials:**
- **Email**: `demo@fintrack.com`
- **Password**: `password123`

---

### 4. Run the Application

#### Option A: Run from Root Directory
```bash
# Terminal 1: Run Backend
npm run backend

# Terminal 2: Run Frontend
npm run frontend
```

#### Option B: Run Directories Separately
```bash
# Start Backend (Port 5000)
cd backend
npm run dev

# Start Frontend (Port 5173)
cd frontend
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 📡 Backend REST API Endpoints

### Authentication
- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – Authenticate user & return JWT token
- `GET /api/auth/me` – Get logged-in user profile (Protected)
- `PUT /api/auth/profile` – Update user profile / change password (Protected)

### Transactions
- `GET /api/transactions` – List transactions with search, category, type, date range & sort filters (Protected)
- `POST /api/transactions` – Add new transaction (Protected)
- `GET /api/transactions/:id` – Fetch single transaction (Protected)
- `PUT /api/transactions/:id` – Update transaction (Protected)
- `DELETE /api/transactions/:id` – Delete transaction (Protected)

### Monthly Budget
- `GET /api/budget?month=X&year=Y` – Get budget & spent percentage calculation (Protected)
- `POST /api/budget` – Create/Update monthly budget target (Protected)

### Dashboard & Analytics
- `GET /api/dashboard/summary` – Summary metrics (Total Balance, Month Income, Month Expenses, Remaining Budget) (Protected)
- `GET /api/dashboard/category-expenses` – Category breakdown aggregation for Recharts (Protected)
- `GET /api/dashboard/monthly-summary` – Detailed monthly savings report & description text (Protected)
- `GET /api/dashboard/monthly-trend` – Income vs Expense history for past 6 months (Protected)
- `GET /api/dashboard/insights` – Automated real dynamic insights (Protected)

---

## 🎨 Design Highlights & Aesthetics

- **Indian Currency Formatting**: Formats figures cleanly using `en-IN` standard (e.g. `₹1,25,000`).
- **Dark Mode Support**: Seamless toggle persisted across refresh via `localStorage`.
- **Responsive Layout**: Mobile drawer navigation, touch-friendly inputs, adaptive charts, and responsive table-to-card conversions.

---

## 🚀 Future Improvements

1. Export transaction data to CSV / PDF report.
2. Recurring monthly subscription management.
3. Multi-currency live conversion via exchange rates API.

---

## 📄 License

This project is open-source and available under the **MIT License**.

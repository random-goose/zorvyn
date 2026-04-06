import React, { useState, useMemo } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Sidebar } from './components/Sidebar';
import { StatCard, NeumorphicCard } from './components/UI';
import { TransactionList } from './components/TransactionList';
import { DashboardCharts } from './components/DashboardCharts';
import { TransactionForm } from './components/TransactionForm';
import { TransactionsPage } from './components/TransactionsPage';
import { BudgetsPage } from './components/BudgetsPage';
import { InvestmentsPage } from './components/InvestmentsPage';
import { SettingsPage } from './components/SettingsPage';
import { Wallet, TrendingUp, TrendingDown, Plus, Download, Bell, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApi } from './hooks/useApi';
import { fetchInsights } from './api/financeApi';
import avatar from './data/avatar.svg';

function Dashboard() {
  const { transactions, role, theme, activePage } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const stats = useMemo(() => {
    const income = transactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const expenses = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const balance = income - expenses;

    return {
      balance,
      income,
      expenses,
      savingsRate: income > 0 ? Math.round(((income - expenses) / income) * 100) : 0
    };
  }, [transactions]);

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Date,Description,Category,Type,Amount\n"
      + transactions.map(tx => `${tx.date},${tx.description},${tx.category},${tx.type},${tx.amount}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "zorvyn_transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 md:p-12 space-y-12 overflow-x-hidden">
        {activePage === 'overview' && (
          <div className="space-y-12">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="text-4xl font-black text-on-surface dark:text-dark-on-surface tracking-tight">
                  Good morning, Ruthwik 👋
                </h1>
                <p className="text-on-surface-variant mt-2 font-medium">
                  Your financial ecosystem is performing <span className="text-income">12% above</span> last month.
                </p>
              </motion.div>
              <div className="flex items-center gap-4">
                <div className="hidden lg:flex shadow-inset rounded-full px-4 py-2 items-center gap-3 w-64">
                  <Search size={16} className="text-on-surface-variant" />
                  <input
                    type="text"
                    placeholder="Search analytics..."
                    className="bg-transparent border-none focus:ring-0 text-sm w-full text-on-surface dark:text-dark-on-surface"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="shadow-raised p-3 rounded-full text-on-surface-variant hover:scale-95 transition-transform">
                  <Bell size={20} />
                </button>
                <div className="shadow-raised p-1 rounded-full overflow-hidden w-10 h-10 cursor-pointer">
                  <img
                    src={avatar}
                    alt="User"
                    className="w-full h-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </header>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard
                title="Total Balance"
                value={`₹${stats.balance.toLocaleString()}`}
                change={2.4}
                icon={<Wallet size={20} />}
              />
              <StatCard
                title="Monthly Income"
                value={`₹${stats.income.toLocaleString()}`}
                change={8.1}
                icon={<TrendingUp size={20} />}
                color="text-income"
              />
              <StatCard
                title="Monthly Spend"
                value={`₹${stats.expenses.toLocaleString()}`}
                change={-1.2}
                icon={<TrendingDown size={20} />}
                color="text-expense"
              />
              <StatCard
                title="Savings Rate"
                value={`${stats.savingsRate}%`}
                change={stats.savingsRate > 50 ? 5 : -2}
                icon={<TrendingUp size={20} />}
              />
            </section>

            {/* Charts Section */}
            <DashboardCharts />

            {/* Transactions Section */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-on-surface dark:text-dark-on-surface">Recent Transactions</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={exportData}
                    className="shadow-raised px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant flex items-center gap-2 neumorphic-active"
                  >
                    <Download size={14} /> Export
                  </button>
                  {role === 'admin' && (
                    <button
                      onClick={() => setIsFormOpen(true)}
                      className="shadow-raised px-6 py-2 rounded-xl bg-surface dark:bg-dark-surface text-primary-accent font-black text-sm flex items-center gap-2 neumorphic-active"
                    >
                      <Plus size={18} /> Add
                    </button>
                  )}
                </div>
              </div>
              <TransactionList searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </section>

            {/* Insights Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(() => {
                const categoryTotals = transactions
                  .filter(tx => tx.type === 'expense')
                  .reduce((acc, tx) => {
                    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
                    return acc;
                  }, {} as Record<string, number>);

                const topCategory = (Object.entries(categoryTotals) as [string, number][])
                  .sort(([, a], [, b]) => b - a)[0];

                const now = new Date();
                const thisMonth = transactions
                  .filter(tx => {
                    const d = new Date(tx.date);
                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                  })
                  .reduce((sum, tx) => sum + (tx.type === 'income' ? tx.amount : -tx.amount), 0);

                const lastMonth = transactions
                  .filter(tx => {
                    const d = new Date(tx.date);
                    const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
                  })
                  .reduce((sum, tx) => sum + (tx.type === 'income' ? tx.amount : -tx.amount), 0);

                const monthDiff = lastMonth !== 0
                  ? Math.round(((thisMonth - lastMonth) / Math.abs(lastMonth)) * 100)
                  : null;

                const insights = [
                  {
                    label: 'Top Spending Category',
                    color: 'text-expense',
                    body: topCategory
                      ? `${topCategory[0]} accounts for the most spend this month at ₹${topCategory[1].toLocaleString()}. Consider setting a budget cap.`
                      : 'No expenses recorded yet this month.',
                  },
                  {
                    label: 'Month-on-Month',
                    color: monthDiff !== null && monthDiff >= 0 ? 'text-income' : 'text-expense',
                    body: monthDiff !== null
                      ? `Your net cashflow is ${monthDiff >= 0 ? 'up' : 'down'} ${Math.abs(monthDiff)}% compared to last month.`
                      : 'Not enough data across months to compare yet.',
                  },
                  {
                    label: 'Savings Rate',
                    color: 'text-primary-accent',
                    body: stats.savingsRate > 0
                      ? `You're saving ${stats.savingsRate}% of income this month — ${stats.savingsRate >= 20 ? 'above' : 'below'} the recommended 20% benchmark.`
                      : 'Add income transactions to track your savings rate.',
                  },
                ];

                return insights.map(insight => (
                  <NeumorphicCard key={insight.label} className="space-y-4">
                    <h4 className={`text-xs font-black uppercase tracking-widest ${insight.color}`}>{insight.label}</h4>
                    <p className="text-sm font-medium text-on-surface dark:text-dark-on-surface">{insight.body}</p>
                  </NeumorphicCard>
                ));
              })()}
            </section>
          </div>
        )}

        {/* Dynamic Pages */}
        {activePage === 'transactions' && <TransactionsPage />}
        {activePage === 'budgets' && <BudgetsPage />}
        {activePage === 'investments' && <InvestmentsPage />}
        {activePage === 'settings' && <SettingsPage />}

        {/* Footer */}
        <footer className="py-12 text-center">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Zorvyn Fintrack • Built by Ruthwik with Neumorphic Principles
          </p>
        </footer>
      </main>

      {/* Floating Action Button (Mobile) */}
      {role === 'admin' && (
        <button
          onClick={() => setIsFormOpen(true)}
          className="md:hidden fixed bottom-8 right-8 w-14 h-14 shadow-raised rounded-full bg-surface dark:bg-dark-surface flex items-center justify-center text-primary-accent z-50 neumorphic-active"
        >
          <Plus size={24} />
        </button>
      )}

      <AnimatePresence>
        {isFormOpen && <TransactionForm onClose={() => setIsFormOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <Dashboard />
    </FinanceProvider>
  );
}

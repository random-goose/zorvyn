import React from 'react';
import { useApi } from '../hooks/useApi';
import { fetchBudgets } from '../api/financeApi';
import { useFinance } from '../context/FinanceContext';
import { motion } from 'motion/react';
import { StatCard } from './UI';
import { Wallet, Target } from 'lucide-react';

export const BudgetsPage: React.FC = () => {
  const budgets = useApi(fetchBudgets);
  const { transactions } = useFinance();

  const spentByCategory = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

  const totalCap = budgets.data?.reduce((sum, b) => sum + b.cap, 0) || 0;
  const totalSpent = (Object.values(spentByCategory) as number[]).reduce((sum, v) => sum + v, 0);

  if (budgets.loading) return <div className="text-on-surface-variant p-8 animate-pulse text-center">Loading budgets...</div>;
  if (budgets.error) return <div className="text-expense p-8 text-center text-sm font-bold">Failed to load budgets.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <header>
        <h1 className="text-3xl font-black text-on-surface dark:text-dark-on-surface">Budgets</h1>
        <p className="text-on-surface-variant mt-2 text-sm font-medium">Monthly spending limits and tracking</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <StatCard
          title="Total Budget Cap"
          value={`₹${totalCap.toLocaleString()}`}
          icon={<Target size={20} />}
        />
        <StatCard
          title="Total Spent"
          value={`₹${totalSpent.toLocaleString()}`}
          icon={<Wallet size={20} />}
          color={totalSpent > totalCap ? 'text-expense' : 'text-income'}
        />
      </div>

      <section className="bg-surface dark:bg-dark-surface shadow-raised rounded-3xl p-6 md:p-10 space-y-8">
        {budgets.data?.map(budget => {
          const spent = spentByCategory[budget.category] || 0;
          const percentage = Math.min((spent / budget.cap) * 100, 100);
          const isOver = spent > budget.cap;

          return (
            <div key={budget.category} className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="font-bold text-on-surface dark:text-dark-on-surface">{budget.category}</h3>
                  <p className="text-xs font-bold text-on-surface-variant tracking-widest uppercase mt-1">
                    {percentage.toFixed(0)}% used
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-black ${isOver ? 'text-expense' : 'text-on-surface dark:text-dark-on-surface'}`}>
                    ₹{spent.toLocaleString()}
                  </span>
                  <span className="text-on-surface-variant text-xs"> / ₹{budget.cap.toLocaleString()}</span>
                </div>
              </div>

              <div className="h-4 shadow-inset rounded-full overflow-hidden p-[2px]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: isOver ? '#E07C7C' : budget.color }}
                />
              </div>
            </div>
          );
        })}
      </section>
    </motion.div>
  );
};

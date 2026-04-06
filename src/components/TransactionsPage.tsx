import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TransactionList } from './TransactionList';
import { TransactionForm } from './TransactionForm';
import { Plus, Download, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TransactionsPage: React.FC = () => {
  const { transactions, role } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Date,Description,Category,Type,Amount\n"
      + transactions.map(tx => `${tx.date},${tx.description},${tx.category},${tx.type},${tx.amount}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "zorvyn_transactions_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-on-surface dark:text-dark-on-surface">Transactions</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-medium">History and categorization</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-4">
          <div className="flex-1 md:w-64 shadow-inset rounded-full px-4 py-2 flex items-center gap-3">
            <Search size={16} className="text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none focus:ring-0 text-sm w-full text-on-surface dark:text-dark-on-surface"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={exportData}
            className="shadow-raised p-2 rounded-xl text-on-surface-variant neumorphic-active shrink-0"
            title="Export CSV"
          >
            <Download size={20} />
          </button>
          {role === 'admin' && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="shadow-raised p-2 rounded-xl bg-surface dark:bg-dark-surface text-primary-accent neumorphic-active shrink-0"
              title="Add Transaction"
            >
              <Plus size={20} />
            </button>
          )}
        </div>
      </header>

      <section>
        <TransactionList searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </section>

      <AnimatePresence>
        {isFormOpen && <TransactionForm onClose={() => setIsFormOpen(false)} />}
      </AnimatePresence>
    </motion.div>
  );
};

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { NeumorphicCard } from './UI';
import { Search, Filter, Trash2, Edit2, ChevronRight, ArrowUpRight, ArrowDownLeft, X } from 'lucide-react';
import { Transaction } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES } from '../data/mockData';

// ── Edit Modal ────────────────────────────────────────────────────────────────
const EditModal: React.FC<{ tx: Transaction; onClose: () => void }> = ({ tx, onClose }) => {
  const { updateTransaction } = useFinance();
  const [formData, setFormData] = useState({
    description: tx.description,
    amount: String(tx.amount),
    category: tx.category,
    type: tx.type,
    date: tx.date,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTransaction(tx.id, {
      ...formData,
      amount: parseFloat(formData.amount),
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-on-surface/20 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="shadow-raised bg-surface dark:bg-dark-surface w-full max-w-lg rounded-2xl p-8 relative"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-on-surface dark:text-dark-on-surface">Edit Transaction</h3>
          <button onClick={onClose} className="shadow-raised p-2 rounded-full text-on-surface-variant hover:scale-90 transition-transform">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Description</label>
            <div className="shadow-inset h-12 rounded-xl flex items-center px-4">
              <input
                required
                type="text"
                className="bg-transparent border-none focus:ring-0 text-sm text-on-surface dark:text-dark-on-surface w-full"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Amount</label>
              <div className="shadow-inset h-12 rounded-xl flex items-center px-4">
                <span className="text-sm font-bold text-on-surface-variant mr-2">₹</span>
                <input
                  required
                  type="number"
                  step="0.01"
                  className="bg-transparent border-none focus:ring-0 text-sm text-on-surface dark:text-dark-on-surface w-full"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Type</label>
              <div className="shadow-inset h-12 rounded-xl flex items-center px-4">
                <select
                  className="bg-transparent border-none focus:ring-0 text-sm text-on-surface dark:text-dark-on-surface w-full appearance-none"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as Transaction['type'] })}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Category</label>
              <div className="shadow-inset h-12 rounded-xl flex items-center px-4">
                <select
                  className="bg-transparent border-none focus:ring-0 text-sm text-on-surface dark:text-dark-on-surface w-full appearance-none"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Date</label>
              <div className="shadow-inset h-12 rounded-xl flex items-center px-4">
                <input
                  required
                  type="date"
                  className="bg-transparent border-none focus:ring-0 text-sm text-on-surface dark:text-dark-on-surface w-full"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-6 pt-4">
            <button type="button" onClick={onClose} className="text-xs font-black text-on-surface-variant hover:text-on-surface tracking-widest uppercase">
              Cancel
            </button>
            <button type="submit" className="shadow-raised px-10 py-3 rounded-full bg-surface dark:bg-dark-surface text-sm font-black text-primary-accent neumorphic-active">
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ── Main List ─────────────────────────────────────────────────────────────────

interface TransactionListProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ searchTerm, setSearchTerm }) => {
  const { transactions, role, deleteTransaction } = useFinance();
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const filteredTransactions = transactions
    .filter(tx => {
      const matchesSearch =
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || tx.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) =>
      sortBy === 'date'
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : b.amount - a.amount
    );

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="w-full md:w-96 shadow-inset rounded-xl px-4 py-2 flex items-center gap-3">
          <Search size={18} className="text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="bg-transparent border-none focus:ring-0 text-sm w-full text-on-surface dark:text-dark-on-surface"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="shadow-inset p-1 rounded-xl flex">
            {(['all', 'income', 'expense'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterType === type
                    ? 'shadow-raised bg-surface dark:bg-dark-surface text-primary-accent'
                    : 'text-on-surface-variant'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSortBy(prev => prev === 'date' ? 'amount' : 'date')}
            className="shadow-raised p-2 rounded-xl text-on-surface-variant hover:text-primary-accent transition-all"
            title={`Sorting by ${sortBy} — click to toggle`}
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map(tx => (
              <motion.div
                key={tx.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="shadow-raised rounded-2xl p-4 flex items-center justify-between group hover:translate-x-1 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 shadow-inset rounded-full flex items-center justify-center ${
                    tx.type === 'income' ? 'text-income' : 'text-expense'
                  }`}>
                    {tx.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface dark:text-dark-on-surface text-sm">{tx.description}</h4>
                    <p className="text-[10px] font-medium text-on-surface-variant">{tx.date} • {tx.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className={`text-sm font-black ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Completed</p>
                  </div>

                  {role === 'admin' && (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingTx(tx)}
                        className="p-2 shadow-raised-sm rounded-full text-primary-accent hover:scale-110 transition-transform"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="p-2 shadow-raised-sm rounded-full text-expense hover:scale-110 transition-transform"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                  <ChevronRight size={18} className="text-on-surface-variant" />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-on-surface-variant font-medium">No transactions found matching your criteria.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingTx && <EditModal tx={editingTx} onClose={() => setEditingTx(null)} />}
      </AnimatePresence>
    </div>
  );
};
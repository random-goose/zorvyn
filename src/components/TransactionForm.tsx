import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { CATEGORIES } from '../data/mockData';
import { X } from 'lucide-react';
import { motion } from 'motion/react';

export const TransactionForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addTransaction } = useFinance();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: CATEGORIES[0],
    type: 'expense' as const,
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction({
      ...formData,
      amount: parseFloat(formData.amount)
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
        className="shadow-raised bg-surface dark:bg-dark-surface w-full max-w-lg rounded-2xl p-8 relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-on-surface dark:text-dark-on-surface">Add Transaction</h3>
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
                placeholder="e.g. Apple Store"
                className="bg-transparent border-none focus:ring-0 text-sm text-on-surface dark:text-dark-on-surface w-full"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
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
                  placeholder="0.00"
                  className="bg-transparent border-none focus:ring-0 text-sm text-on-surface dark:text-dark-on-surface w-full"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Type</label>
              <div className="shadow-inset h-12 rounded-xl flex items-center px-4">
                <select 
                  className="bg-transparent border-none focus:ring-0 text-sm text-on-surface dark:text-dark-on-surface w-full appearance-none"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as any})}
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
                  onChange={e => setFormData({...formData, category: e.target.value})}
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
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-6 pt-4">
            <button type="button" onClick={onClose} className="text-xs font-black text-on-surface-variant hover:text-on-surface tracking-widest uppercase">Cancel</button>
            <button type="submit" className="shadow-raised px-10 py-3 rounded-full bg-surface dark:bg-dark-surface text-sm font-black text-primary-accent neumorphic-active">
              Save Transaction
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

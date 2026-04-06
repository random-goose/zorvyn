import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, UserRole } from '../types';
import { MOCK_TRANSACTIONS } from '../data/mockData';

export type PageId = 'overview' | 'transactions' | 'budgets' | 'investments' | 'settings';

interface FinanceContextType {
  transactions: Transaction[];
  role: UserRole;
  theme: 'light' | 'dark';
  activePage: PageId;
  setRole: (role: UserRole) => void;
  toggleTheme: () => void;
  setActivePage: (page: PageId) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  resetData: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('fintrack_transactions');
    return saved ? JSON.parse(saved) : MOCK_TRANSACTIONS;
  });

  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('fintrack_role');
    return (saved as UserRole) || 'admin';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('fintrack_theme');
    if (saved) return saved as 'light' | 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [activePage, setActivePage] = useState<PageId>('overview');

  useEffect(() => {
    localStorage.setItem('fintrack_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fintrack_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('fintrack_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const addTransaction = (newTx: Omit<Transaction, 'id'>) => {
    if (role !== 'admin') return;
    const transaction: Transaction = {
      ...newTx,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    if (role !== 'admin') return;
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    if (role !== 'admin') return;
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...updates } : tx));
  };

  const resetData = () => {
    localStorage.removeItem('fintrack_transactions');
    setTransactions(MOCK_TRANSACTIONS);
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      role,
      theme,
      activePage,
      setRole,
      toggleTheme,
      setActivePage,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      resetData,
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
};

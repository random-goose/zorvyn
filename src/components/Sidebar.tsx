import React, { useState } from 'react';
import { useFinance, PageId } from '../context/FinanceContext';
import { LayoutDashboard, ReceiptText, Wallet, BarChart3, Settings, Sun, Moon, Shield, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const NAV_ITEMS: { id: PageId; icon: React.ReactNode; label: string }[] = [
  { id: 'overview', icon: <LayoutDashboard size={20} />, label: 'Overview' },
  { id: 'transactions', icon: <ReceiptText size={20} />, label: 'Transactions' },
  { id: 'budgets', icon: <Wallet size={20} />, label: 'Budgets' },
  { id: 'investments', icon: <BarChart3 size={20} />, label: 'Investments' },
  { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
];

const SidebarContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { role, setRole, theme, toggleTheme, activePage, setActivePage } = useFinance();

  return (
    <div className="h-full flex flex-col pt-24">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-6 right-6 shadow-raised p-2 rounded-full text-on-surface-variant md:hidden"
        >
          <X size={20} />
        </button>
      )}

      <div className="px-8 mb-10">
        <div className="shadow-raised rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 shadow-inset rounded-xl flex items-center justify-center text-primary-accent">
            <Shield size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-primary-accent uppercase tracking-widest">Premium Tier</p>
            <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface">Tactile Finance</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map(item => (
          <div
            key={item.id}
            onClick={() => {
              setActivePage(item.id);
              if (onClose) onClose();
            }}
            className={`mx-4 py-3 px-4 flex items-center gap-4 rounded-xl cursor-pointer transition-all duration-200 ${
              activePage === item.id
                ? 'shadow-inset text-primary-accent'
                : 'text-on-surface-variant hover:text-on-surface hover:translate-x-1'
            }`}
          >
            {item.icon}
            <span className="text-sm font-medium tracking-wide">{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="p-8 space-y-6">
        <div className="shadow-inset p-1 rounded-xl flex">
          <button
            onClick={() => setRole('viewer')}
            className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-2 ${
              role === 'viewer' ? 'shadow-raised bg-surface dark:bg-dark-surface text-primary-accent' : 'text-on-surface-variant'
            }`}
          >
            <User size={12} /> Viewer
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-2 ${
              role === 'admin' ? 'shadow-raised bg-surface dark:bg-dark-surface text-primary-accent' : 'text-on-surface-variant'
            }`}
          >
            <Shield size={12} /> Admin
          </button>
        </div>

        <button
          onClick={toggleTheme}
          className="w-full py-4 shadow-raised rounded-2xl text-on-surface-variant font-bold text-xs flex items-center justify-center gap-2 neumorphic-active"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface dark:bg-dark-surface z-40 hidden md:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-6 left-6 z-50 shadow-raised p-3 rounded-full bg-surface dark:bg-dark-surface text-on-surface-variant"
      >
        <Menu size={20} />
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-on-surface/20 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-72 bg-surface dark:bg-dark-surface z-50 md:hidden shadow-raised relative"
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
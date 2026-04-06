import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { motion } from 'motion/react';
import { Moon, Sun, Shield, User, AlertTriangle } from 'lucide-react';
import avatar from '../data/avatar.svg';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme, role, setRole, resetData } = useFinance();

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data and revert to mock transactions? This cannot be undone.")) {
      resetData();
      alert("Data has been reset.");
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 max-w-3xl"
    >
      <header>
        <h1 className="text-3xl font-black text-on-surface dark:text-dark-on-surface">Settings</h1>
        <p className="text-on-surface-variant mt-2 text-sm font-medium">Preferences, access, and data management</p>
      </header>

      <section className="bg-surface dark:bg-dark-surface shadow-raised rounded-3xl p-8 space-y-10">
        {/* Profile */}
        <div>
          <h2 className="text-sm font-black tracking-widest uppercase text-on-surface-variant mb-6">Your Profile</h2>
          <div className="flex items-center gap-6">
            <div className="shadow-inset p-2 rounded-2xl">
              <img
                src={avatar}
                alt="User"
                className="w-16 h-16 rounded-xl object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <p className="text-lg font-bold text-on-surface dark:text-dark-on-surface">Ruthwik Alamuru</p>
              <p className="text-sm text-on-surface-variant">ruthwik@zorvyn.io</p>
              <p className="text-sm text-on-surface-variant">7569097948@kotak811</p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h2 className="text-sm font-black tracking-widest uppercase text-on-surface-variant mb-6">Preferences</h2>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-surface dark:bg-dark-surface shadow-inset p-4 rounded-2xl">
            <div className="space-y-1 flex-1 text-center sm:text-left">
              <p className="font-bold text-on-surface dark:text-dark-on-surface">Appearance</p>
              <p className="text-xs text-on-surface-variant">Toggle between light and dark mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className="w-full sm:w-auto px-6 py-3 shadow-raised rounded-xl text-on-surface-variant font-bold text-xs flex items-center justify-center gap-3 neumorphic-active"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            </button>
          </div>
        </div>

        {/* Access Role */}
        <div>
          <h2 className="text-sm font-black tracking-widest uppercase text-on-surface-variant mb-6">Access Control</h2>
          <p className="text-xs text-on-surface-variant mb-4">Viewers cannot add or delete transactions.</p>

          <div className="shadow-inset p-1.5 rounded-xl flex">
            <button
              onClick={() => setRole('viewer')}
              className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${role === 'viewer' ? 'shadow-raised bg-surface dark:bg-dark-surface text-primary-accent' : 'text-on-surface-variant'
                }`}
            >
              <User size={14} /> Viewer Mode
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${role === 'admin' ? 'shadow-raised bg-surface dark:bg-dark-surface text-primary-accent' : 'text-on-surface-variant'
                }`}
            >
              <Shield size={14} /> Admin Mode
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-6 border-t border-on-surface-variant/20">
          <h2 className="text-sm font-black tracking-widest uppercase text-expense mb-4 flex items-center gap-2">
            <AlertTriangle size={16} /> Danger Zone
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-expense/10 dark:bg-expense/5 p-4 rounded-2xl border border-expense/20">
            <div className="space-y-1 flex-1 text-center sm:text-left">
              <p className="font-bold text-expense">Factory Reset</p>
              <p className="text-xs text-expense/80">Wipe local storage and load default mock data</p>
            </div>
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-6 py-3 bg-expense text-white rounded-xl font-bold text-xs shadow-md hover:bg-expense/90 transition-colors active:scale-95"
            >
              Reset Data
            </button>
          </div>
        </div>

      </section>
    </motion.div>
  );
};

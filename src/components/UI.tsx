// ChartSkeleton: shows loading state for charts
export const ChartSkeleton = () => (
  <div className="animate-pulse flex flex-col gap-4">
    <div className="bg-surface-variant h-40 rounded-2xl w-full" />
    <div className="bg-surface-variant h-8 rounded-xl w-1/2 mx-auto" />
  </div>
);

// ChartError: shows error state for charts
export const ChartError = () => (
  <div className="flex flex-col items-center justify-center text-center p-8 text-error">
    <span className="text-4xl mb-2">⚠️</span>
    <p className="font-bold">Failed to load chart data.</p>
    <p className="text-xs text-on-surface-variant mt-1">Please try again later.</p>
  </div>
);
import React from 'react';
import { motion } from 'motion/react';

interface NeumorphicCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'raised' | 'inset';
  onClick?: () => void;
}

export const NeumorphicCard: React.FC<NeumorphicCardProps> = ({ 
  children, 
  className = '', 
  variant = 'raised',
  onClick 
}) => {
  const baseClasses = variant === 'raised' ? 'shadow-raised' : 'shadow-inset';
  
  return (
    <motion.div 
      whileHover={onClick ? { scale: 0.99 } : {}}
      whileTap={onClick ? { scale: 0.97 } : {}}
      onClick={onClick}
      className={`rounded-2xl p-6 bg-surface dark:bg-dark-surface transition-all duration-300 ${baseClasses} ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {children}
    </motion.div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color = 'text-primary-accent' }) => {
  const isPositive = change && change > 0;
  
  return (
    <NeumorphicCard className="flex flex-col justify-between h-44">
      <div className="flex justify-between items-start">
        <div className={`w-10 h-10 shadow-inset rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        {change !== undefined && (
          <span className={`px-2 py-1 shadow-inset rounded-full text-[10px] font-bold ${isPositive ? 'text-income' : 'text-expense'}`}>
            {isPositive ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-tighter">{title}</p>
        <p className="text-2xl font-black text-on-surface dark:text-dark-on-surface tracking-tighter">{value}</p>
      </div>
    </NeumorphicCard>
  );
};

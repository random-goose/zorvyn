import React from 'react';
import { useApi } from '../hooks/useApi';
import { fetchPortfolio } from '../api/financeApi';
import { motion } from 'motion/react';
import { StatCard } from './UI';
import { TrendingUp, BarChart3 } from 'lucide-react';

export const InvestmentsPage: React.FC = () => {
  const portfolio = useApi(fetchPortfolio);
  
  const holdings = portfolio.data ?? [];
  const totalValue = holdings.reduce((sum, h) => sum + (h.currentPrice * h.qty), 0);
  const totalCost = holdings.reduce((sum, h) => sum + (h.buyPrice * h.qty), 0);
  const totalPnL = totalValue - totalCost;
  const pnlPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  if (portfolio.loading) return <div className="text-on-surface-variant p-8 text-center animate-pulse">Loading portfolio...</div>;

  // Donut chart logic
  const R = 42;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  let offset = 0;
  const slices = holdings.map(h => {
    const value = h.currentPrice * h.qty;
    const dash = (value / totalValue) * CIRCUMFERENCE;
    const slice = { ...h, dash, offset, value };
    offset += dash;
    return slice;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <header>
        <h1 className="text-3xl font-black text-on-surface dark:text-dark-on-surface">Investments</h1>
        <p className="text-on-surface-variant mt-2 text-sm font-medium">Portfolio performance and allocation</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <StatCard
          title="Portfolio Value"
          value={`₹${totalValue.toLocaleString()}`}
          icon={<BarChart3 size={20} />}
        />
        <StatCard
          title="Total P&L"
          value={`₹${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          change={Number(pnlPercent.toFixed(2))}
          icon={<TrendingUp size={20} />}
          color={totalPnL >= 0 ? 'text-income' : 'text-expense'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Allocation Donut */}
        <div className="rounded-3xl p-10 bg-surface dark:bg-dark-surface flex flex-col items-center shadow-raised">
          <h2 className="text-xl font-semibold text-on-surface dark:text-dark-on-surface">Allocation</h2>
          <div className="relative w-52 h-52 mt-8">
            <svg className="-rotate-90" viewBox="0 0 100 100">
              {slices.map(s => (
                <circle
                  key={s.ticker}
                  cx="50"
                  cy="50"
                  r={R}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="12"
                  strokeDasharray={`${s.dash} ${CIRCUMFERENCE}`}
                  strokeDashoffset={-s.offset}
                  strokeLinecap="round"
                />
              ))}
              <g transform="rotate(90 50 50)" className="text-on-surface dark:text-dark-on-surface">
                <text x="50" y="52" textAnchor="middle" fontSize="14" fontWeight="600" fill="currentColor">
                  {holdings.length}
                </text>
                <text x="50" y="65" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.5" letterSpacing="1">
                  ASSETS
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="lg:col-span-2 rounded-3xl p-8 overflow-x-auto bg-surface dark:bg-dark-surface shadow-raised">
          <h2 className="text-xl font-semibold text-on-surface dark:text-dark-on-surface mb-6">Holdings</h2>
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-on-surface-variant/20">
                <th className="pb-4 text-[10px] font-black tracking-widest uppercase text-on-surface-variant">Asset</th>
                <th className="pb-4 text-[10px] font-black tracking-widest uppercase text-on-surface-variant text-right">Qty</th>
                <th className="pb-4 text-[10px] font-black tracking-widest uppercase text-on-surface-variant text-right">Avg Price</th>
                <th className="pb-4 text-[10px] font-black tracking-widest uppercase text-on-surface-variant text-right">LTP</th>
                <th className="pb-4 text-[10px] font-black tracking-widest uppercase text-on-surface-variant text-right">P&L</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map(h => {
                const pnl = (h.currentPrice - h.buyPrice) * h.qty;
                const pnlPct = ((h.currentPrice - h.buyPrice) / h.buyPrice) * 100;
                const isPositive = pnl >= 0;
                return (
                  <tr key={h.ticker} className="border-b border-on-surface-variant/10 last:border-0 hover:bg-on-surface-variant/5 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: h.color }} />
                        <div>
                          <p className="font-bold text-on-surface dark:text-dark-on-surface text-sm">{h.ticker}</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">{h.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right font-medium text-on-surface dark:text-dark-on-surface text-sm">{h.qty}</td>
                    <td className="py-4 text-right font-medium text-on-surface dark:text-dark-on-surface text-sm">₹{h.buyPrice.toLocaleString()}</td>
                    <td className="py-4 text-right font-medium text-on-surface dark:text-dark-on-surface text-sm">₹{h.currentPrice.toLocaleString()}</td>
                    <td className="py-4 text-right">
                      <p className={`text-sm font-black ${isPositive ? 'text-income' : 'text-expense'}`}>
                        {isPositive ? '+' : '-'}₹{Math.abs(pnl).toLocaleString()}
                      </p>
                      <p className={`text-xs font-bold mt-0.5 ${isPositive ? 'text-income/80' : 'text-expense/80'}`}>
                        {isPositive ? '+' : ''}{pnlPct.toFixed(2)}%
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

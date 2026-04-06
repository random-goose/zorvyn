
import type { FC } from 'react';
import { useApi } from '../hooks/useApi';
import { fetchBalanceTrend, fetchSpendingBreakdown } from '../api/financeApi';
import { ChartSkeleton, ChartError } from './UI';


export const DashboardCharts: FC = () => {
  const trend = useApi(fetchBalanceTrend);
  const breakdown = useApi(fetchSpendingBreakdown);

  const trendPoints = trend.data ?? [];
  const maxVal = Math.max(...trendPoints.map(p => p.value), 1);

  const WIDTH = 600;
  const HEIGHT = 220;
  const PADDING = 40;

  const svgPoints = trendPoints
    .map((p, i) => {
      const x = PADDING + (i / (trendPoints.length - 1)) * (WIDTH - 2 * PADDING);
      const y = HEIGHT - PADDING - ((p.value / maxVal) * (HEIGHT - 2 * PADDING));
      return `${x},${y}`;
    })
    .join(' ');

  // Donut
  const R = 42;
  const CIRCUMFERENCE = 2 * Math.PI * R;

  let offset = 0;
  const slices = (breakdown.data ?? []).map(cat => {
    const dash = (cat.percentage / 100) * CIRCUMFERENCE;
    const slice = { ...cat, dash, offset };
    offset += dash;
    return slice;
  });

    const total = (breakdown.data ?? []).reduce((s, c) => s + (c.amount || 0), 0);

  if (trend.loading || breakdown.loading) return <ChartSkeleton />;
  if (trend.error || breakdown.error) return <ChartError />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* Balance Trend */}
      <div className="lg:col-span-2 rounded-3xl p-10 bg-surface dark:bg-dark-surface shadow-raised relative">

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-on-surface dark:text-dark-on-surface">Balance Trend</h2>
          <p className="text-sm text-on-surface-variant">Net worth growth over the last 6 months</p>
        </div>

        <div className="absolute right-8 top-8 flex gap-2">
          <button className="px-4 py-1.5 rounded-lg shadow-inset text-on-surface dark:text-dark-on-surface text-sm font-semibold">
            6M
          </button>
          <button className="px-4 py-1.5 rounded-lg text-on-surface-variant text-sm">
            1Y
          </button>
        </div>

        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full">

          <defs>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6C63FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#6C63FF" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Bars */}
          {trendPoints.map((p, i) => {
            const x =
              PADDING +
              (i / (trendPoints.length - 1)) * (WIDTH - 2 * PADDING);

            const height =
              (p.value / maxVal) * (HEIGHT - 2 * PADDING);

            return (
              <rect
                key={i}
                x={x - 10}
                y={HEIGHT - PADDING - height}
                width={20}
                height={height}
                rx={6}
                fill="url(#barGrad)"
                opacity={0.5}
              />
            );
          })}

          {/* Line */}
          <polyline
            points={svgPoints}
            fill="none"
            stroke="#7c74ff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#softGlow)"
          />
        </svg>

        <div className="flex justify-between mt-4 px-2 text-sm text-on-surface-variant">
          {trendPoints.map(p => (
            <span key={p.month}>{p.month}</span>
          ))}
        </div>
      </div>

      {/* Donut */}
      <div className="rounded-3xl p-10 bg-surface dark:bg-dark-surface flex flex-col items-center shadow-raised">

        <h2 className="text-2xl font-semibold text-on-surface dark:text-dark-on-surface">Spending Breakdown</h2>
        <p className="text-sm text-on-surface-variant mb-6">Categorized monthly outflow</p>

        <div className="relative w-52 h-52">
          <svg className="-rotate-90" viewBox="0 0 100 100">

            {slices.map(s => (
              <circle
                key={s.category}
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
              <text
                x="50"
                y="45"
                textAnchor="middle"
                fontSize="16"
                fontWeight="600"
                fill="currentColor"
              >
                  ₹{total > 0 ? (total / 1000).toFixed(1) : 0}k
              </text>
              <text
                x="50"
                y="60"
                textAnchor="middle"
                fontSize="9"
                fill="currentColor"
                opacity="0.5"
                letterSpacing="2"
              >
                TOTAL
              </text>
            </g>
          </svg>
        </div>

        {/* Legend */}
        <div style={{ height: '7vh'}}></div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 w-full mt-6 text-sm">
          {slices.map(s => (
            <div key={s.category} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: s.color }}
              />
              <span className="text-on-surface-variant">{s.category}</span>
              <span className="ml-auto text-on-surface dark:text-dark-on-surface font-semibold">
                ₹{(s.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
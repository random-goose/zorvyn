// Simulates network latency
const delay = (ms = 600) => new Promise(res => setTimeout(res, ms));

// --- Types ---
export interface SummaryStats {
  balance: number;
  income: number;
  expenses: number;
  savingsRate: number;
  balanceChange: number;
  incomeChange: number;
  expensesChange: number;
}

export interface TrendPoint {
  month: string;
  value: number;
}

export interface SpendingCategory {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface Insight {
  id: string;
  type: 'warning' | 'positive' | 'neutral';
  title: string;
  body: string;
}

// --- Endpoints ---
export async function fetchSummaryStats(): Promise<SummaryStats> {
  await delay();
  return {
    balance: 671644.50,
    income: 861245.00,
    expenses: 189600.50,
    savingsRate: 78,
    balanceChange: 2.4,
    incomeChange: 8.1,
    expensesChange: -1.2,
  };
}

export async function fetchBalanceTrend(): Promise<TrendPoint[]> {
  await delay(800);
  return [
    { month: 'Nov', value: 520000 },
    { month: 'Dec', value: 598000 },
    { month: 'Jan', value: 575000 },
    { month: 'Feb', value: 622000 },
    { month: 'Mar', value: 651000 },
    { month: 'Apr', value: 671644 },
  ];
}

export async function fetchSpendingBreakdown(): Promise<SpendingCategory[]> {
  await delay(700);
  return [
    { category: 'Electronics', amount: 129900, percentage: 68, color: '#6C63FF' },
    { category: 'Subscriptions', amount: 24000, percentage: 13, color: '#F5A623' },
    { category: 'Dining', amount: 14200, percentage: 7, color: '#E07C7C' },
    { category: 'Housing', amount: 12000, percentage: 6, color: '#4CAF89' },
    { category: 'Other', amount: 9500, percentage: 6, color: '#9E9E9E' },
  ];
}

export async function fetchInsights(): Promise<Insight[]> {
  await delay(900);
  return [
    {
      id: 'ins-1',
      type: 'warning',
      title: 'Top Spending Category',
      body: 'Electronics accounts for 68% of your spend this month at ₹1,29,900. Consider setting a ₹1,00,000 cap to reduce next month\'s outflow.',
    },
    {
      id: 'ins-2',
      type: 'positive',
      title: 'Month-on-Month',
      body: 'Your net balance is up 3.2% vs March (₹6,51,000 → ₹6,71,644). On track to cross ₹7,00,000 next month.',
    },
    {
      id: 'ins-3',
      type: 'neutral',
      title: 'Savings Rate',
      body: 'You saved 78% of income this month — well above the recommended 20%. Exceptional discipline.',
    },
  ];
}

// --- Budgets ---
export interface Budget {
  category: string;
  cap: number;
  color: string;
}

export async function fetchBudgets(): Promise<Budget[]> {
  await delay(600);
  return [
    { category: 'Electronics', cap: 100000, color: '#6C63FF' },
    { category: 'Dining', cap: 20000, color: '#E07C7C' },
    { category: 'Transport', cap: 8000, color: '#F5A623' },
    { category: 'Wellness', cap: 10000, color: '#4CAF89' },
    { category: 'Subscriptions', cap: 30000, color: '#9E9E9E' },
    { category: 'Housing', cap: 15000, color: '#29B6F6' },
  ];
}

// --- Investments ---
export interface Holding {
  name: string;
  ticker: string;
  qty: number;
  buyPrice: number;
  currentPrice: number;
  color: string;
}

export async function fetchPortfolio(): Promise<Holding[]> {
  await delay(700);
  return [
    { name: 'Reliance Industries', ticker: 'RELIANCE', qty: 10, buyPrice: 2450, currentPrice: 2891, color: '#6C63FF' },
    { name: 'HDFC Bank', ticker: 'HDFCBANK', qty: 15, buyPrice: 1520, currentPrice: 1672, color: '#4CAF89' },
    { name: 'Infosys', ticker: 'INFY', qty: 20, buyPrice: 1380, currentPrice: 1495, color: '#F5A623' },
    { name: 'Tata Motors', ticker: 'TATAMOTORS', qty: 30, buyPrice: 620, currentPrice: 798, color: '#E07C7C' },
    { name: 'Nifty 50 ETF', ticker: 'NIFTYBEES', qty: 50, buyPrice: 210, currentPrice: 238, color: '#29B6F6' },
  ];
}
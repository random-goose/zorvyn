import { Transaction } from '../types';

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: '2024-03-28',
    amount: 129900.00,
    category: 'Electronics',
    type: 'expense',
    description: 'Apple Online Store',
  },
  {
    id: '2',
    date: '2024-03-26',
    amount: 850000.00,
    category: 'Income',
    type: 'income',
    description: 'Monthly Salary - Zorvyn Pvt Ltd',
  },
  {
    id: '3',
    date: '2024-03-25',
    amount: 14200.50,
    category: 'Dining',
    type: 'expense',
    description: 'ITC Kohenoor - Dinner with Friends',
  },
  {
    id: '4',
    date: '2024-03-24',
    amount: 3500.00,
    category: 'Transport',
    type: 'expense',
    description: 'L&T Metro Card Recharge',
  },
  {
    id: '5',
    date: '2024-03-22',
    amount: 11245.00,
    category: 'Investment',
    type: 'income',
    description: 'Stock Dividend',
  },
  {
    id: '6',
    date: '2024-03-20',
    amount: 6000.00,
    category: 'Wellness',
    type: 'expense',
    description: 'Cult Elite Membership',
  },
  {
    id: '7',
    date: '2024-03-18',
    amount: 24000.00,
    category: 'Subscriptions',
    type: 'expense',
    description: 'Cloud Services Annual',
  },
  {
    id: '8',
    date: '2024-03-15',
    amount: 12000.00,
    category: 'Housing',
    type: 'expense',
    description: 'Monthly Rent Contribution',
  }
];

export const CATEGORIES = [
  'Electronics',
  'Income',
  'Dining',
  'Transport',
  'Investment',
  'Wellness',
  'Subscriptions',
  'Housing',
  'Shopping',
  'Other'
];

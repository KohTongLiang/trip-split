
export enum Currency {
  JPY = 'JPY',
  SGD = 'SGD',
}

export type TransactionType = 'expense' | 'income';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: Currency;
  type: TransactionType;
  paidBy: string; // Member name
  splitAmong: string[]; // Member names that share this expense
  exchangeRate?: number; // Snapshot of exchange rate at time of expense
}

export interface Settlement {
  from: string; // Member name
  to: string; // Member name
  amount: number;
}

export interface Balance {
  id: string; // Member name (acts as id)
  balance: number;
}

export interface Group {
  id: string;
  name: string;
  members: string[]; // Member names in this group
  expenses: Expense[];
}

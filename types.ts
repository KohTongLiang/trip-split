
export enum Currency {
  JPY = 'JPY',
  SGD = 'SGD',
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: Currency;
  paidBy: string; // Member name
  splitAmong: string[]; // Member names that share this expense
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

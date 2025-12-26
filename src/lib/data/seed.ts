
import { type Group, type Expense, Currency } from '../types';

const MEMBERS = ['Tongliang', 'Weiren', 'Chris', 'David'];

const all = MEMBERS;

const EXPENSES: Expense[] = [
  // Weiren's Expenses (Assumed as primary payer)
  { id: 'exp1', description: 'First toll booth', amount: 780, currency: Currency.JPY, paidBy: 'Weiren', splitAmong: all },
  { id: 'exp2', description: 'Gujo Hachiman toll booth', amount: 1710, currency: Currency.JPY, paidBy: 'Weiren', splitAmong: all },
  { id: 'exp3', description: 'Shirakawa-go toll booth', amount: 2270, currency: Currency.JPY, paidBy: 'Weiren', splitAmong: all },
  { id: 'exp4', description: 'Shirakawa parking', amount: 1000, currency: Currency.JPY, paidBy: 'Weiren', splitAmong: all },
  { id: 'exp5', description: 'Towards Takayama toll booth', amount: 1030, currency: Currency.JPY, paidBy: 'Weiren', splitAmong: all },
  { id: 'exp6', description: 'Parking Tuesday Nakasendo', amount: 500, currency: Currency.JPY, paidBy: 'Weiren', splitAmong: all },
  { id: 'exp7', description: 'Nagoya return toll', amount: 1650, currency: Currency.JPY, paidBy: 'Weiren', splitAmong: all },
  { id: 'exp8', description: 'Nagoya toll 2', amount: 1070, currency: Currency.JPY, paidBy: 'Weiren', splitAmong: all },
  { id: 'exp9', description: 'Nagoya parking', amount: 600, currency: Currency.JPY, paidBy: 'Weiren', splitAmong: all },
  { id: 'exp10', description: 'Udon', amount: 8250, currency: Currency.JPY, paidBy: 'Weiren', splitAmong: all },
  { id: 'exp11', description: 'Yamachan 2', amount: 15720, currency: Currency.JPY, paidBy: 'Weiren', splitAmong: all },
  { id: 'exp12', description: 'Nagoya Aquarium ($17.70/pax)', amount: 17.70 * 4, currency: Currency.SGD, paidBy: 'Weiren', splitAmong: all },
  { id: 'exp13', description: 'Nagoya Sushi (1/5 for TL/WR)', amount: 10461, currency: Currency.JPY, paidBy: 'Weiren', splitAmong: ['Tongliang', 'Weiren'] },

  // Tongliang's Expenses
  { id: 'exp14', description: 'Gujo parking', amount: 500, currency: Currency.JPY, paidBy: 'Tongliang', splitAmong: all },
  { id: 'exp15', description: 'Fuel', amount: 2855, currency: Currency.JPY, paidBy: 'Tongliang', splitAmong: all },
  { id: 'exp16', description: 'Fuel top up', amount: 1960, currency: Currency.JPY, paidBy: 'Tongliang', splitAmong: all },
  { id: 'exp17', description: 'Gujo lunch', amount: 9650, currency: Currency.JPY, paidBy: 'Tongliang', splitAmong: all },
  { id: 'exp18', description: 'Shinkansen to Osaka', amount: 29520, currency: Currency.JPY, paidBy: 'Tongliang', splitAmong: ['Tongliang'] }, // single-person
];

export const GROUPS: Group[] = [
  {
    id: 'grp1',
    name: 'Nagoya Trip',
    members: all,
    expenses: EXPENSES,
  },
];


import { useMemo } from 'react';
import { Expense, Settlement, Balance, Currency } from '../types';

const BASE_CURRENCY = Currency.SGD;

export const useBillSplitter = (members: string[], expenses: Expense[], jpyToSgdRate: number) => {
  const calculations = useMemo(() => {
    if (members.length === 0) {
      return {
        totalSpent: 0,
        balances: [],
        settlements: [],
        totalSpentByPerson: new Map<string, number>(),
      };
    }

    const convertToSgd = (amount: number, currency: Currency): number => {
      if (currency === Currency.JPY) {
        return amount / jpyToSgdRate;
      }
      return amount;
    };

    const totalSpentByPerson = new Map<string, number>();
    const owedByPerson = new Map<string, number>();
    members.forEach(name => {
      totalSpentByPerson.set(name, 0);
      owedByPerson.set(name, 0);
    });

    let totalSpentInSgd = 0;

    expenses.forEach(expense => {
      const amountInSgd = convertToSgd(expense.amount, expense.currency);
      totalSpentInSgd += amountInSgd;

      // Paid amount
      const currentPaid = totalSpentByPerson.get(expense.paidBy) || 0;
      totalSpentByPerson.set(expense.paidBy, currentPaid + amountInSgd);

      // Owed share among participants (supports single person or subset)
      const participants = expense.splitAmong && expense.splitAmong.length > 0
        ? expense.splitAmong
        : members;
      const share = amountInSgd / participants.length;
      participants.forEach(pid => {
        const cur = owedByPerson.get(pid) || 0;
        owedByPerson.set(pid, cur + share);
      });
    });

    const initialBalances: Balance[] = members.map(name => ({
      id: name,
      balance: (totalSpentByPerson.get(name) || 0) - (owedByPerson.get(name) || 0),
    }));

    // Settlement Logic
    const debtors = initialBalances.filter(p => p.balance < 0).sort((a, b) => a.balance - b.balance);
    const creditors = initialBalances.filter(p => p.balance > 0).sort((a, b) => b.balance - a.balance);
    const settlements: Settlement[] = [];

    while (debtors.length > 0 && creditors.length > 0) {
      const debtor = debtors[0];
      const creditor = creditors[0];
      const amountToSettle = Math.min(Math.abs(debtor.balance), creditor.balance);

      if (amountToSettle < 0.01) {
        // Negligible amount, remove one to prevent infinite loops on floating point errors
        if (Math.abs(debtor.balance) < Math.abs(creditor.balance)) {
          debtors.shift();
        } else {
          creditors.shift();
        }
        continue;
      }

      settlements.push({
        from: debtor.id,
        to: creditor.id,
        amount: amountToSettle,
      });

      debtor.balance += amountToSettle;
      creditor.balance -= amountToSettle;

      if (Math.abs(debtor.balance) < 0.01) {
        debtors.shift();
      }
      if (Math.abs(creditor.balance) < 0.01) {
        creditors.shift();
      }
    }

    return {
      totalSpent: totalSpentInSgd,
      balances: initialBalances,
      settlements,
      totalSpentByPerson,
    };
  }, [members, expenses, jpyToSgdRate]);

  return calculations;
};

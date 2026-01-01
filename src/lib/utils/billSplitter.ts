import { Currency, type Expense, type Settlement, type Balance } from '../types';

export const calculateSplits = (members: string[], expenses: Expense[], jpyToSgdRate: number) => {
    if (members.length === 0) {
        return {
            totalSpent: 0,
            totalExpense: 0,
            totalIncome: 0,
            balances: [],
            settlements: [],
            totalSpentByPerson: new Map<string, number>(),
        };
    }

    const convertToSgd = (amount: number, currency: Currency, exchangeRate?: number): number => {
        if (currency === Currency.JPY) {
            const rate = exchangeRate || jpyToSgdRate;
            return amount / rate;
        }
        return amount;
    };

    const totalSpentByPerson = new Map<string, number>();
    const owedByPerson = new Map<string, number>();
    members.forEach(name => {
        totalSpentByPerson.set(name, 0);
        owedByPerson.set(name, 0);
    });

    let totalExpenseInSgd = 0;
    let totalIncomeInSgd = 0;

    expenses.forEach(expense => {
        const amountInSgd = convertToSgd(expense.amount, expense.currency, expense.exchangeRate);
        const isIncome = expense.type === 'income';

        if (isIncome) {
            totalIncomeInSgd += amountInSgd;
        } else {
            totalExpenseInSgd += amountInSgd;
        }

        const multiplier = isIncome ? -1 : 1;

        // Paid amount
        const currentPaid = totalSpentByPerson.get(expense.paidBy) || 0;
        totalSpentByPerson.set(expense.paidBy, currentPaid + (amountInSgd * multiplier));

        // Owed share among participants (supports single person or subset)
        const participants = expense.splitAmong && expense.splitAmong.length > 0
            ? expense.splitAmong
            : members;
        const share = amountInSgd / participants.length;
        participants.forEach(pid => {
            const cur = owedByPerson.get(pid) || 0;
            owedByPerson.set(pid, cur + (share * multiplier));
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
        totalSpent: totalExpenseInSgd - totalIncomeInSgd,
        totalExpense: totalExpenseInSgd,
        totalIncome: totalIncomeInSgd,
        balances: initialBalances,
        settlements,
        totalSpentByPerson,
    };
};

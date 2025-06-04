import type { Transaction } from "./vendor/pocketbase";

const formatCurrency = (amount: number) => {
    return Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount / 100);
};

const groupBy = (array: Transaction[], key: keyof Transaction) => {
    return array.reduce((acc, item) => {
        const group = acc[item[key] as string] || [];
        group.push(item);
        acc[item[key] as string] = group;
        return acc;
    }, {} as Record<string, Transaction[]>);
};

const reduceTransactions = (transactions: Transaction[]) => {
    return transactions.reduce((acc, transaction) => acc + transaction.amount_cents, 0)
}

export { formatCurrency, groupBy, reduceTransactions };
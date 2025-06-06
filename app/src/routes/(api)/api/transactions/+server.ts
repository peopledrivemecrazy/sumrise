import { pb, type Transaction } from '$lib/vendor/pocketbase';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    // Get current date
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Format dates in RFC3399 format
    const startDate = firstDayOfMonth.toISOString();
    const endDate = lastDayOfMonth.toISOString();

    const transactions = await pb.collection('transactions').getFullList<Transaction>({
        filter: `date >= '${startDate}' && date <= '${endDate}'`
    });

    return json(transactions);
};


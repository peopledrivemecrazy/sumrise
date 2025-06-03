import { pb, type Transaction } from '$lib/vendor/pocketbase';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const transactions = await pb.collection('transactions').getFullList<Transaction>()
    return json(transactions);
};
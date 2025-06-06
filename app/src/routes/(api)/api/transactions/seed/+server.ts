import type { RequestHandler } from './$types';
import transactions from '$lib/vendor/pocketbase/source_data/sample-jan-25.json'
import transactionsFeb25ToMay25 from '$lib/vendor/pocketbase/source_data/sample-feb-25-to-may-25.json'
import { pb } from '$lib/vendor/pocketbase';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    return seedFeb25ToMay25();
}


const seedBase = async () => {
    const batch = pb.createBatch();
    try {
        transactions.forEach(transaction => {
            // Convert Unix timestamp to ISO date string
            const transactionWithFormattedDate = {
                ...transaction,
                date: new Date(transaction.date * 1000).toISOString()
            };
            batch.collection('transactions').create(transactionWithFormattedDate);
        });
        const result = await batch.send();
        return json(result)
    } catch (error) {
        console.dir(error, { depth: 8 })
        return json({ error: 'Failed to seed transactions' }, { status: 500 })
    }
}

const seedFeb25ToMay25 = async () => {
    const batch = pb.createBatch();
    try {
        transactionsFeb25ToMay25.forEach(transaction => {
            // Convert Unix timestamp to ISO date string
            const transactionWithFormattedDate = {
                ...transaction,
                merchant_name: transaction.merchant,
                card_type: 'Visa',
                card_last4: 'XXXX',
                location: 'N/A',
            };
            batch.collection('transactions').create(transactionWithFormattedDate);
        });
        const result = await batch.send();
        return json(result)
    } catch (error) {
        console.dir(error, { depth: 8 })
        return json({ error: 'Failed to seed transactions' }, { status: 500 })
    }
}
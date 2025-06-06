import { pb } from '$lib/vendor/pocketbase';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import seed_data from '$lib/vendor/pocketbase/source_data/sample-feb-25-to-may-25.json';
import seed_transactions_data from '$lib/vendor/pocketbase/source_data/sample-feb-25-to-may-25.json';

export const GET: RequestHandler = async () => {
    try {
        const seed_raw_emails_result = await seed_raw_emails();
        const seed_raw_emails_result_ids = seed_raw_emails_result.map(result => result.body.id)

        const seed_transactions_result = await seed_transactions(seed_raw_emails_result_ids)

        return json({ seed_raw_emails_result_ids, seed_transactions_result })
    } catch (error) {
        console.dir(error, { depth: 8 })
        return json({ error: 'Failed to seed data' }, { status: 500 })
    }
};


const seed_raw_emails = async () => {
    const batch = pb.createBatch();
    seed_data.forEach(seed => batch.collection('raw_emails').create(seed))
    const result = await batch.send();
    return result
}

const seed_transactions = async (ids: string[]) => {
    const batch = pb.createBatch();
    seed_transactions_data.forEach((seed, i) => batch.collection('transactions').create({ ...seed, raw_email_id: ids[i] }))
    const result = await batch.send();
    return result
}
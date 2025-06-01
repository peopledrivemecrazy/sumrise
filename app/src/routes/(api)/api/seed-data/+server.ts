import { pb } from '$lib/vendor/pocketbase';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import seed_data from '$lib/vendor/pocketbase/seed_raw_emails.json';

export const GET: RequestHandler = async () => {
    const batch = pb.createBatch();
    try {
        seed_data.forEach(seed => batch.collection('raw_emails').create(seed))
        const result = await batch.send();
        return json(result)
    } catch (error) {
        console.dir(error, { depth: 8 })
        return json({ error: 'Failed to seed data' }, { status: 500 })
    }
};  
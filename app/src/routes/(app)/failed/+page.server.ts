import type { PageServerLoad } from './$types';
import { pb, type RawEmail } from '$lib/vendor/pocketbase';

export const load = (async () => {
    const failed = await pb.collection('raw_emails').getFullList<RawEmail>({
        filter: 'status = "failed"'
    });
    return { failed };
}) satisfies PageServerLoad;
import type { PageServerLoad } from './$types';
import { pb, type RawEmail } from '$lib/vendor/pocketbase';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
    if (!locals.user) {
        redirect(302, '/')
    }
    const failed = await pb.collection('raw_emails').getFullList<RawEmail>({
        filter: 'status = "failed"'
    });
    return { failed };
}) satisfies PageServerLoad;
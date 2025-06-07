import type { PageServerLoad } from './$types';
import { pb, type RawEmail } from '$lib/vendor/pocketbase';
import { redirect, type Actions } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
    if (!locals.user) {
        redirect(302, '/')
    }
    const failed = await pb.collection('raw_emails').getFullList<RawEmail>({
        filter: 'status != "processed"'
    });
    return { failed };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        if (!id) {
            return { success: false, error: 'No id provided' };
        }
        try {
            await pb.collection('raw_emails').update(id, {
                'retry_count+': 1,
                status: 'queued'
            });

            return { success: true, message: "Queued for retry" };
        } catch (error) {
            return { success: false, error };
        }
    }
} satisfies Actions;
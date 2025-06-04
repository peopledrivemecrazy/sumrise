import type { PageServerLoad } from './$types';
import { SUPER_ADMIN_PASSWORD, SUPER_ADMIN_USER } from '$env/static/private';
import { pb, type Transaction } from '$lib/vendor/pocketbase';

export const load = (async ({ locals }) => {
    if (locals.user) {
        const transactions = await pb.collection('transactions').getFullList<Transaction>()
        return { transactions };
    }
    return {};
}) satisfies PageServerLoad;



export const actions = {
    login: async () => {
        const user = await pb.collection('_superusers').authWithPassword(SUPER_ADMIN_USER, SUPER_ADMIN_PASSWORD)
        return {
            user
        }
    },
    logout: async () => {
        pb.authStore.clear();
        return {
            user: null
        }
    }
}

import type { PageServerLoad } from './$types';
import { SUPER_ADMIN_PASSWORD, SUPER_ADMIN_USER } from '$env/static/private';
import { pb, type Transaction } from '$lib/vendor/pocketbase';

export const load = (async ({ locals }) => {
    if (locals.user) {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        console.log({ firstDayOfMonth, lastDayOfMonth })
        const transactions = await pb.collection('transactions').getFullList<Transaction>({
            filter: `date >= '${firstDayOfMonth.toISOString()}' && date <= '${lastDayOfMonth.toISOString()}'`
        })
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
    },
    getTransactionsByMonth: async ({ request }) => {
        const formData = await request.formData()
        const date = formData.get('date') as string
        const _date = new Date(date)
        const firstDayOfMonth = new Date(_date.getFullYear(), _date.getMonth(), 1)
        const lastDayOfMonth = new Date(_date.getFullYear(), _date.getMonth() + 1, 0, 23, 59, 59, 999)
        const transactions = await pb.collection('transactions').getFullList<Transaction>({
            filter: `date >= '${firstDayOfMonth.toISOString()}' && date <= '${lastDayOfMonth.toISOString()}'`
        })
        return { transactions }
    }
}

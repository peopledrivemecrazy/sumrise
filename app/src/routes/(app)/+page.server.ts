import type { PageServerLoad } from './$types';
import { SUPER_ADMIN_PASSWORD } from '$env/static/private';
import { SUPER_ADMIN_USER } from '$env/static/private';
import { pb } from '$lib/vendor/pocketbase';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;



export const actions = {
    default: async () => {
        const user = await pb.collection('_superusers').authWithPassword(SUPER_ADMIN_USER, SUPER_ADMIN_PASSWORD)
        return {
            user: user
        }
    }
}
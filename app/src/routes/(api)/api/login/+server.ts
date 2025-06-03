import { pb } from '$lib/vendor/pocketbase';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SUPER_ADMIN_USER, SUPER_ADMIN_PASSWORD } from '$env/static/private';

export const POST: RequestHandler = async () => {
    const user = await pb.collection('_superusers').authWithPassword(
        SUPER_ADMIN_USER,
        SUPER_ADMIN_PASSWORD,
    );
    return json(user.token)
};
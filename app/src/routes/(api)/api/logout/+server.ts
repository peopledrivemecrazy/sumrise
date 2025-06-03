import { pb } from '$lib/vendor/pocketbase';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
    pb.authStore.clear();
    return redirect(302, '/');
};
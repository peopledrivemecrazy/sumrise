import { pb } from '$lib/vendor/pocketbase';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')
    const model = pb.authStore.record
    try {
        if (pb.authStore.isValid) {
            await pb.collection('_superusers').authRefresh()
            event.locals.user = structuredClone(model)
        }
    } catch (error) {
        console.error(error)
        pb.authStore.clear()
        event.locals.user = null
    }
    const response = await resolve(event);
    response.headers.set('Set-Cookie', pb.authStore.exportToCookie())
    return response;
};
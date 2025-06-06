import { dev } from '$app/environment';
import { pb } from '$lib/vendor/pocketbase';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')
    const model = pb.authStore.record
    try {
        if (pb.authStore.isValid) {
            await pb.collection('_superusers').authRefresh()
            event.locals.user = (model)
        }
    } catch (error) {
        console.error(error)
        pb.authStore.clear()
        event.locals.user = null
    }


    const response = await resolve(event);
    response.headers.set('set-cookie', pb.authStore.exportToCookie({
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        secure: !dev,
    }))

    return response;
};


<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { browser } from '$app/environment';
	import { pb } from '$lib/vendor/pocketbase';
	import Nav from '$lib/client/components/Nav.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	$effect(() => {
		if (browser) {
			pb.authStore.loadFromCookie(document.cookie);
		}
	});
</script>

<main class="mx-auto max-w-screen-lg px-4 sm:px-6">
	<Nav user={data.user} />
	{@render children()}
</main>

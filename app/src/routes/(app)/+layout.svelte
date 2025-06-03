<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Nav from '$lib/client/components/Nav.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<main class="mx-auto max-w-screen-lg">
	<Nav user={data.user} />
	{@render children()}
</main>

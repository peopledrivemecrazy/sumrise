<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Nav from '$lib/client/components/Nav.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<Nav user={data.user} />

{@render children()}

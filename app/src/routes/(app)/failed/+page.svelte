<script lang="ts">
	import type { PageData } from './$types';
	import Accordion from '$lib/client/components/Accordion.svelte';
	let { data }: { data: PageData } = $props();
</script>

<Accordion list={data.failed} />

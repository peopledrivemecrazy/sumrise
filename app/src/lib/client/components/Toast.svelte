<script lang="ts">
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';

	let { message }: { message: string } = $props();

	onMount(() => {
		toast.success(message);
	});
</script>

{#if message}
	<Toaster />
{/if}

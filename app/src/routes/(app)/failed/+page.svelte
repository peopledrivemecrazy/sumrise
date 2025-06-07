<script lang="ts">
	import type { PageData } from './$types';
	import Accordion from '$lib/client/components/Accordion.svelte';
	import { applyAction, deserialize } from '$app/forms';
	import Toast from '$lib/client/components/Toast.svelte';
	import { invalidateAll } from '$app/navigation';
	let { data }: { data: PageData } = $props();

	let message = $state('');
	const retry = async (id: string) => {
		const formData = new FormData();
		formData.append('id', id);
		const response = await fetch('/failed', {
			method: 'POST',
			body: formData
		});
		const result = deserialize(await response.text());
		if (result.type === 'success' && result.data) {
			message = result.data.message as string;
			invalidateAll();
		} else {
			console.log('error');
		}
		applyAction(result);
	};
</script>

<Toast bind:message />
{#if data.failed.length > 0}
	<Accordion list={data.failed} onclick={retry} />
{:else}
	<p>No failed emails</p>
{/if}

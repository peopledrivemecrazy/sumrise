<script lang="ts">
	import { mode } from 'mode-watcher';
	import { Toaster, toast } from 'svelte-sonner';

	let { message = $bindable() }: { message: string } = $props();
	$effect(() => {
		toast.info(message);
	});
	$effect(() => {
		if (!toast.getActiveToasts().length) {
			toast.dismiss();
			message = '';
		}
	});
</script>

{#if message}
	<Toaster
		theme={$mode}
		toastOptions={{
			unstyled: true,
			classes: {
				toast: `border p-2 rounded-md flex items-center gap-2 ${$mode === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'}`
			}
		}}
	/>
{/if}

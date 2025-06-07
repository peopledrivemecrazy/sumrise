<script lang="ts">
	import type { RawEmail } from '$lib/vendor/pocketbase';
	import * as accordion from '@zag-js/accordion';
	import { useMachine, normalizeProps } from '@zag-js/svelte';

	let { list }: { list: RawEmail[] } = $props();

	const id = $props.id();
	const service = useMachine(accordion.machine, {
		id,
		defaultValue: [list[0].id]
	});
	const api = $derived(accordion.connect(service, normalizeProps));
</script>

<div {...api.getRootProps()}>
	{#each list as item}
		<div class="mb-4 rounded-lg border p-4" {...api.getItemProps({ value: item.id })}>
			<h3 class="m-0">
				<button
					class="flex w-full cursor-pointer items-center justify-between bg-transparent text-left text-base font-semibold sm:text-lg"
					{...api.getItemTriggerProps({ value: item.id })}
				>
					<span class="font-mono" class:text-teal-500={api.value.includes(item.id)}>{item.id}</span>
					<span>{api.value.includes(item.id) ? '🔼' : '🔽'}</span>
				</button>
			</h3>
			<div class="text-base" {...api.getItemContentProps({ value: item.id })}>
				<p class="mb-1 font-medium"><strong>Text Body:</strong></p>
				<p class="mb-2">{item.text_body}</p>
				<p class="mb-1 font-medium">
					<strong>Received:</strong>
					<span class="font-normal">{item.received_date}</span>
				</p>
				<p class="mb-1 font-medium">
					<strong>Error Message:</strong>
					<span class="font-normal">{item.error_msg}</span>
				</p>
				<p class="mb-1 font-medium">
					<strong>Retry Count:</strong>
					<span class=" font-normal">{item.retry_count}</span>
				</p>
				<p class="mb-1 font-medium">
					<strong>Status:</strong>
					<span class="font-bold text-red-500">{item.status}</span>
				</p>
			</div>
		</div>
	{/each}
</div>

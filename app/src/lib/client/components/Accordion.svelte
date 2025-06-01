<script lang="ts">
	import * as accordion from '@zag-js/accordion';
	import { useMachine, normalizeProps } from '@zag-js/svelte';

	const data = [
		{ title: 'Watercraft', content: 'Sample accordion content' },
		{ title: 'Automobiles', content: 'Sample accordion content' },
		{ title: 'Aircraft', content: 'Sample accordion content' }
	];

	const id = $props.id();
	const service = useMachine(accordion.machine, { id });
	const api = $derived(accordion.connect(service, normalizeProps));
</script>

<div {...api.getRootProps()}>
	{#each data as item}
		<div {...api.getItemProps({ value: item.title })}>
			<h3>
				<button {...api.getItemTriggerProps({ value: item.title })}>
					{item.title}
				</button>
			</h3>
			<div {...api.getItemContentProps({ value: item.title })}>
				{item.content}
			</div>
		</div>
	{/each}
</div>

<style lang="postcss">
	[data-part='item'][data-state='open|closed'] {
		/* styles for the item is open or closed state */
	}

	[data-part='item-trigger'][data-state='open|closed'] {
		/* styles for the item is open or closed state */
	}

	[data-part='item-content'][data-state='open|closed'] {
		/* styles for the item is open or closed state */
	}
	[data-part='item'][data-focus] {
		/* styles for the item's focus state */
	}

	[data-part='item-trigger']:focus {
		/* styles for the trigger's focus state */
	}

	[data-part='item-content'][data-focus] {
		/* styles for the content's focus state */
	}
</style>

<script>
	import { toggleMode, mode } from 'mode-watcher';
	import { scale } from 'svelte/transition';
</script>

<button
	on:click={toggleMode}
	class="relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full"
>
	{#key $mode}
		<span
			class="absolute"
			in:scale={{ duration: 200 }}
			out:scale={{ duration: 200 }}
			class:text-teal-500={$mode === 'dark'}
		>
			{$mode === 'dark' ? '💡' : '💤'}
		</span>
	{/key}
</button>

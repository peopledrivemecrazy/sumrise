<script lang="ts">
	import { enhance } from '$app/forms';
	import ModeSwitcher from './ModeSwitcher.svelte';

	let { user } = $props();
</script>

<div class="mb-4 flex items-center justify-between text-3xl">
	<div>
		<p>Sumrise</p>
	</div>
	<div class="flex items-center gap-2">
		{#if user}
			<ModeSwitcher />
			<form method="post" class="grid" action="/api/logout">
				<button>logout</button>
				<span class="text-xs">{user.email}</span>
			</form>
		{:else}
			<form method="post" use:enhance>
				<button>login</button>
			</form>
		{/if}
	</div>
</div>

<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import ModeSwitcher from './ModeSwitcher.svelte';

	let { user } = $props();

	const routes = [
		['Home', '/'],
		['Failed', '/failed']
	];
</script>

<div class="mb-4 flex items-center justify-between text-3xl">
	<div>
		<p>Sumrise</p>
	</div>
	<div class="flex items-center gap-2">
		{#if user}
			<form method="post" class="grid" action="?/logout" use:enhance>
				<button>logout</button>
				<span class="text-xs">{user.email}</span>
			</form>
		{:else}
			<form method="post" use:enhance action="?/login">
				<button>login</button>
			</form>
		{/if}
	</div>
</div>
<div class="flex justify-between">
	<ul class="flex items-center gap-2 text-xl">
		{#each routes as [name, href]}
			<li>
				<a {href} class:text-teal-500={page.url.pathname === href}>{name}</a>
			</li>
		{/each}
	</ul>
	<ModeSwitcher />
</div>
<hr class="my-4" />

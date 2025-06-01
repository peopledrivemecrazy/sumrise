<script lang="ts">
	import { logout, resetData } from '$lib/vendor/pocketbase';

	let token = $state<string>();

	const login = async () => {
		const response = await fetch('/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const data = await response.json();
		token = data;
	};
	$effect(() => {
		console.log(token);
	});

	const seedData = async () => {
		const response = await fetch('/api/seed-data');
		const data = await response.json();
		console.log(data);
	};
</script>

{#if token}
	<p>Logged</p>
	<button onclick={logout}> logout </button>
	<button onclick={seedData}> Reset Data</button>
{:else}
	<button onclick={login}> login </button>
{/if}

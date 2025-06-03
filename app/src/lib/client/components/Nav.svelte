<script lang="ts">
	import { enhance } from '$app/forms';

	let { user } = $props();
</script>

<div class="mb-4 flex items-center justify-between">
	<div>
		<p>Sumrise</p>
	</div>
	<div class="flex items-center gap-2">
		{#if user}
			<p>{user.email}</p>
			<form method="post" action="/api/logout">
				<button>Logout</button>
			</form>
		{:else}
			<form method="post" use:enhance>
				<button>Login</button>
			</form>
		{/if}
	</div>
</div>

<script lang="ts">
	let { data } = $props();
</script>

{#if data.transactions}
	<div class="flex flex-col gap-4">
		{#each data.transactions as transaction}
			<div class="border-black-2 border p-4">
				<p>
					{new Date(transaction.date).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</p>
				<p>
					{Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
						transaction.amount_cents / 100
					)}
				</p>
			</div>
		{/each}
	</div>
{/if}

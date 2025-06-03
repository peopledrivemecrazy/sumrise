<script lang="ts">
	import { formatCurrency, groupBy } from '$lib';
	import Card from '$lib/client/components/Card.svelte';

	let { data } = $props();
</script>

{#if data.transactions}
	<h1 class="text-2xl font-bold">Spending Analysis</h1>
	<p class="opacity-75">current month</p>
	<div class="my-4 grid grid-cols-3 gap-4">
		<Card
			title="Total Spending"
			info={formatCurrency(
				data.transactions.reduce((acc, transaction) => acc + transaction.amount_cents, 0)
			)}
		/>
		<Card title="Transactions" info={data.transactions.length} />
		<Card
			title="Average transaction"
			info={formatCurrency(
				data.transactions.reduce((acc, transaction) => acc + transaction.amount_cents, 0) /
					data.transactions.length
			)}
		/>
	</div>
	<h2>Spendings</h2>
	<div class="flex flex-col gap-2">
		{#each Object.entries(groupBy(data.transactions, 'merchant_name')) as [merchant, transactions]}
			<div class="flex items-center gap-2">
				<p class="text-sm">{merchant}</p>

				<div
					class="h-full rounded-sm border-r-2 bg-white/20 transition-all duration-300"
					style="width: {Math.round(
						(transactions.reduce((acc, transaction) => acc + transaction.amount_cents, 0) /
							data.transactions.reduce((acc, transaction) => acc + transaction.amount_cents, 0)) *
							100
					)}%;"
				>
					<p class="text-2xl">
						{formatCurrency(
							transactions.reduce((acc, transaction) => acc + transaction.amount_cents, 0)
						)}
					</p>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<p>Login to see your transactions</p>
{/if}

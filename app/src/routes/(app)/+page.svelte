<script lang="ts">
	import { formatCurrency, groupBy, reduceTransactions } from '$lib';
	import Card from '$lib/client/components/Card.svelte';
	import MonthPicker from '$lib/client/components/MonthPicker.svelte';
	let { data } = $props();
</script>

{#if data.transactions}
	<h1 class="text-2xl font-bold">Spending Analysis</h1>
	<MonthPicker />
	<div class="my-4 grid grid-cols-3 gap-4">
		<Card title="Total Spending" info={formatCurrency(reduceTransactions(data.transactions))} />
		<Card title="Transactions" info={data.transactions.length} />
		<Card
			title="Average transaction"
			info={formatCurrency(reduceTransactions(data.transactions) / data.transactions.length)}
		/>
	</div>
	<h2>Spendings</h2>
	<div class="flex flex-col gap-2">
		{#each Object.entries(groupBy(data.transactions, 'merchant_name')) as [merchant, transactions]}
			<div class="flex items-center gap-2">
				<p class="text-sm">{merchant}</p>

				<div
					class="h-full rounded-sm bg-gray-200 transition-all duration-300"
					style="width: {Math.round(
						(reduceTransactions(transactions) / reduceTransactions(data.transactions)) * 100
					)}%;"
				>
					<p class="text-2xl text-teal-500">
						{formatCurrency(reduceTransactions(transactions))}
					</p>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<p>Login to see your transactions</p>
{/if}

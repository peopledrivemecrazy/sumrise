<script lang="ts">
	import { browser } from '$app/environment';
	import { formatCurrency, groupBy } from '$lib';
	import Card from '$lib/client/components/Card.svelte';
	import Chart from '$lib/client/components/Chart.svelte';

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
	{#each Object.entries(groupBy(data.transactions, 'merchant_name')) as [merchant, transactions]}
		<div>
			<p>{merchant}</p>
			<p>
				{formatCurrency(
					transactions.reduce((acc, transaction) => acc + transaction.amount_cents, 0)
				)}
			</p>
		</div>
	{/each}
	{#if browser}
		<Chart />
	{/if}
	<!-- 
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
					{Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD' }).format(
						transaction.amount_cents / 100
					)}
				</p>
			</div>
		{/each}
	</div> -->
{:else}
	<p>Login to see your transactions</p>
{/if}

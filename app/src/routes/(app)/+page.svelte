<script lang="ts">
	import { applyAction, deserialize } from '$app/forms';
	import * as datepicker from '@zag-js/date-picker';

	import { formatCurrency, groupBy, reduceTransactions } from '$lib';
	import Card from '$lib/client/components/Card.svelte';
	import MonthPicker from '$lib/client/components/MonthPicker.svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types.js';
	let { data } = $props();

	const handleMonthChange = async (date: datepicker.ValueChangeDetails) => {
		const [value] = date.valueAsString;
		const formData = new FormData();
		formData.append('date', value);
		const response = await fetch('?/getTransactionsByMonth', {
			method: 'POST',
			body: formData
		});
		const result: ActionResult = deserialize(await response.text());

		if (result.type === 'success') {
			await invalidateAll();
			data = result.data as PageData;
		}
		applyAction(result);
	};
</script>

{#if data.transactions}
	<h1 class="text-xl font-bold sm:text-2xl md:text-3xl">Spending Analysis</h1>
	<MonthPicker onValueChange={handleMonthChange} />
	{#if data.transactions.length > 0}
		<div class="my-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
			<Card title="Total Spending" info={formatCurrency(reduceTransactions(data.transactions))} />
			<Card title="Transactions" info={data.transactions.length} />
			<Card
				title="Average transaction"
				info={formatCurrency(reduceTransactions(data.transactions) / data.transactions.length)}
			/>
		</div>
		<h2 class="text-lg font-semibold sm:text-xl">Spendings</h2>
		<div class="flex flex-col gap-2">
			{#each Object.entries(groupBy(data.transactions, 'merchant_name')) as [merchant, transactions]}
				<div class="flex items-center gap-2">
					<p class="text-xs sm:text-sm md:text-base">{merchant}</p>

					<div
						class="h-full rounded-sm bg-gray-200 transition-all duration-300"
						style="width: {Math.round(
							(reduceTransactions(transactions) / reduceTransactions(data.transactions)) * 100
						)}%;"
					>
						<p class="text-base text-teal-500 sm:text-xl">
							{formatCurrency(reduceTransactions(transactions))}
						</p>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<p class="text-base sm:text-lg">No transactions found</p>
	{/if}
{:else}
	<p class="text-base sm:text-lg">Login to see your transactions</p>
{/if}

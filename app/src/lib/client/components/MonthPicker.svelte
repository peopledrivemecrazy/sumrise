<script lang="ts">
	import * as datepicker from '@zag-js/date-picker';
	import { useMachine, normalizeProps, portal } from '@zag-js/svelte';
	let { onValueChange = $bindable() } = $props();
	const id = 'month-picker';
	const max = datepicker.parse(new Date());
	const service = useMachine(datepicker.machine, {
		id,
		minView: 'month',
		maxView: 'year',
		defaultView: 'month',
		max,
		positioning: {
			placement: 'bottom-start'
		},
		onValueChange,
		view: 'month'
	});
	const api = $derived(datepicker.connect(service, normalizeProps));

	const isMonthDisabled = (month: { label: string; value: number }, year: number) => {
		const currentDate = new Date();
		const currentYear = currentDate.getFullYear();
		const currentMonth = currentDate.getMonth();

		if (year > currentYear) return true;
		if (year === currentYear && month.value - 1 > currentMonth) return true;
		return false;
	};
</script>

<div class="relative">
	<div {...api.getControlProps()}>
		<button {...api.getTriggerProps()} class="my-4 cursor-pointer rounded-lg border p-2">
			{api.visibleRangeText.start}
		</button>
	</div>

	<div use:portal {...api.getPositionerProps()} class="absolute z-20">
		<div
			{...api.getContentProps()}
			class=" mt-2 flex flex-col gap-2 rounded p-2 dark:bg-neutral-200 dark:text-black"
		>
			<!-- Month View -->
			<div hidden={api.view !== 'month'}>
				<div
					{...api.getViewControlProps({ view: 'month' })}
					class="mb-2 flex items-center justify-between"
				>
					<button
						{...api.getPrevTriggerProps({ view: 'month' })}
						class="cursor-pointer rounded px-2 py-1">←</button
					>
					<button
						{...api.getViewTriggerProps({ view: 'month' })}
						class="cursor-pointer rounded px-2 py-1 font-mono text-base"
					>
						{api.visibleRange.start.year}
					</button>
					<button
						{...api.getNextTriggerProps({ view: 'month' })}
						class="cursor-pointer rounded px-2 py-1">→</button
					>
				</div>
				<table {...api.getTableProps({ view: 'month', columns: 4 })} class="w-full border-collapse">
					<tbody {...api.getTableBodyProps({ view: 'month' })}>
						{#each api.getMonthsGrid({ columns: 4, format: 'short' }) as months, row (row)}
							<tr {...api.getTableRowProps()}>
								{#each months as month, index (index)}
									<td {...api.getMonthTableCellProps({ ...month, columns: 4 })} class="p-1">
										<div
											{...api.getMonthTableCellTriggerProps({ ...month, columns: 4 })}
											class="rounded-lg p-2 hover:text-teal-500 {isMonthDisabled(
												month,
												api.visibleRange.end.year
											)
												? 'cursor-not-allowed opacity-50'
												: 'cursor-pointer'}"
										>
											{month.label}
										</div>
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Year View -->
			<div hidden={api.view !== 'year'}>
				<div
					{...api.getViewControlProps({ view: 'year' })}
					class="mb-2 flex items-center justify-between"
				>
					<button {...api.getPrevTriggerProps({ view: 'year' })} class="rounded px-2 py-1">←</button
					>
					<span class="font-mono text-base">
						{api.getDecade().start} - {api.getDecade().end}
					</span>
					<button {...api.getNextTriggerProps({ view: 'year' })} class="rounded px-2 py-1">→</button
					>
				</div>
				<table {...api.getTableProps({ view: 'year', columns: 4 })} class="w-full border-collapse">
					<tbody {...api.getTableBodyProps()}>
						{#each api.getYearsGrid({ columns: 4 }) as years, row (row)}
							<tr {...api.getTableRowProps({ view: 'year' })}>
								{#each years as year, index (index)}
									<td {...api.getYearTableCellProps({ ...year, columns: 4 })} class="p-1">
										<div
											{...api.getYearTableCellTriggerProps({ ...year, columns: 4 })}
											class="cursor-pointer rounded px-2 py-1 text-center text-base transition"
										>
											{year.label}
										</div>
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

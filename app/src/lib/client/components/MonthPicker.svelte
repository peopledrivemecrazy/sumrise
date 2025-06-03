<script lang="ts">
	import * as datepicker from '@zag-js/date-picker';
	import { portal, useMachine, normalizeProps } from '@zag-js/svelte';

	const id = 'month-picker';
	const service = useMachine(datepicker.machine, {
		id,
		minView: 'month',
		maxView: 'year',
		defaultView: 'month',
		max: datepicker.parse(new Date())
	});
	const api = $derived(datepicker.connect(service, normalizeProps));
</script>

<div class="relative">
	<div {...api.getControlProps()}>
		<button
			{...api.getTriggerProps()}
			class="rounded-md border border-black/10 bg-neutral-100 px-4 py-2 font-mono text-lg text-black shadow-sm transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-black/20 dark:border-white/20 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:ring-white/20"
		>
			{#if api.view === 'month'}
				{api.visibleRange.start.month} {api.visibleRange.start.year}
			{:else}
				{api.getDecade().start} - {api.getDecade().end}
			{/if}
		</button>
	</div>

	<div use:portal {...api.getPositionerProps()} class="absolute z-20 mt-2 flex flex-col gap-2">
		<div
			{...api.getContentProps()}
			class="min-w-[220px] rounded-md border border-black/10 bg-neutral-100 p-4 text-black shadow-lg dark:border-white/20 dark:bg-neutral-800 dark:text-white"
		>
			<!-- Month View -->
			<div hidden={api.view !== 'month'}>
				<div
					{...api.getViewControlProps({ view: 'month' })}
					class="mb-2 flex items-center justify-between"
				>
					<button
						{...api.getPrevTriggerProps({ view: 'month' })}
						class="rounded px-2 py-1 hover:bg-neutral-200 dark:hover:bg-neutral-700">←</button
					>
					<button
						{...api.getViewTriggerProps({ view: 'month' })}
						class="rounded px-2 py-1 font-mono text-base hover:bg-neutral-200 dark:hover:bg-neutral-700"
					>
						{api.visibleRange.start.year}
					</button>
					<button
						{...api.getNextTriggerProps({ view: 'month' })}
						class="rounded px-2 py-1 hover:bg-neutral-200 dark:hover:bg-neutral-700">→</button
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
											class="cursor-pointer rounded px-2 py-1 text-center font-mono text-base transition hover:bg-neutral-200 dark:hover:bg-neutral-700"
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
					<button
						{...api.getPrevTriggerProps({ view: 'year' })}
						class="rounded px-2 py-1 hover:bg-neutral-200 dark:hover:bg-neutral-700">←</button
					>
					<span class="font-mono text-base">
						{api.getDecade().start} - {api.getDecade().end}
					</span>
					<button
						{...api.getNextTriggerProps({ view: 'year' })}
						class="rounded px-2 py-1 hover:bg-neutral-200 dark:hover:bg-neutral-700">→</button
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
											class="cursor-pointer rounded px-2 py-1 text-center font-mono text-base transition hover:bg-neutral-200 dark:hover:bg-neutral-700"
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

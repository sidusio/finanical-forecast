<script lang="ts">
	import * as d3 from 'd3';
	import { afterUpdate } from 'svelte';
	import type { YearState } from '$lib/simulation';

	export let simulation: Array<YearState>;

	$: data = simulation.map(
		({
			iskSavings,
			year,
			cashFlow,
			premiumPensionRights,
			incomePensionRights,
			occupationalPensionSavings
		}) => ({
			year: new Date(year, 1),
			savings: iskSavings,
			cashFlow,
			pensionRights: premiumPensionRights + incomePensionRights,
			pensionSavings: occupationalPensionSavings
		})
	);

	export let width = 800;
	export let height = 600;

	let svg: SVGElement;

	const margin = { top: 30, right: 30, bottom: 30, left: 90 };

	$: [minYear, maxYear] = d3.extent(data, (d) => d.year);
	$: xScale = d3.scaleUtc([minYear ?? 0, maxYear ?? 0], [margin.left, width - margin.right]);
	$: yScale = d3.scaleLinear(
		[
			d3.min(data, (d) => Math.min(d.cashFlow, d.savings, d.pensionRights)) ?? 0,
			d3.max(data, (d) => Math.max(d.cashFlow, d.savings, d.pensionRights)) ?? 1
		],
		[height - margin.bottom, margin.top]
	);

	$: savingsLine = d3
		.line<{ year: Date; savings: number }>()
		.x((d) => xScale(d.year))
		.y((d) => yScale(d.savings));

	$: pensionSavingsLine = d3
		.line<{ year: Date; pensionSavings: number }>()
		.x((d) => xScale(d.year))
		.y((d) => yScale(d.pensionSavings));

	$: pensionRightsLine = d3
		.line<{ year: Date; pensionRights: number }>()
		.x((d) => xScale(d.year))
		.y((d) => yScale(d.pensionRights));

	$: cashFlowLine = d3
		.line<{ year: Date; cashFlow: number }>()
		.x((d) => xScale(d.year))
		.y((d) => yScale(d.cashFlow));

	$: zeroLine = d3
		.line<{ year: Date; cashFlow: number }>()
		.x((d) => xScale(d.year))
		.y((d) => yScale(0));

	afterUpdate(() => {
		const s = d3.select(svg);

		const xAxis = d3.axisBottom(xScale);
		s.select<SVGGElement>('.x-axis').call(xAxis);

		const yAxis = d3.axisLeft(yScale);
		yAxis.tickFormat((d) =>
			d3
				.formatLocale({
					decimal: ',',
					thousands: ' ',
					grouping: [3],
					currency: ['', ' tkr']
				})
				.format('$,')(d.valueOf() / 1000)
		);
		s.select<SVGGElement>('.y-axis').call(yAxis);
	});
</script>

<svg bind:this={svg} {width} {height} viewBox="0 0 {width} {height}">
	<!-- Add the x-axis. -->
	<g class="x-axis" transform="translate(0,{height - margin.bottom})"> kr </g>
	<!-- Add the y-axis, remove the domain line, add grid lines and a label. -->
	<g class="y-axis" transform="translate({margin.left},0)"></g>
	<!-- Add the path for the line -->
	<path d={savingsLine(data)} fill="none" stroke="steelblue" stroke-width="1.5" />
	<path d={cashFlowLine(data)} fill="none" stroke="green" stroke-width="1.5" />
	<path d={pensionRightsLine(data)} fill="none" stroke="red" stroke-width="1.5" />
	<path d={pensionSavingsLine(data)} fill="none" stroke="blue" stroke-width="1.5" />
	<path d={zeroLine(data)} fill="none" stroke="grey" stroke-width="0.5" />
</svg>

<style>
	.x-axis,
	.y-axis {
		user-select: none;
	}
	svg {
		max-width: 100%;
		height: auto;
		/*height: intrinsic;*/
	}
</style>

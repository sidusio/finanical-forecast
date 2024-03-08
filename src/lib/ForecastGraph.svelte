<script lang="ts">
	import * as d3 from 'd3';
	import { afterUpdate } from 'svelte';

	interface DataPoint {
		year: number;
		savings: number;
	}
	export let forecast: Array<DataPoint>;

	$: data = forecast.map(({ savings, year }) => ({
		year: new Date(year, 1),
		savings
	}));

	let width = 800;
	let height = 600;

	let svg: SVGElement;

	const margin = { top: 20, right: 20, bottom: 20, left: 180 };

	$: [minYear, maxYear] = d3.extent(data, (d) => d.year);
	$: xScale = d3.scaleUtc([minYear ?? 0, maxYear ?? 0], [margin.left, width - margin.right]);
	$: yScale = d3.scaleLinear(
		[0, d3.max(data, (d) => d.savings) ?? 1],
		[height - margin.bottom, margin.top]
	);

	$: savingsLine = d3
		.line<{ year: Date; savings: number }>()
		.x((d) => xScale(d.year))
		.y((d) => yScale(d.savings));

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

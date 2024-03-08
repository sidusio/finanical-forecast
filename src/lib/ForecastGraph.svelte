<script lang="ts">
	import { scaleUtc, scaleLinear, extent, max, line, axisBottom } from "d3";

	interface DataPoint {
		year: number;
		savings: number;
	}
	export let forecast: Array<DataPoint>;

	let width = 800;
	let height = 600;

	const margin = { top: 20, right: 20, bottom: 20, left: 180 };


	// @ts-ignore - why does d3 provided utility function not work here?
	$: xScale = scaleUtc(extent(forecast, (d) => d.year), [margin.left, width - margin.right]);
	$: yScale = scaleLinear([0, max(forecast, (d) => d.savings) ?? 1], [height - margin.bottom, margin.top]);

	$: savingsLine = line<DataPoint>()
		.x((d) => xScale(d.year))
		.y((d) => yScale(d.savings));
</script>

<!--
  // Add the y-axis, remove the domain line, add grid lines and a label.
  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(height / 40))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ Daily close ($)"));


-->

<svg {width} {height} viewBox="0 0 ${width} ${height}">
	<!-- Add the x-axis. -->
	<g transform={`translate(0,${height - margin.bottom})`}>
		{@html axisBottom(xScale).ticks(width / 80).tickSizeOuter(0) }
	</g>
	<!-- Add the y-axis, remove the domain line, add grid lines and a label. -->
	<g transform="{`translate(${margin.left},0)`}">
		{#each forecast as d}
			<text
				text-anchor="end"
				x="-3"
				dy=".3em"
			>
				{d.year}
			</text>
		{/each}
	</g>
	<!-- Add the path for the line -->
	<path d={savingsLine(forecast)} fill="none" stroke="steelblue" stroke-width="1.5" />
</svg>

<style>
	svg {
      max-width: 100%;
			height: auto;
			/*height: intrinsic;*/
	}
</style>
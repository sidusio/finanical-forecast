<script lang="ts">
	import ForecastGraph from '$lib/ForecastGraph.svelte';
	import { type Parameters, simulateYears, type YearState } from '$lib/simulation';

	const parameters: Parameters = {
		inflationRate: 0.025,
		iskInterestRate: 0.08,
		iskTax: 0.01086,
		cashFlows: [
			{
				startYear: 2024 + 0,
				endYear: 2024 + 8,
				yearlyNetCashFlow: 38500 * 12,
				// publicPensionContributing: true,
				// servicePensionContribution: 4.5
			},
			{
				startYear: 2024 + 0,
				endYear: 2024 + 8,
				yearlyNetCashFlow: 2755 * 12,
			  // publicPensionContributing: false,
				// servicePensionContribution: 100
			},
			{
				startYear: 2024 + 0,
				endYear: 2024 + 8,
				yearlyNetCashFlow: -2755 * 12,
				// publicPensionContributing: false,
				// servicePensionContribution: 0
			},
			{
				startYear: 2024 + 0,
				endYear: 2024 + 50,
				yearlyNetCashFlow: -15000 * 12,
				// pensionContributing: false,
				// publicPensionContributing: false,
				// servicePensionContribution: 0
			}
		]
	};
	const startState: YearState = {
		year: 2024,
		iskSavings: 1000000,
		compoundedInflation: 1,
		cashFlow: 0
	};

	$: results = simulateYears(74, startState, parameters);
	$: data = results.map((res) => {
		return {
			year: res.year,
			savings: res.iskSavings,
			cashFlow: res.cashFlow
		};
	});
</script>

<section>TODO scenario drawer</section>
<section>TODO scenario editor</section>
<section>
	<ForecastGraph forecast={data} />
</section>
<section>
	<h2>Results</h2>
	<pre>{JSON.stringify(results, null, 2)}</pre>
</section>

<style lang="scss">
</style>

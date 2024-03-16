<script lang="ts">
	import ForecastGraph from '$lib/ForecastGraph.svelte';
	import { defaultScenario, simulate } from '$lib/simulation';

	let scenario = defaultScenario();

	$: simulation = simulate(scenario);
</script>

<section>TODO scenario drawer</section>
<section>TODO scenario editor</section>
<section>
	<ForecastGraph {simulation} />
</section>
<section>
	<h2>Results</h2>
	<pre>{JSON.stringify(simulation, null, 2)}</pre>
</section>

<style lang="scss">
</style>

<script lang="ts">
	import Icon from '$lib/Icon.svelte';
</script>

<main>
	<header>
		<button>
			<Icon name="github" />
			Github
		</button>
	</header>
	<slot />
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 30px;
		font-family: 'Open Sans', 'Helvetica Neue', sans-serif;
	}
	main {
		max-width: 900px;
		margin: 0 auto;
	}
</style>

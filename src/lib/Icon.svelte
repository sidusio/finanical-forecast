<script lang="ts" context="module">
	import github from '$lib/icons/github.svg?raw';

	const icons = {
		github
	};
	export type IconIdentifier = keyof typeof icons;
</script>

<script lang="ts">
	export let name: IconIdentifier;
	export let width = '1rem';
	export let height = '1rem';

	let displayIcon = icons[name];
</script>

<i class={$$props.class} style="--width:{width};--height:{height}">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html displayIcon}
</i>

<style>
	i {
		display: inline-block;
		width: var(--width);
		height: var(--height);
	}
</style>

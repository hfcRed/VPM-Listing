<script lang="ts">
	import { asset } from '$app/paths';

	import '../styles/normalize.css';
	import '../styles/vars.css';
	import '../styles/global.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={asset('/favicon.ico')} />
</svelte:head>

{@render children()}

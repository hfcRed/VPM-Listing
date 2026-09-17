<script lang="ts">
	import Button from './Button.svelte';

	interface Props {
		text: string;
	}

	let { text }: Props = $props();

	const copySuccessDurationMs = 2000;

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	function copy() {
		if (!text) return;
		navigator.clipboard.writeText(text).then(
			() => {
				copied = true;
				clearTimeout(timer);

				timer = setTimeout(() => {
					copied = false;
				}, copySuccessDurationMs);
			},
			() => {}
		);
	}
</script>

<Button variant="outlined" onclick={copy} title="Copy to clipboard" square>
	{#if copied}
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M20 6 9 17l-5-5" />
		</svg>
	{:else}
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
			<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
		</svg>
	{/if}
</Button>

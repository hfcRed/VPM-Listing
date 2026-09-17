<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';

	interface Props {
		open: boolean;
		title: string;
		onclose: () => void;
		children: Snippet;
	}

	let { open, title, onclose, children }: Props = $props();

	function sync(dialog: HTMLDialogElement) {
		if (open && !dialog.open) dialog.showModal();
		else if (!open && dialog.open) dialog.close();
	}
</script>

<dialog {@attach sync} {onclose} closedby="any">
	<article class="scrollbar">
		<header>
			<h2>{title}</h2>
			<Button variant="minimal" size="small" square onclick={onclose} aria-label="Close">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M18 6 6 18" />
					<path d="m6 6 12 12" />
				</svg>
			</Button>
		</header>
		<div>{@render children()}</div>
	</article>
</dialog>

<style>
	article {
		overflow-y: auto;
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--s-4) var(--s-4);
		border-bottom: var(--border-style);
		gap: var(--s-4);
		position: sticky;
		top: 0;
		background-color: var(--color-bg);
	}

	div {
		padding: var(--s-2) var(--s-4);
		display: flex;
		flex-direction: column;
		gap: var(--s-4);
	}

	h2 {
		font-size: var(--font-lg);
		font-weight: var(--weight-extra);
	}

	dialog {
		margin: auto;
		width: min(40rem, calc(100vw - 2rem));
		max-height: calc(100vh - 2rem);
		padding: 0;
		border: var(--border-style);
		border-radius: var(--radius-box);
		background-color: var(--color-bg);
		color: var(--color-text);
		overscroll-behavior: contain;
		overflow: hidden;

		&[open] {
			display: flex;
		}

		&::backdrop {
			background-color: rgb(0 0 0 / 0.5);
		}
	}
</style>

<script lang="ts">
	import { formatCount, formatDate } from '$lib/listing';
	import type { SitePackage } from '$lib/types';
	import Button from './Button.svelte';

	interface Props {
		pkg: SitePackage;
		addUrl: string;
		onDetails: () => void;
	}

	let { pkg, addUrl, onDetails }: Props = $props();

	const downloads = $derived(pkg.versions.reduce((sum, version) => sum + version.downloads, 0));
</script>

<article class="card">
	<div class="content">
		<header>
			<div class="title">
				<h3>{pkg.displayName}</h3>
				<p class="muted mono">{pkg.name}</p>
			</div>
			<div class="badges">
				<span class="badge">v{pkg.latest.version}</span>
				{#if pkg.latest.prerelease}<span class="badge">pre-release</span>{/if}
			</div>
		</header>
		{#if pkg.description}
			<p class="description">{pkg.description}</p>
		{/if}
		<dl class="stats">
			{#if pkg.latest.unity}
				<div>
					<dt>Unity</dt>
					<dd>{pkg.latest.unity}+</dd>
				</div>
			{/if}
			<div>
				<dt>Versions</dt>
				<dd>{pkg.versions.length}</dd>
			</div>
			<div>
				<dt>Downloads</dt>
				<dd>{formatCount(downloads)}</dd>
			</div>
			{#if pkg.latest.publishedAt}
				<div>
					<dt>Updated</dt>
					<dd>{formatDate(pkg.latest.publishedAt)}</dd>
				</div>
			{/if}
		</dl>
	</div>

	<footer>
		<Button variant="minimal" href={pkg.latest.url}>Download .zip</Button>
		<Button variant="outlined" onclick={onDetails}>Details</Button>
		<Button href={addUrl}>Add to VCC</Button>
	</footer>
</article>

<style>
	.card {
		display: flex;
		flex-direction: column;
		border-radius: var(--radius-box);
		background-color: var(--color-bg-high);
	}

	.content {
		padding: var(--s-6);
	}

	header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--s-4);
		margin-bottom: var(--s-4);
	}

	.title {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	h3 {
		font-size: var(--font-lg);
		font-weight: var(--weight-extra);
	}

	.badges {
		display: flex;
		gap: var(--s-1-5);
		flex-shrink: 0;
		padding-top: var(--s-1);
	}

	.description {
		max-width: 40rem;
		margin-bottom: var(--s-2);
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(7rem, max-content));
		gap: var(--s-3) var(--s-8);
	}

	.stats > div {
		display: flex;
		flex-direction: column;
	}

	dt {
		font-size: var(--font-2xs);
		font-weight: var(--weight-bold);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--color-text-high);
	}

	dd {
		font-size: var(--font-md);
		font-weight: var(--weight-semi);
	}

	footer {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: var(--s-2);
		padding-top: var(--s-4);
		border-top: 2px solid var(--color-bg);
		padding: var(--s-4) var(--s-6);
	}

	@media (max-width: 640px) {
		header {
			flex-direction: column;
			gap: var(--s-2);
		}

		.badges {
			padding-top: 0;
		}

		footer,
		.content {
			padding: var(--s-4);
		}
		footer > :global(*) {
			flex: 1;
		}
	}
</style>

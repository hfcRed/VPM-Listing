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
	<div class="info">
		<h2>
			{pkg.displayName}
			<span class="badge">v{pkg.latest.version}</span>
			{#if pkg.latest.prerelease}<span class="badge">pre-release</span>{/if}
		</h2>
		{#if pkg.description}<p>{pkg.description}</p>{/if}
		<p class="muted mono">{pkg.name}</p>
		<p class="muted meta">
			{#if pkg.latest.unity}<span>Unity {pkg.latest.unity}+</span>{/if}
			<span>{pkg.versions.length} {pkg.versions.length === 1 ? 'version' : 'versions'}</span>
			<span>{formatCount(downloads)} downloads</span>
			{#if pkg.latest.publishedAt}<span>Updated {formatDate(pkg.latest.publishedAt)}</span>{/if}
		</p>
	</div>
	<div class="actions">
		<Button href={addUrl}>Add to VCC</Button>
		<Button variant="outlined" onclick={onDetails}>Details</Button>
		<Button variant="minimal" href={pkg.latest.url}>Download .zip</Button>
	</div>
</article>

<style>
	.card {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--s-4);
		padding: var(--s-4) var(--s-5);
		border-radius: var(--radius-box);
		background-color: var(--color-bg-high);
	}

	.info {
		display: flex;
		flex-direction: column;
		gap: var(--s-1-5);
		min-width: 0;
	}

	h2 {
		font-size: var(--font-lg);
		font-weight: var(--weight-extra);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--s-2);
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-1) var(--s-4);
		font-size: var(--font-xs);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-2);
		flex-shrink: 0;
	}

	@media (max-width: 640px) {
		.card {
			flex-direction: column;
		}
	}
</style>

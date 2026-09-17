<script lang="ts">
	import { asset } from '$app/paths';
	import Button from '$lib/components/Button.svelte';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import HelpDialog from '$lib/components/HelpDialog.svelte';
	import Input from '$lib/components/Input.svelte';
	import PackageCard from '$lib/components/PackageCard.svelte';
	import PackageDialog from '$lib/components/PackageDialog.svelte';
	import { formatDate, listing, vccAddRepoUrl } from '$lib/listing';
	import type { SitePackage } from '$lib/types';

	const addUrl = vccAddRepoUrl(listing.url);

	let query = $state('');
	let helpOpen = $state(false);
	let selected = $state.raw<SitePackage | null>(null);

	const filtered = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		if (!needle) return listing.packages;

		return listing.packages.filter((pkg) =>
			[pkg.displayName, pkg.name, pkg.description, ...pkg.keywords].some((text) =>
				text.toLowerCase().includes(needle)
			)
		);
	});
</script>

<svelte:head>
	<title>{listing.name}</title>
	{#if listing.description}
		<meta name="description" content={listing.description} />
	{/if}
</svelte:head>

<main>
	<header class="hero">
		{#if listing.bannerUrl}
			<img class="banner" src={asset(`/${listing.bannerUrl}`)} alt="" width="1000" height="200" />
		{/if}
		<h1>{listing.name}</h1>
		{#if listing.description}
			<p class="muted">{listing.description}</p>
		{/if}
		<p class="muted small">
			Published by
			{#if listing.author.url}
				<a href={listing.author.url} target="_blank" rel="external noreferrer"
					>{listing.author.name}</a
				>
			{:else}
				{listing.author.name}
			{/if}
			{#if listing.infoLink}
				· <a href={listing.infoLink.url} target="_blank" rel="external noreferrer"
					>{listing.infoLink.text ?? 'Learn more'}</a
				>
			{/if}
		</p>
	</header>

	<section class="add-bar" aria-label="Add this listing to the VRChat Creator Companion">
		<Input value={listing.url} readonly mono aria-label="Listing URL" />
		<div class="add-actions">
			<Button href={addUrl}>Add to VCC</Button>
			<CopyButton text={listing.url} />
			<Button
				variant="minimal"
				square
				onclick={() => (helpOpen = true)}
				title="How to add a listing to the VCC"
				aria-label="How to add a listing to the VCC"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="10" />
					<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
					<path d="M12 17h.01" />
				</svg>
			</Button>
		</div>
	</section>

	<Input
		type="search"
		bind:value={query}
		placeholder="Search packages…"
		aria-label="Search packages"
	/>

	<ul class="packages">
		{#each filtered as pkg (pkg.name)}
			<li><PackageCard {pkg} {addUrl} onDetails={() => (selected = pkg)} /></li>
		{:else}
			<li class="empty muted">No packages match "{query}".</li>
		{/each}
	</ul>

	<footer class="muted small">
		{listing.packages.length}
		{listing.packages.length === 1 ? 'package' : 'packages'} · listing updated {formatDate(
			listing.generatedAt
		)}
	</footer>
</main>

<HelpDialog open={helpOpen} listingUrl={listing.url} onclose={() => (helpOpen = false)} />
<PackageDialog pkg={selected} listingUrl={listing.url} onclose={() => (selected = null)} />

<style>
	main {
		max-width: 60rem;
		margin: 0 auto;
		padding: var(--s-12) var(--s-4);
		display: flex;
		flex-direction: column;
		gap: var(--s-5);
	}

	.hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: var(--s-2);
	}

	.banner {
		width: 100%;
		height: auto;
		aspect-ratio: 5 / 1;
		object-fit: cover;
		border-radius: var(--radius-box);
		margin-bottom: var(--s-3);
	}

	h1 {
		font-size: 2rem;
		font-weight: var(--weight-extra);
	}

	.small {
		font-size: var(--font-xs);
	}

	.add-bar {
		display: flex;
		gap: var(--s-2);
		align-items: center;
		padding: var(--s-3);
		border-radius: var(--radius-box);
		background-color: var(--color-bg-high);
	}

	.add-actions {
		display: flex;
		gap: var(--s-2);
		flex-shrink: 0;
	}

	.packages {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--s-3);
	}

	.empty {
		text-align: center;
		padding: var(--s-8) 0;
	}

	footer {
		text-align: center;
	}

	@media (max-width: 640px) {
		.add-bar {
			flex-direction: column;
			align-items: stretch;
		}

		.add-actions {
			flex-wrap: wrap;
		}

		h1 {
			font-size: var(--font-xl);
		}
	}
</style>

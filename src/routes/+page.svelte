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
		{#if listing.banner}
			<picture>
				{#if listing.banner.dark}
					<source srcset={asset(`/${listing.banner.dark}`)} media="(prefers-color-scheme: dark)" />
				{/if}
				<img
					class="banner"
					src={asset(`/${listing.banner.light}`)}
					alt=""
					width="1000"
					height="300"
				/>
			</picture>
		{/if}
		<div class="hero-text">
			<h1>{listing.name}</h1>
			{#if listing.description}
				<p class="lead">{listing.description}</p>
			{/if}
			<p class="byline">
				Published by
				{#if listing.author.url}
					<a href={listing.author.url} target="_blank" rel="external noreferrer"
						>{listing.author.name}</a
					>
				{:else}
					{listing.author.name}
				{/if}
				{#if listing.infoLink}
					<span aria-hidden="true">•</span>
					<a href={listing.infoLink.url} target="_blank" rel="external noreferrer"
						>{listing.infoLink.text ?? 'Learn more'}</a
					>
				{/if}
			</p>
		</div>
	</header>

	<section class="add" aria-labelledby="add-title">
		<div class="add-text">
			<h2 id="add-title">Add this listing to your VCC</h2>
			<p class="muted">
				The VRChat Creator Companion will install and update every package for you.
				<button class="link" type="button" onclick={() => (helpOpen = true)}>
					How does this work?
				</button>
			</p>
		</div>
		<div class="add-row">
			<Input value={listing.url} readonly mono aria-label="Listing URL" />
			<CopyButton text={listing.url} />
			<Button href={addUrl}>Add to VCC</Button>
		</div>
	</section>

	<section class="packages" aria-labelledby="packages-title">
		<div class="packages-head">
			<h2 id="packages-title">
				Packages <span class="count">{listing.packages.length}</span>
			</h2>
			<div class="search">
				<Input
					type="search"
					bind:value={query}
					placeholder="Search packages…"
					aria-label="Search packages"
				/>
			</div>
		</div>
		<ul class="package-list">
			{#each filtered as pkg (pkg.name)}
				<li><PackageCard {pkg} {addUrl} onDetails={() => (selected = pkg)} /></li>
			{:else}
				<li class="empty muted">No packages match "{query}".</li>
			{/each}
		</ul>
	</section>

	<footer class="muted">
		Listing updated {formatDate(listing.generatedAt)}
		<span aria-hidden="true">•</span>
		<a href={listing.url} rel="external">index.json</a>
	</footer>
</main>

<HelpDialog open={helpOpen} listingUrl={listing.url} onclose={() => (helpOpen = false)} />
<PackageDialog pkg={selected} onclose={() => (selected = null)} />

<style>
	main {
		max-width: 56rem;
		margin: 0 auto;
		padding: var(--s-10) var(--s-5) var(--s-12);
		display: flex;
		flex-direction: column;
		gap: var(--s-12);
	}

	.hero {
		display: flex;
		flex-direction: column;
		gap: var(--s-8);
	}

	.banner {
		width: 100%;
		object-fit: cover;
		border-radius: var(--radius-box);
	}

	.hero-text {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: var(--s-2);
	}

	h1 {
		font-size: var(--font-2xl);
		font-weight: var(--weight-extra);
		letter-spacing: -0.01em;
	}

	.lead {
		font-size: var(--font-lg);
		color: var(--color-text-high);
		max-width: 36rem;
	}

	.byline {
		font-size: var(--font-sm);
		color: var(--color-text-high);
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--s-2);
	}

	.add {
		display: flex;
		flex-direction: column;
		gap: var(--s-4);
		padding: var(--s-6);
		border-radius: var(--radius-box);
		background-color: var(--color-bg-high);
	}

	.add-text {
		display: flex;
		flex-direction: column;
		gap: var(--s-1);
	}

	h2 {
		font-size: var(--font-xl);
		font-weight: var(--weight-extra);
	}

	.link {
		appearance: none;
		border: none;
		padding: 0;
		background: none;
		color: var(--color-text-accent);
		cursor: pointer;
		border-radius: var(--radius-field);

		&:hover {
			text-decoration: underline;
		}

		&:focus-visible {
			outline: var(--focus-ring);
			outline-offset: 1px;
		}
	}

	.add-row {
		display: flex;
		gap: var(--s-2);
		align-items: center;
	}

	.packages {
		display: flex;
		flex-direction: column;
		gap: var(--s-5);
	}

	.packages-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--s-4);
	}

	.count {
		display: inline-block;
		margin-left: var(--s-2);
		font-size: var(--font-sm);
		font-weight: var(--weight-semi);
		color: var(--color-text-high);
		vertical-align: middle;
		font-family: var(--font-mono);
	}

	.search {
		width: 100%;
		max-width: 18rem;
	}

	.package-list {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--s-4);
	}

	.empty {
		text-align: center;
		padding: var(--s-10) 0;
	}

	footer {
		display: flex;
		justify-content: center;
		gap: var(--s-2);
		font-size: var(--font-sm);
	}

	@media (max-width: 640px) {
		main {
			padding: var(--s-6) var(--s-4) var(--s-10);
			gap: var(--s-8);
		}

		.hero {
			gap: var(--s-5);
		}

		h1 {
			font-size: var(--font-xl);
		}

		.lead {
			font-size: var(--font-md);
		}

		.add {
			padding: var(--s-5);
		}

		.add-row,
		.packages-head {
			flex-direction: column;
			align-items: stretch;
		}

		.search {
			max-width: none;
		}
	}
</style>

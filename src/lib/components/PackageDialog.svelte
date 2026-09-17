<script lang="ts">
	import { formatCount, formatDate } from '$lib/listing';
	import type { SitePackage } from '$lib/types';
	import Dialog from './Dialog.svelte';

	interface Props {
		pkg: SitePackage | null;
		onclose: () => void;
	}

	let { pkg, onclose }: Props = $props();

	const dependencies = $derived(Object.entries(pkg?.vpmDependencies ?? {}));
</script>

<Dialog open={pkg !== null} {onclose} title={pkg?.displayName ?? ''}>
	{#if pkg}
		{#if pkg.description}
			<section>
				<h3>About</h3>
				<p>{pkg.description}</p>
			</section>
		{/if}

		<section class="facts">
			{#if pkg.author}
				<div>
					<h3>Author</h3>
					{#if pkg.author.url}
						<a href={pkg.author.url} target="_blank" rel="external noreferrer">{pkg.author.name}</a>
					{:else}
						<p>{pkg.author.name}</p>
					{/if}
				</div>
			{/if}
			{#if pkg.license}
				<div>
					<h3>License</h3>
					{#if pkg.licensesUrl}
						<a href={pkg.licensesUrl} target="_blank" rel="external noreferrer">{pkg.license}</a>
					{:else}
						<p>{pkg.license}</p>
					{/if}
				</div>
			{/if}
			{#if pkg.documentationUrl}
				<div>
					<h3>Documentation</h3>
					<a href={pkg.documentationUrl} target="_blank" rel="external noreferrer">Read the docs</a>
				</div>
			{/if}
			{#if pkg.changelogUrl}
				<div>
					<h3>Changelog</h3>
					<a href={pkg.changelogUrl} target="_blank" rel="external noreferrer">View changes</a>
				</div>
			{/if}
			{#if pkg.repoUrl}
				<div>
					<h3>Source</h3>
					<a href={pkg.repoUrl} target="_blank" rel="external noreferrer"
						>{pkg.repoUrl.replace(/^https?:\/\//, '')}</a
					>
				</div>
			{/if}
		</section>

		{#if dependencies.length > 0}
			<section>
				<h3>Dependencies</h3>
				<ul class="plain">
					{#each dependencies as [name, version] (name)}
						<li class="mono">{name} @ {version}</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if pkg.keywords.length > 0}
			<section>
				<h3>Keywords</h3>
				<div class="keywords">
					{#each pkg.keywords as keyword (keyword)}
						<span class="badge">{keyword}</span>
					{/each}
				</div>
			</section>
		{/if}

		<section>
			<h3>Versions</h3>
			<div class="table-wrap scrollbar">
				<table>
					<thead>
						<tr>
							<th>Version</th>
							<th>Date</th>
							<th>Unity</th>
							<th class="num">Downloads</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{#each pkg.versions as version (version.version)}
							<tr>
								<td class="mono">
									{version.version}
									{#if version.prerelease}<span class="badge">pre</span>{/if}
								</td>
								<td class="muted">{formatDate(version.publishedAt)}</td>
								<td class="muted">{version.unity ?? ''}</td>
								<td class="muted num">{formatCount(version.downloads)}</td>
								<td class="links">
									<a href={version.url} rel="external">.zip</a>
									<a href={version.releaseUrl} target="_blank" rel="external noreferrer">notes</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>
	{/if}
</Dialog>

<style>
	section {
		display: flex;
		flex-direction: column;
		gap: var(--s-1);
	}

	h3 {
		font-size: var(--font-2xs);
		font-weight: var(--weight-bold);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--color-text-high);
	}

	.facts {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
		gap: var(--s-4);
	}

	.facts > div {
		display: flex;
		flex-direction: column;
		gap: var(--s-1);
		min-width: 0;
	}

	.facts a {
		overflow-wrap: anywhere;
	}

	.plain {
		list-style: none;
		padding: 0;
	}

	.keywords {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-1-5);
	}

	.table-wrap {
		overflow-x: auto;
		border: var(--border-style);
		border-radius: var(--radius-field);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--font-sm);
	}

	th,
	td {
		text-align: left;
		padding: var(--s-3) var(--s-4);
		white-space: nowrap;
	}

	th {
		font-weight: var(--weight-bold);
		color: var(--color-text-high);
		background-color: var(--color-bg-high);
	}

	tbody tr + tr td {
		border-top: 1px solid var(--color-border);
	}

	.num {
		text-align: right;
	}

	.links {
		display: flex;
		gap: var(--s-3);
		justify-content: flex-end;
	}
</style>

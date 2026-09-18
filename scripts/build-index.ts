/**
 * Builds the VPM repository listing (static/index.json) and the data the
 * page renders (src/lib/generated/listing.json) from source.json and
 * the GitHub releases of every listed repository.
 *
 * Usage: node scripts/build-index.ts [--no-cache]
 *
 * Every release that carries a package.json asset and a .zip asset becomes one
 * version entry. Zip hashes are reused from the currently published listing so
 * only new releases are downloaded. Pass --no-cache to hash everything again.
 * Set GITHUB_TOKEN to raise the GitHub API rate limit (like the workflow does).
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type {
	ListedVersion,
	PackageManifest,
	Repository,
	SiteData,
	SitePackage,
	SiteVersion,
	Source
} from '../src/lib/types.ts';

interface GitHubAsset {
	name: string;
	browser_download_url: string;
	download_count: number;
}

interface GitHubRelease {
	tag_name: string;
	html_url: string;
	draft: boolean;
	prerelease: boolean;
	published_at: string | null;
	assets: GitHubAsset[];
}

interface BuiltVersion {
	listed: ListedVersion;
	site: SiteVersion;
	repoUrl: string;
}

const root = path.resolve(import.meta.dirname, '..');
const useCache = !process.argv.includes('--no-cache');
const concurrency = 6;

const apiHeaders: Record<string, string> = {
	Accept: 'application/vnd.github+json',
	'X-GitHub-Api-Version': '2022-11-28',
	'User-Agent': 'vpm-listing-builder'
};
if (process.env.GITHUB_TOKEN) apiHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function fetchOk(url: string, headers: Record<string, string> = {}) {
	const response = await fetch(url, { headers });

	if (!response.ok) {
		const body = (await response.text()).slice(0, 300);
		throw new Error(`${response.status} ${response.statusText} for ${url}\n${body}`);
	}

	return response;
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>) {
	const results: R[] = new Array(items.length);
	let next = 0;

	async function worker() {
		while (next < items.length) {
			const index = next++;
			results[index] = await fn(items[index]);
		}
	}

	await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
	return results;
}

async function listReleases(repo: string) {
	const releases: GitHubRelease[] = [];

	for (let page = 1; ; page++) {
		const url = `https://api.github.com/repos/${repo}/releases?per_page=100&page=${page}`;
		const batch = (await (await fetchOk(url, apiHeaders)).json()) as GitHubRelease[];

		releases.push(...batch.filter((release) => !release.draft));
		if (batch.length < 100) return releases;
	}
}

async function loadHashCache(listingUrl: string) {
	const cache = new Map<string, string>();
	if (!useCache) return cache;

	try {
		const published = (await (await fetchOk(listingUrl)).json()) as Repository;
		for (const pkg of Object.values(published.packages ?? {})) {
			for (const version of Object.values(pkg.versions ?? {})) {
				if (version.url && version.zipSHA256) cache.set(version.url, version.zipSHA256);
			}
		}

		console.log(`Reusing ${cache.size} zip hashes from ${listingUrl}`);
	} catch (error) {
		console.warn(
			`Could not load the published listing for caching, hashing every zip: ${(error as Error).message}`
		);
	}

	return cache;
}

async function sha256(url: string) {
	const bytes = new Uint8Array(await (await fetchOk(url)).arrayBuffer());
	return createHash('sha256').update(bytes).digest('hex');
}

async function buildVersion(
	repo: string,
	release: GitHubRelease,
	hashCache: Map<string, string>
): Promise<BuiltVersion | null> {
	const manifestAsset = release.assets.find((asset) => asset.name === 'package.json');
	const zipAsset = release.assets.find((asset) => asset.name.endsWith('.zip'));
	if (!manifestAsset || !zipAsset) {
		console.warn(`Skipping ${repo} ${release.tag_name}: needs a package.json and a .zip asset`);
		return null;
	}

	const manifest = (await (
		await fetchOk(manifestAsset.browser_download_url)
	).json()) as PackageManifest;
	if (typeof manifest.name !== 'string' || typeof manifest.version !== 'string') {
		throw new Error(`${repo} ${release.tag_name}: package.json has no name or version`);
	}

	const repoUrl = typeof manifest.url === 'string' ? manifest.url : `https://github.com/${repo}`;
	const zipUrl = zipAsset.browser_download_url;
	const zipSHA256 = hashCache.get(zipUrl) ?? (await sha256(zipUrl));

	return {
		listed: { ...manifest, url: zipUrl, zipSHA256 },
		site: {
			version: manifest.version,
			url: zipUrl,
			zipSHA256,
			unity: manifest.unity,
			publishedAt: release.published_at,
			releaseUrl: release.html_url,
			prerelease: release.prerelease,
			downloads: release.assets.reduce((sum, asset) => sum + asset.download_count, 0)
		},
		repoUrl
	};
}

function compareVersionsDesc(a: string, b: string) {
	const parse = (version: string) => {
		const [core, pre] = version.split('-', 2);
		return {
			parts: core.split('.').map((part) => Number.parseInt(part, 10) || 0),
			pre: pre ?? null
		};
	};

	const va = parse(a);
	const vb = parse(b);

	for (let i = 0; i < Math.max(va.parts.length, vb.parts.length); i++) {
		const diff = (vb.parts[i] ?? 0) - (va.parts[i] ?? 0);
		if (diff !== 0) return diff;
	}

	if (va.pre === vb.pre) return 0;
	if (va.pre === null) return -1;
	if (vb.pre === null) return 1;

	return vb.pre.localeCompare(va.pre);
}

function normalizeAuthor(author: PackageManifest['author']) {
	if (!author) return undefined;
	return typeof author === 'string' ? { name: author } : author;
}

async function main() {
	const source = JSON.parse(await readFile(path.join(root, 'source.json'), 'utf8')) as Source;
	if (source.packages?.length) {
		throw new Error(
			'source.json "packages" (zips hosted outside GitHub releases) is not supported by this builder'
		);
	}

	const hashCache = await loadHashCache(source.url);
	const repos = source.githubRepos ?? [];
	const built: BuiltVersion[] = [];

	for (const repo of repos) {
		const releases = await listReleases(repo);
		console.log(`${repo}: ${releases.length} releases`);

		const versions = await mapLimit(releases, concurrency, (release) =>
			buildVersion(repo, release, hashCache)
		);
		built.push(...versions.filter((version): version is BuiltVersion => version !== null));
	}

	const byPackage = new Map<string, BuiltVersion[]>();
	for (const version of built) {
		const list = byPackage.get(version.listed.name) ?? [];
		list.push(version);
		byPackage.set(version.listed.name, list);
	}

	const repository: Repository = {
		name: source.name,
		author: source.author.name,
		url: source.url,
		id: source.id,
		packages: {}
	};
	const sitePackages: SitePackage[] = [];

	for (const [name, versions] of [...byPackage.entries()].sort(([a], [b]) => a.localeCompare(b))) {
		versions.sort((a, b) => compareVersionsDesc(a.listed.version, b.listed.version));
		repository.packages[name] = {
			versions: Object.fromEntries(
				versions.map((version) => [version.listed.version, version.listed])
			)
		};

		const latest = versions[0];
		const manifest = latest.listed;
		sitePackages.push({
			name,
			displayName: manifest.displayName ?? name,
			description: manifest.description ?? '',
			author: normalizeAuthor(manifest.author),
			keywords: manifest.keywords ?? [],
			vpmDependencies: manifest.vpmDependencies ?? {},
			license: manifest.license,
			licensesUrl: manifest.licensesUrl,
			documentationUrl: manifest.documentationUrl,
			changelogUrl: manifest.changelogUrl,
			repoUrl: latest.repoUrl,
			latest: latest.site,
			versions: versions.map((version) => version.site)
		});
	}

	const site: SiteData = {
		name: source.name,
		id: source.id,
		url: source.url,
		description: source.description,
		author: source.author,
		infoLink: source.infoLink,
		banner: source.banner,
		generatedAt: new Date().toISOString(),
		packages: sitePackages
	};

	const indexPath = path.join(root, 'static', 'index.json');
	const sitePath = path.join(root, 'src', 'lib', 'generated', 'listing.json');

	await mkdir(path.dirname(indexPath), { recursive: true });
	await mkdir(path.dirname(sitePath), { recursive: true });
	await writeFile(indexPath, `${JSON.stringify(repository, null, 2)}\n`);
	await writeFile(sitePath, `${JSON.stringify(site, null, 2)}\n`);

	const versionCount = built.length;
	console.log(
		`Wrote ${path.relative(root, indexPath)} with ${byPackage.size} packages and ${versionCount} versions`
	);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});

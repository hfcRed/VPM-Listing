export interface Author {
	name: string;
	email?: string;
	url?: string;
}

export interface Source {
	name: string;
	id: string;
	url: string;
	author: Author;
	description?: string;
	infoLink?: { url: string; text?: string };
	bannerUrl?: string;
	githubRepos?: string[];
	packages?: { name: string; releases: string[] }[];
}

export interface PackageManifest {
	name: string;
	version: string;
	displayName?: string;
	description?: string;
	unity?: string;
	author?: Author | string;
	keywords?: string[];
	vpmDependencies?: Record<string, string>;
	license?: string;
	licensesUrl?: string;
	documentationUrl?: string;
	changelogUrl?: string;
	url?: string;
	[key: string]: unknown;
}

export interface ListedVersion extends PackageManifest {
	url: string;
	zipSHA256: string;
}

export interface Repository {
	name: string;
	author: string;
	url: string;
	id: string;
	packages: Record<string, { versions: Record<string, ListedVersion> }>;
}

export interface SiteVersion {
	version: string;
	url: string;
	zipSHA256: string;
	unity?: string;
	publishedAt: string | null;
	releaseUrl: string;
	prerelease: boolean;
	downloads: number;
}

export interface SitePackage {
	name: string;
	displayName: string;
	description: string;
	author?: Author;
	keywords: string[];
	vpmDependencies: Record<string, string>;
	license?: string;
	licensesUrl?: string;
	documentationUrl?: string;
	changelogUrl?: string;
	repoUrl?: string;
	latest: SiteVersion;
	versions: SiteVersion[];
}

export interface SiteData {
	name: string;
	id: string;
	url: string;
	description?: string;
	author: Author;
	infoLink?: { url: string; text?: string };
	bannerUrl?: string;
	generatedAt: string;
	packages: SitePackage[];
}

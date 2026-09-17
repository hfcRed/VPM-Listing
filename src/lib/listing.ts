import data from './generated/listing.json';
import type { SiteData } from './types';

export const listing = data as SiteData;

export function vccAddRepoUrl(listingUrl: string) {
	return `vcc://vpm/addRepo?url=${encodeURIComponent(listingUrl)}`;
}

export function formatDate(iso: string | null) {
	if (!iso) return '';
	return iso.slice(0, 10);
}

export function formatCount(count: number) {
	return count.toLocaleString('en-US');
}

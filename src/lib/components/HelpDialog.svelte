<script lang="ts">
	import CopyButton from './CopyButton.svelte';
	import Dialog from './Dialog.svelte';
	import Input from './Input.svelte';

	interface Props {
		open: boolean;
		listingUrl: string;
		onclose: () => void;
	}

	let { open, listingUrl, onclose }: Props = $props();
</script>

<Dialog {open} {onclose} title="How to add this listing to your VCC">
	<p class="muted">
		The <strong>Add to VCC</strong> button opens the VRChat Creator Companion directly. If that does not
		work, add the listing by hand:
	</p>
	<ol>
		<li>Open the VCC and go to <strong>Settings</strong></li>
		<li>Open the <strong>Packages</strong> tab</li>
		<li>Click <strong>Add Repository</strong></li>
		<li>Paste the URL below and click <strong>Add</strong></li>
		<li>Check the repository info and click <strong>I Understand</strong></li>
		<li>Open any project to see the packages from this listing</li>
	</ol>
	<div class="url-row">
		<Input value={listingUrl} readonly mono aria-label="Listing URL" />
		<CopyButton text={listingUrl} />
	</div>
	<p class="muted small">
		Read more about package listings in the
		<a
			href="https://vcc.docs.vrchat.com/guides/community-repositories"
			target="_blank"
			rel="noreferrer">VCC documentation</a
		>.
	</p>
</Dialog>

<style>
	ol {
		padding-left: var(--s-6);
		display: flex;
		flex-direction: column;
		gap: var(--s-1-5);
	}

	.url-row {
		display: flex;
		gap: var(--s-2);
	}

	.small {
		font-size: var(--font-xs);
	}
</style>

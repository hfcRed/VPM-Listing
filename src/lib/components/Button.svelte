<script lang="ts">
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	interface BaseProps {
		variant?: 'primary' | 'outlined' | 'minimal';
		size?: 'medium' | 'small';
		square?: boolean;
	}

	type ButtonProps = HTMLButtonAttributes & BaseProps & { href?: never; target?: never };

	type LinkProps = HTMLAnchorAttributes &
		BaseProps & { href: string; type?: never; disabled?: never };

	type Props = ButtonProps | LinkProps;

	let {
		variant = 'primary',
		size = 'medium',
		square = false,
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<svelte:element
	this={rest.href ? 'a' : 'button'}
	type={rest.href ? undefined : 'button'}
	rel={rest.href ? 'external' : undefined}
	class={['button', variant, size, square && 'square', className]}
	{...rest}
>
	{@render children?.()}
</svelte:element>

<style>
	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--s-1-5);
		border: var(--border-style-accent);
		border-radius: var(--radius-field);
		appearance: none;
		background-color: var(--color-text-accent);
		color: var(--color-text-inverse);
		cursor: pointer;
		font-size: var(--font-sm);
		font-weight: var(--weight-bold);
		padding: 0 var(--field-padding);
		user-select: none;
		outline-color: var(--color-text-accent);
		height: var(--field-size);
		white-space: nowrap;
		text-decoration: none;

		&:hover {
			text-decoration: none;
		}

		&:focus-visible {
			outline-style: solid;
			outline-width: 2px;
			outline-offset: 1px;
		}

		&:active {
			transform: translateY(1px);
		}

		& :global(svg) {
			width: var(--field-size-icon);
			height: var(--field-size-icon);
			flex-shrink: 0;
		}
	}

	.outlined {
		background-color: transparent;
		color: var(--color-text-accent);
	}

	.minimal {
		border-color: transparent;
		background-color: transparent;
		color: var(--color-text-accent);

		&:hover {
			background-color: var(--color-bg-high);
		}
	}

	.small {
		font-size: var(--font-xs);
		height: var(--field-size-sm);
	}

	.square {
		aspect-ratio: 1 / 1;
		padding: 0;
	}
</style>

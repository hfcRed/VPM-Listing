<script lang="ts">
	interface Props {
		value?: string;
		type?: 'text' | 'search';
		readonly?: boolean;
		placeholder?: string;
		mono?: boolean;
		'aria-label': string;
	}

	let {
		value = $bindable(''),
		type = 'text',
		readonly = false,
		placeholder,
		mono = false,
		'aria-label': ariaLabel
	}: Props = $props();
</script>

<input
	{type}
	{value}
	{readonly}
	{placeholder}
	aria-label={ariaLabel}
	class={['input', mono && 'mono']}
	oninput={(event) => (value = event.currentTarget.value)}
	onfocus={readonly ? (event) => event.currentTarget.select() : undefined}
/>

<style>
	.input {
		width: 100%;
		min-width: 0;
		border: var(--border-style);
		border-radius: var(--radius-field);
		background-color: var(--color-bg);
		padding: 0 var(--field-padding);
		height: var(--field-size);
		font-size: var(--font-sm);
		outline: none;

		&::placeholder {
			color: var(--color-text-high);
		}

		&:focus-visible {
			outline: var(--focus-ring);
			outline-offset: 1px;
		}

		&:read-only {
			color: var(--color-text-high);
			text-overflow: ellipsis;
		}
	}
</style>

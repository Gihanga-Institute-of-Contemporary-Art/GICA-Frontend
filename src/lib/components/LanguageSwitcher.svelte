<script lang="ts">
	import { currentLanguage, oppositeLanguageConfig, setLanguage } from '$lib/stores/languageStore';
	import { ui } from '$lib/i18n';

	let {
		style = 'button',
		showText = true,
		showFlag = true,
		class: className = '',
		size = 'medium'
	} = $props<{
		style?: 'button' | 'toggle' | 'dropdown';
		showText?: boolean;
		showFlag?: boolean;
		class?: string;
		size?: 'small' | 'medium' | 'large';
	}>();

	function handleLanguageSwitch() {
		const targetLanguage = $oppositeLanguageConfig.code;
		setLanguage(targetLanguage);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleLanguageSwitch();
		}
	}
</script>

{#if style === 'button'}
	<button
		class="language-switcher language-switcher--button language-switcher--{size} {className}"
		onclick={handleLanguageSwitch}
		onkeydown={handleKeydown}
		type="button"
		aria-label={ui('switchLanguage')}
		title={ui('switchLanguage')}
	>
		{#if showFlag}
			<span class="language-switcher__flag" aria-hidden="true">
				{$oppositeLanguageConfig.flag}
			</span>
		{/if}
		{#if showText}
			<span class="language-switcher__text">
				{$oppositeLanguageConfig.code.toUpperCase()}
			</span>
		{/if}
	</button>
{:else if style === 'toggle'}
	<div class="language-switcher language-switcher--toggle language-switcher--{size} {className}">
		<button
			class="language-switcher__option"
			class:active={$currentLanguage === 'en'}
			onclick={() => setLanguage('en')}
			type="button"
			aria-label="Switch to English"
		>
			EN
		</button>
		<button
			class="language-switcher__option"
			class:active={$currentLanguage === 'rw'}
			onclick={() => setLanguage('rw')}
			type="button"
			aria-label="Switch to Kinyarwanda"
		>
			RW
		</button>
	</div>
{:else if style === 'dropdown'}
	<div class="language-switcher language-switcher--dropdown language-switcher--{size} {className}">
		<select
			class="language-switcher__select"
			value={$currentLanguage}
			onchange={(e) => setLanguage(e.currentTarget.value as 'en' | 'rw')}
			aria-label={ui('switchLanguage')}
		>
			<option value="en">English</option>
			<option value="rw">Kinyarwanda</option>
		</select>
	</div>
{/if}

<style>
	.language-switcher {
		display: inline-flex;
		align-items: center;
		font-family: inherit;
		color: var(--font-color-primary, #666);
	}

	/* Button Style */
	.language-switcher--button {
		background: transparent;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s ease;
		padding: 0.25rem 0.5rem;
		gap: 0.25rem;
	}

	.language-switcher--button:focus {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}

	/* Toggle Style */
	.language-switcher--toggle {
		background: var(--surface-color, #f5f5f5);
		border-radius: 6px;
		padding: 2px;
		gap: 2px;
	}

	.language-switcher__option {
		background: transparent;
		border: none;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: inherit;
		font-weight: 500;
		transition: all 0.2s ease;
		color: var(--font-color-primary, #666);
	}

	.language-switcher__option.active {
		background: var(--primary-color, #000);
		color: var(--primary-contrast, white);
	}

	.language-switcher__option:hover:not(.active) {
		background: var(--surface-hover, #e5e5e5);
	}

	/* Dropdown Style */
	.language-switcher--dropdown {
		position: relative;
	}

	.language-switcher__select {
		background: transparent;
		border: 1px solid currentColor;
		border-radius: 4px;
		padding: 0.25rem 0.5rem;
		font-size: inherit;
		cursor: pointer;
		outline: none;
	}

	.language-switcher__select:focus {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}

	/* Size variants */
	.language-switcher--small {
		font-size: 0.875rem;
	}

	.language-switcher--small.language-switcher--button,
	.language-switcher--small .language-switcher__option,
	.language-switcher--small .language-switcher__select {
		padding: 0.125rem 0.375rem;
	}

	.language-switcher--medium {
		font-size: 1rem;
	}

	.language-switcher--large {
		font-size: 1.125rem;
	}

	.language-switcher--large.language-switcher--button,
	.language-switcher--large .language-switcher__option,
	.language-switcher--large .language-switcher__select {
		padding: 0.375rem 0.75rem;
	}

	/* Flag and text elements */
	.language-switcher__flag {
		font-size: 1.2em;
		line-height: 1;
	}

	.language-switcher__text {
		font-weight: 500;
		font-size: var(--font-size-lg, 1rem);
		letter-spacing: 0.025em;
	}

	/* Dark mode support */
	@media (prefers-color-scheme: dark) {
		.language-switcher--toggle {
			background: var(--surface-color, #2a2a2a);
		}

		.language-switcher__option:hover:not(.active) {
			background: var(--surface-hover, #3a3a3a);
		}
	}

	/* Accessibility */
	@media (prefers-reduced-motion: reduce) {
		.language-switcher--button,
		.language-switcher__option {
			transition: none;
		}
	}

	/* High contrast mode */
	@media (prefers-contrast: high) {
		.language-switcher--button,
		.language-switcher__select {
			border-width: 2px;
		}
	}
</style>

<script lang="ts">
	import type { ContentBlock, TextContent } from '$lib/api';
	import { isFooterActive } from '$lib/stores/footerStore';
	import { currentLanguage } from '$lib/stores/languageStore';
	import { onMount } from 'svelte';

	let { headline, about, translation } = $props<{
		headline: string;
		about: ContentBlock[];
		translation?: {
			language: string;
			headline: string;
			about: ContentBlock[];
		};
	}>();

	let isMobile = $state(false);

	// Get translated content - now reactive to language changes
	const translatedHeadline = $derived(
		$currentLanguage === 'en' ||
			!translation?.headline ||
			translation?.language !== $currentLanguage
			? headline
			: translation.headline
	);

	const translatedAbout = $derived(
		$currentLanguage === 'en' || !translation?.about || translation?.language !== $currentLanguage
			? about
			: translation.about
	);

	function toggleFooter() {
		isFooterActive.update((active) => !active);
	}

	// Prevent page scrolling when footer is active
	onMount(() => {
		const mediaQuery = window.matchMedia('(max-width: 768px)');
		const updateIsMobile = () => {
			isMobile = mediaQuery.matches;
		};

		updateIsMobile();

		mediaQuery.addEventListener('change', updateIsMobile);

		const unsubscribe = isFooterActive.subscribe((active) => {
			if (active) {
				// Prevent body scrolling
				document.body.style.overflow = 'hidden';
			} else {
				// Restore body scrolling
				document.body.style.overflow = '';
			}
		});

		return () => {
			// Cleanup: restore scrolling and unsubscribe
			document.body.style.overflow = '';
			mediaQuery.removeEventListener('change', updateIsMobile);
			unsubscribe();
		};
	});
</script>

<footer class:active={$isFooterActive}>
	<div class="content">
		<div
			class="headline"
			role="button"
			tabindex="0"
			onclick={toggleFooter}
			onkeydown={(e) => e.key === 'Enter' && toggleFooter()}
		>
			<div class="arrow-btn" class:flipped={$isFooterActive}>
				<svg
					width="100%"
					height="100%"
					viewBox="0 0 79 73"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					xml:space="preserve"
					style="fill-rule:evenodd;clip-rule:evenodd;"
				>
					<g transform="matrix(-1,1.22465e-16,-1.22465e-16,-1,80,74)">
						<path
							d="M22,19C28,31 34,43 40,55C46,43 52,31 58,19"
							style="fill:none;fill-rule:nonzero;stroke:var(--color-primary-light);stroke-width:3px;"
						/>
					</g>
				</svg>
			</div>
			<div class="title-container">
				<p class="title">{isMobile ? 'GICA' : translatedHeadline}</p>
			</div>
			<div class="details">
				{#if $isFooterActive}
					<div class="sub-text">
						{#each translatedAbout as block}
							{#if block.type === 'text'}
								{@const textContent = block.content as TextContent}
								{@html textContent.text}
							{/if}
						{/each}
					</div>
					<div class="logo">
						<img src="GICA.svg" alt="GICA Logo" />
					</div>
				{/if}
			</div>
		</div>
	</div>
</footer>

<style>
	footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: var(--footer-height);
		background: var(--color-primary);
		background: linear-gradient(0deg, var(--color-primary) 65%, rgba(255, 255, 0, 0) 100%);
		display: flex;
		align-items: center;
		padding-top: var(--space-4);
		color: var(--color-primary-light);
		z-index: 1010;
	}

	footer.active {
		height: 99vh;
		display: block;
		padding-top: var(--nav-height);
		background: var(--color-primary);
	}

	.headline {
		cursor: pointer;
		transition: opacity 0.2s ease;
		display: grid;
		grid-template-columns: 0.35fr 4fr;
		grid-template-rows: auto;
		align-items: center;
	}

	.arrow-btn {
		width: var(--arrow-size);
		transition: transform 0.3s ease;
		align-self: start;
	}

	.arrow-btn.flipped {
		transform: rotate(180deg);
	}

	.headline p {
		margin: 0;
	}

	.title-container .title {
		font-size: var(--font-size-lg);
		font-family: var(--font-secondary);
		text-transform: uppercase;
	}

	.details {
		grid-column: 2 / 3;
	}

	footer.active .details {
		max-height: calc(99vh - var(--nav-height) - 4rem);
		overflow-y: auto;
	}

	.details .sub-text {
		font-size: var(--font-size-xl);
		max-width: var(--content-width);
	}

	/* Custom scrollbar for details */
	.details::-webkit-scrollbar {
		width: 4px;
	}

	.details::-webkit-scrollbar-track {
		background: rgba(188, 146, 0, 0.1);
	}

	.details::-webkit-scrollbar-thumb {
		background: rgba(188, 146, 0, 0.5);
		border-radius: 2px;
	}

	.details::-webkit-scrollbar-thumb:hover {
		background: rgba(188, 146, 0, 0.8);
	}

	.logo {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 2rem;
	}
	.logo img {
		width: 100px;
		height: auto;
	}

	.headline:hover {
		opacity: 0.8;
	}

	.headline:focus {
		outline-offset: 2px;
	}

	.content {
		padding-inline-start: var(--space-8);
		max-width: 80vw;
		/* margin: 0 auto; */
	}

	.sub-text {
		margin-top: 2rem;
		animation: fadeIn 0.3s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		footer {
			/* padding-inline: var(--space-8); */
			justify-content: start;
			padding-block-end: 0;
			height: auto;
		}

		.content {
			margin: 0 auto;
			padding-inline: 0;
			max-width: 90vw;
			grid-template-rows: auto auto auto;
		}

		.details .sub-text {
			font-size: var(--font-size-lg);
		}

		/* .title-container {
			grid-column: 1 / -1;
			display: flex;
			align-items: center;
			justify-content: start;
		} */

		.title-container .title {
			font-size: var(--font-size-xl);
		}

		footer.active .headline p {
			width: 100%;
		}

		.details {
			grid-column: 1 / -1;
		}

		footer.active .details {
			max-height: calc(99vh - var(--nav-height) - 8rem);
			overflow-y: auto;
			padding-right: var(--space-2);
		}

		/* footer.active .details .sub-text {
			margin-bottom: var(--space-2);
		} */

		/* Mobile scrollbar styling */
		footer.active .details::-webkit-scrollbar {
			width: 3px;
		}

		.details .sub-text {
			margin-top: var(--space-2);
			hyphens: auto;
			max-width: 100%;
		}
	}
</style>

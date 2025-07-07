<script lang="ts">
	import type { Programme, TextContent } from '$lib/api/schemas/gicaSchema';
	import {
		formatAllDateTimeRanges,
		getTimeRange,
		formatDateRange,
		getPrimaryTime
	} from '$lib/utils';

	interface Props {
		item: Programme;
		closeModal: () => void;
		navigateToPreviousItem: () => void;
		navigateToNextItem: () => void;
		canNavigatePrevious: boolean;
		canNavigateNext: boolean;
	}

	const {
		item,
		closeModal,
		navigateToPreviousItem,
		navigateToNextItem,
		canNavigatePrevious,
		canNavigateNext
	}: Props = $props();

	let modalContent: HTMLDivElement | undefined;

	// Type guard to check if item is a Programme
	function isProgramme(item: Programme): item is Programme {
		return 'contributors' in item;
	}

	$effect(() => {
		// Scroll to top of the page content, accounting for nav height
		document.documentElement.scrollTo({
			top: 0,
			behavior: 'smooth'
		});

		// Focus the modal content
		if (modalContent) {
			modalContent.focus();
		}
	});
</script>

<section class="modal">
	<div class="modal-nav">
		{#if canNavigatePrevious}
			<button
				class="nav-button nav-left"
				onclick={navigateToPreviousItem}
				aria-label="Previous item"
			>
				<svg
					width="100%"
					height="100%"
					viewBox="0 0 208 365"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					xml:space="preserve"
					style="fill-rule:evenodd;clip-rule:evenodd;"
					class="feather feather-chevron-left"
				>
					<g transform="matrix(1,0,0,1,-1243,-1099)">
						<g id="Left" transform="matrix(4.16667,0,0,4.16667,1425,1437.3)">
							<path
								d="M0,-74.953L-37.477,-37.476L0,0"
								style="fill:none;fill-rule:nonzero;stroke:rgb(26,36,0);stroke-width:3px;"
							/>
						</g>
					</g>
				</svg>
			</button>
		{/if}
		{#if canNavigateNext}
			<button class="nav-button nav-right" onclick={navigateToNextItem} aria-label="Next item">
				<svg
					width="100%"
					height="100%"
					viewBox="0 0 208 365"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					xml:space="preserve"
					style="fill-rule:evenodd;clip-rule:evenodd;"
					class="feather feather-chevron-right"
				>
					<g transform="matrix(1,0,0,1,-1474,-1099)">
						<g id="Right" transform="matrix(4.16667,0,0,4.16667,1500,1125)">
							<path
								d="M0,74.953L37.477,37.476L0,0"
								style="fill:none;fill-rule:nonzero;stroke:rgb(26,36,0);stroke-width:3px;"
							/>
						</g>
					</g>
				</svg>
			</button>
		{/if}
	</div>
	<div class="modal-content" bind:this={modalContent} tabindex="-1">
		<button class="modal-close" onclick={closeModal} aria-label="Close modal" hidden>
			<svg
				viewBox="0 0 208 208"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				xml:space="preserve"
				style="fill-rule:evenodd;clip-rule:evenodd;"
				class="feather feather-x"
			>
				<g transform="matrix(1,0,0,1,-1243,-1099)">
					<g id="Close" transform="matrix(4.16667,0,0,4.16667,1347,1203)">
						<path
							d="M-12,-12L12,12M12,-12L-12,12"
							style="fill:none;fill-rule:nonzero;stroke:rgb(26,36,0);stroke-width:2px;"
						/>
					</g>
				</g>
			</svg>
		</button>

		<div class="modal-left">
			<div class="item-dates">
				{#each formatAllDateTimeRanges(item.dates) as dateTimeRange}
					<div class="date-entry">
						{#each dateTimeRange.split('\n') as line}
							<h4 class="date-line">{line}</h4>
						{/each}
					</div>
				{/each}
			</div>
		</div>

		<div class="modal-middle">
			<!-- title -->
			<h4 class="item-title">{item.title}</h4>

			{#if item.cover?.url}
				<figure>
					<img src={item.cover.url} alt={item.title} class="item-cover" />
					{#if item.cover.caption}
						<figcaption>{item.cover.caption}</figcaption>
					{/if}
				</figure>
			{/if}

			{#each item.text as block}
				{#if block.type === 'text'}
					{@const textContent = block.content as TextContent}
					{@html textContent.text}
				{/if}
			{/each}
		</div>

		<div class="modal-right">
			{#if isProgramme(item) && item.contributors && item.contributors.length > 0}
				<div class="item-contributors">
					<h6>Contributors:</h6>
					<div class="contributors-list">
						{#each item.contributors as contributor}
							<div class="contributor-item">
								<span class="contributor-name">{contributor.title}</span>
								{#if contributor.role}
									<span class="contributor-role">({contributor.role})</span>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.modal {
		width: 100%;
		height: calc(100% - var(--nav-height));
		z-index: 1000;
		display: flex;
		justify-content: center;
	}

	.modal-content {
		position: relative;
		display: grid;
		grid-template-columns: 0.5fr 1fr 0.5fr;
		max-width: 75vw;
		width: 100%;
		column-gap: var(--space-8);
		outline: none;
	}

	.modal-content h4 {
		text-transform: uppercase;
	}

	.modal-left,
	.modal-right {
		padding-block-start: var(--space-8);
	}

	.item-dates {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.date-entry {
		margin: 0;
		padding: var(--space-2);
		border-radius: var(--radius-sm);
	}

	.date-line {
		text-transform: uppercase;
	}

	.date-line:first-child {
		margin-bottom: var(--space-1);
	}

	.item-contributors {
		margin-top: var(--space-4);
	}

	.item-contributors h6 {
		margin: 0 0 var(--space-2) 0;
		font-size: var(--font-size-sm);
		text-transform: uppercase;
		color: var(--font-color-mid);
	}

	.contributors-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.contributor-item {
		font-size: var(--font-size-sm);
	}

	.contributor-name {
		font-weight: 600;
		text-transform: uppercase;
	}

	.contributor-role {
		color: var(--font-color-mid);
		font-style: italic;
		margin-left: var(--space-1);
	}

	.modal-close {
		position: absolute;
		top: -4rem;
		right: 0;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--font-color-dark);
		z-index: 1001;
		display: flex;
		width: 5rem;
		aspect-ratio: 1;
		align-items: center;
		justify-content: center;
		transition: opacity 0.3s ease;
		padding: 0;
	}

	.modal-close:hover {
		opacity: 0.7;
	}

	.modal-close svg {
		width: 100%;
		height: 100%;
	}

	.modal-middle {
		padding-bottom: 1rem;
		font-size: var(--font-size-lg);
	}

	.item-cover {
		width: 100%;
		height: 20rem;
		object-fit: cover;
		border-radius: var(--radius-xl);
		margin-bottom: 1.5rem;
	}

	.item-title {
		text-transform: uppercase;
		margin-bottom: var(--space-4);
	}

	.modal-nav {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		transform: translateY(-50%);
		display: flex;
		justify-content: space-between;
		pointer-events: none;
		z-index: 999;
		padding: 0 1rem;
	}

	.nav-button {
		background: none;
		border: none;
		cursor: pointer;
		pointer-events: auto;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 6rem;
		aspect-ratio: 1;
		transition: opacity 0.3s ease;
	}

	.nav-button:hover {
		opacity: 0.7;
	}

	.nav-button svg {
		width: 100%;
		height: 100%;
		max-height: 6rem;
	}

	.nav-left {
		margin-right: auto;
	}

	.nav-right {
		margin-left: auto;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.modal {
			padding: 1rem;
		}

		.modal-content {
			max-height: fit-content;
			display: flex;
			flex-direction: column;
		}

		.modal-nav {
			position: fixed;
			padding: 0;
		}

		.modal-left {
			padding: 1.5rem;
			padding-bottom: 1rem;
		}

		.modal-middle {
			padding: 0 1.5rem 1.5rem;
		}

		.item-title {
			font-size: 1.5rem;
		}
	}
</style>

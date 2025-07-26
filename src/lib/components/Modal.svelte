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

	console.log(item);

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
					viewBox="0 0 79 73"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					xml:space="preserve"
					style="fill-rule:evenodd;clip-rule:evenodd;"
				>
					<g transform="matrix(3.06162e-16,1,-1,3.06162e-16,77,-3)">
						<path
							d="M22,19C28,31 34,43 40,55C46,43 52,31 58,19"
							style="fill:none;fill-rule:nonzero;stroke:rgb(26,36,0);stroke-width:3px;"
						/>
					</g>
				</svg>
			</button>
		{/if}
		{#if canNavigateNext}
			<button class="nav-button nav-right" onclick={navigateToNextItem} aria-label="Next item">
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
					<g transform="matrix(-1.83697e-16,-1,1,-1.83697e-16,3,77)">
						<path
							d="M22,19C28,31 34,43 40,55C46,43 52,31 58,19"
							style="fill:none;fill-rule:nonzero;stroke:rgb(26,36,0);stroke-width:3px;"
						/>
					</g>
				</svg>
			</button>
		{/if}
	</div>
	<div class="modal-content" bind:this={modalContent} tabindex="-1">
		<button class="modal-close" onclick={closeModal} aria-label="Close modal" hidden> </button>

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
						<figcaption>
							<span class="caption-text">
								{item.cover.caption}
								{#if item.cover.photographer}
									Photo: {item.cover.photographer}
								{/if}
							</span>
						</figcaption>
					{/if}
				</figure>
			{/if}
			<div class="content">
				{#each item.text as block}
					{#if block.type === 'text'}
						{@const textContent = block.content as TextContent}
						{@html textContent.text}
					{/if}
				{/each}
			</div>
		</div>

		<div class="modal-right">
			{#if item.metadata && item.metadata.length > 0}
				<div class="item-metadata">
					{#each item.metadata as metadataItem}
						{#if metadataItem.title}
							<div class="metadata-item">
								<span class="metadata-value">{metadataItem.title}</span>
							</div>
						{/if}
						{#if metadataItem.description}
							<div class="metadata-item">
								<span class="metadata-value">{@html metadataItem.description.value}</span>
							</div>
						{/if}
					{/each}
				</div>
			{/if}

			{#if item.contributors && item.contributors.length > 0}
				<div class="item-contributors">
					<h6>Contributors</h6>
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
		font-size: var(--font-size-md);
		text-transform: uppercase;
		color: var(--font-color-mid);
	}

	.contributors-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.contributor-item {
		font-size: var(--font-size-md);
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

	.item-metadata {
		margin-bottom: var(--space-4);
	}

	.metadata-item {
		font-size: var(--font-size-md);
	}

	.metadata-value {
		color: var(--font-color-dark);
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

	.modal-middle {
		padding-bottom: var(--footer-height);
	}

	.modal-middle .content {
		font-size: var(--font-size-lg);
		hyphens: auto;
	}

	.modal-middle figure figcaption {
		padding-block-end: var(--space-4);
		font-family: var(--font-secondary);
		font-size: var(--font-size-md);
		font-style: normal;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.modal-middle figure figcaption span {
		display: inline;
		margin-bottom: var(--space-2);
	}

	.modal-middle figure figcaption .caption-text {
		display: block;
	}

	.item-cover {
		width: 100%;
		height: 20rem;
		object-fit: cover;
		border-radius: var(--radius-xl);
		margin-bottom: var(--space-2);
	}

	.item-title {
		text-transform: uppercase;
		margin-bottom: var(--space-4);
	}

	.modal-nav {
		position: fixed;
		top: 50%;
		left: 0;
		right: 0;
		transform: translateY(-50%);
		display: flex;
		justify-content: space-between;
		pointer-events: none;
		z-index: 1005;
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
		height: var(--arrow-size);
		aspect-ratio: 1;
		transition: opacity 0.3s ease;
	}

	.nav-button:hover {
		opacity: 0.7;
	}

	.nav-button svg {
		width: 100%;
		height: 100%;
		max-height: var(--arrow-size);
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
			grid-template-columns: 1fr;
			grid-template-rows: auto auto auto;
			gap: var(--space-4);
			padding-bottom: var(--footer-height);
			grid-template-areas:
				'middle'
				'left'
				'right';
		}

		.modal-nav {
			position: fixed;
			padding: 0;
		}

		.modal-left {
			padding: 0;
			grid-area: left;
		}

		.modal-middle {
			padding: 0;
			grid-area: middle;
		}

		.modal-right {
			padding: 0;
			grid-area: right;
		}

		.item-title {
			font-size: 1.5rem;
		}
	}
</style>

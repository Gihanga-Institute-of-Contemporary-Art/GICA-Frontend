<script lang="ts">
	import type { Programme, Exhibition } from '$lib/api/types';
	// import { formatProgrammeDateFromArray, getTimeRange } from '$lib/utils';

	interface Props {
		item: Programme | Exhibition;
		onClick: () => void;
	}

	const { item, onClick }: Props = $props();
	// Type guard to check if item is a Programme
	function isProgramme(item: Programme | Exhibition): item is Programme {
		return 'contributors' in item;
	}
	const tags = isProgramme(item) ? item.tags : [];
</script>

<button type="button" class="card" onclick={onClick}>
	<div
		class="card-image"
		style="background-color: var(--color-primary-mid); {item.cover?.url
			? `background-image: url(${item.cover.url})`
			: ''}"
	>
		<div class="card-overlay">
			<!-- show Tags if type is 'programme' -->
			{#if isProgramme(item) && tags.length > 0}
				<div class="tags">
					{#each tags as tag}
						<p class="tag">{tag}</p>
					{/each}
				</div>
			{/if}
			<div class="title">
				<h5 class="card-title">{item.title}</h5>
			</div>
			<!-- <h5 class="card-date">{formatProgrammeDateFromArray(item.dates)}</h5> -->
			<!-- <h5 class="card-time">{getTimeRange(item.dates)}</h5> -->
		</div>
	</div>
</button>

<style>
	.card {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		text-decoration: none;
		text-transform: uppercase;
		border-radius: var(--radius-xl);
		color: inherit;
		width: 100%;
	}

	.card:hover {
		outline: 2.5px solid var(--color-secondary);
	}

	.card:hover .card-overlay {
		color: var(--color-secondary);
	}

	.card:hover .card-image {
		background-color: transparent !important;
	}

	.card-image {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		background-size: cover;
		background-position: center;
		border-radius: var(--radius-xl);
		overflow: hidden;
	}

	.card-image::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 1;
	}

	.card-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: center;
		text-align: center;
		padding: var(--space-4);
		color: white;
		font-size: var(--font-size-lg);
		z-index: 2;
	}

	.card-title {
		margin-bottom: 0.5rem;
		line-height: 1.3;
	}

	.card-overlay .tags {
		display: flex;
		width: 100%;
		height: fit-content;
		flex-wrap: wrap;
		gap: var(--space-2);
		text-align: left;
		font-size: var(--font-size-sm);
	}

	.card-overlay .title {
		height: 100%;
		display: flex;
		align-items: center;
	}
</style>

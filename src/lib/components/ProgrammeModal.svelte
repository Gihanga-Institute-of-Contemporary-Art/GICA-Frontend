<script lang="ts">
	import type { Programme } from '$lib/api/types';
	import { formatProgrammeDate } from '$lib/utils';

	interface Props {
		programme: Programme;
		closeModal: () => void;
		navigateToPreviousProgramme: () => void;
		navigateToNextProgramme: () => void;
		canNavigatePrevious: boolean;
		canNavigateNext: boolean;
	}

	const {
		programme,
		closeModal,
		navigateToPreviousProgramme,
		navigateToNextProgramme,
		canNavigatePrevious,
		canNavigateNext
	}: Props = $props();

	let modalContent: HTMLDivElement | undefined;

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

<section class="programme-modal">
	<div class="modal-nav">
		{#if canNavigatePrevious}
			<button
				class="nav-button nav-left"
				onclick={navigateToPreviousProgramme}
				aria-label="Previous programme"
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
			<button
				class="nav-button nav-right"
				onclick={navigateToNextProgramme}
				aria-label="Next programme"
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
		<button class="modal-close" onclick={closeModal} aria-label="Close modal">
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
			<h5>
				{formatProgrammeDate(programme.date)}
			</h5>
			<h5>{programme.startTime}</h5>
			<h5>{programme.venue}</h5>
		</div>

		<div class="modal-middle">
			{#if programme.cover}
				<img src={programme.cover} alt={programme.title} class="programme-cover" />
			{/if}

			<p>
				{@html programme.description || 'No description available for this programme.'}
			</p>
		</div>

		<div class="modal-right">
			<h5 class="programme-title">{programme.title}</h5>
			<p class="programme-type">{programme.type}</p>
		</div>
	</div>
</section>

<style>
	.programme-modal {
		width: 100%;
		height: calc(100% - var(--nav-height));
		z-index: 1000;
		display: flex;
		justify-content: center;
		/* padding-bottom: var(--space-16); */
	}

	.modal-content {
		position: relative;
		display: grid;
		grid-template-columns: 0.5fr 1fr 0.5fr;
		max-width: 75vw;
		width: 100%;
		column-gap: var(--space-8);
		/* max-height: 80vh; */
		/* overflow-y: auto; */
		outline: none;
	}

	.modal-left,
	.modal-right {
		padding-block-start: var(--space-8);
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

	.programme-cover {
		width: 100%;
		height: 200px;
		object-fit: cover;
		border-radius: 4px;
		margin-bottom: 1.5rem;
	}

	.programme-title {
		color: #333;
	}

	.programme-type {
		margin-bottom: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.modal-right p {
		line-height: 1.6;
		color: #444;
		margin-bottom: 1.5rem;
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
		.programme-modal {
			padding: 1rem;
		}

		.modal-content {
			max-height: 90vh;
		}

		.modal-left {
			padding: 1.5rem;
			padding-bottom: 1rem;
		}

		.modal-middle {
			padding: 0 1.5rem 1.5rem;
		}

		.programme-title {
			font-size: 1.5rem;
		}
	}
</style>

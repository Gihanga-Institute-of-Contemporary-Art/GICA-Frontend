<script lang="ts">
	import type { Programme } from '$lib/api/types';

	interface Props {
		programme: Programme;
		closeModal: () => void;
	}

	const { programme, closeModal }: Props = $props();

	let modalContent: HTMLDivElement | undefined;

	$effect(() => {
		// Set body overflow to hidden when modal opens
		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		// Focus the modal content
		if (modalContent) {
			modalContent.focus();
		}

		// Cleanup function - restore original overflow when modal closes
		return () => {
			document.body.style.overflow = originalOverflow;
		};
	});
</script>

<section class="programme-modal">
	<div
		class="modal-backdrop"
		onclick={closeModal}
		onkeydown={(e) => e.key === 'Escape' && closeModal()}
		role="button"
		tabindex="0"
		aria-label="Close modal"
	></div>
	<div class="modal-content" bind:this={modalContent} tabindex="-1">
		<button class="modal-close" onclick={closeModal}>×</button>

		<div class="modal-body">
			<p>Programme details and description would go here.</p>
			{#if programme.link}
				<a href={programme.link} class="programme-link" target="_blank" rel="noopener noreferrer">
					Learn More
				</a>
			{/if}
		</div>

		<div class="modal-header">
			{#if programme.cover}
				<img src={programme.cover} alt={programme.title} class="programme-cover" />
			{/if}

			<p>
				{@html programme.description || 'No description available for this programme.'}
			</p>
		</div>

		<div class="programme-info">
			<p class="programme-title">{programme.title}</p>
			<p class="programme-type">{programme.type}</p>
			<div class="programme-details">
				<p class="programme-date">{programme.date}</p>
				<p class="programme-time">{programme.startTime}</p>
			</div>
		</div>
	</div>
</section>

<style>
	.programme-modal {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: calc(100% - var(--nav-height));
		z-index: 1000;
		display: flex;
		justify-content: center;
		padding: 2rem;
	}

	.modal-backdrop {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: var(--color-primary);
	}

	.modal-content {
		position: relative;
		display: grid;
		grid-template-columns: 0.5fr 1fr 0.5fr;
		gap: 1rem;
		max-width: 75vw;
		width: 100%;
		/* max-height: 80vh; */
		/* overflow-y: auto; */
		outline: none;
	}

	.modal-close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: none;
		border: none;
		font-size: 2rem;
		cursor: pointer;
		color: #666;
		z-index: 1001;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: background-color 0.2s ease;
	}

	.modal-close:hover {
		background-color: rgba(0, 0, 0, 0.1);
		color: #000;
	}

	.modal-header {
		padding-bottom: 1rem;
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

	.programme-details {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.programme-date,
	.programme-time {
		font-size: 0.95rem;
		color: #666;
	}

	.modal-body {
		padding: 0 2rem 2rem;
	}

	.modal-body p {
		line-height: 1.6;
		color: #444;
		margin-bottom: 1.5rem;
	}

	.programme-link {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background-color: var(--color-primary, #003e00);
		color: white;
		text-decoration: none;
		border-radius: 4px;
		font-weight: 500;
		transition: background-color 0.2s ease;
	}

	.programme-link:hover {
		background-color: var(--color-primary-dark, #002200);
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.programme-modal {
			padding: 1rem;
		}

		.modal-content {
			max-height: 90vh;
		}

		.modal-header {
			padding: 1.5rem;
			padding-bottom: 1rem;
		}

		.modal-body {
			padding: 0 1.5rem 1.5rem;
		}

		.programme-title {
			font-size: 1.5rem;
		}

		.programme-details {
			flex-direction: column;
			gap: 0.5rem;
		}
	}
</style>

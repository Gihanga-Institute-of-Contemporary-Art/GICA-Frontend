<script lang="ts">
	import type { ContentBlock, TextContent } from '$lib/api';
	import { isFooterActive } from '$lib/stores/footerStore';

	let { headline, about } = $props<{
		headline: string;
		about: ContentBlock[];
	}>();

	function toggleFooter() {
		isFooterActive.update((active) => !active);
	}
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
					viewBox="0 0 88 50"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					xml:space="preserve"
					style="fill-rule:evenodd;clip-rule:evenodd;"
					class="feather feather-chevron-up"
					><path
						d="M6.203,43.68l37.477,-37.477l37.476,37.477"
						style="fill:none;fill-rule:nonzero;stroke:#bc9200;stroke-width:3px;"
					/></svg
				>
			</div>
			<div class="title-container">
				<p class="title">{headline}</p>
			</div>
			<div class="details">
				{#if $isFooterActive}
					<div class="sub-text">
						{#each about as block}
							{#if block.type === 'text'}
								{@const textContent = block.content as TextContent}
								{@html textContent.text}
							{/if}
						{/each}
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
		background: #011500;
		background: linear-gradient(
			0deg,
			rgba(1, 21, 0, 1) 45%,
			rgba(1, 21, 0, 0.5) 75%,
			rgba(255, 255, 0, 0) 88%
		);
		display: flex;
		align-items: center;
		padding-top: var(--space-4);
		color: rgb(188, 146, 0);
		z-index: 1000;
	}

	footer.active {
		height: 99vh;
		display: block;
		/* padding-block-start: var(--nav-height); */
		padding-top: var(--nav-height);
		background: linear-gradient(0deg, rgba(1, 21, 0, 1) 70%, rgba(255, 255, 0, 0) 92%);
	}

	.headline {
		cursor: pointer;
		transition: opacity 0.2s ease;
		display: grid;
		grid-template-columns: 0.5fr 4fr;
		grid-template-rows: auto;
		align-items: center;
	}

	.arrow-btn {
		width: 6rem;
		transition: transform 0.3s ease;
		align-self: start;
	}

	.arrow-btn.flipped {
		transform: rotate(180deg);
	}

	.headline p {
		margin: 0;
		padding: 0 1rem;
	}

	.title-container .title {
		font-size: var(--font-size-lg);
		font-family: var(--font-secondary);
		text-transform: uppercase;
	}

	.details {
		grid-column: 2 / 3;
	}

	.details .sub-text {
		font-size: var(--font-size-xl);
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
			padding-inline: var(--space-8);
			justify-content: start;
		}

		.content {
			margin: 0;
			padding-inline: 0;
			max-width: 100%;
			grid-template-rows: auto auto auto;
		}

		.title-container {
			grid-column: 1 / -1;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.details {
			grid-column: 1 / -1;
		}

		.details .sub-text {
			margin-top: var(--space-2);
		}
	}
</style>

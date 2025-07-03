<script lang="ts">
	let { isActive = $bindable(false) } = $props();

	function toggleFooter() {
		isActive = !isActive;
	}
</script>

<footer class:active={isActive}>
	<div class="content">
		<div
			class="headline"
			role="button"
			tabindex="0"
			onclick={toggleFooter}
			onkeydown={(e) => e.key === 'Enter' && toggleFooter()}
		>
			<div class="arrow-btn" class:flipped={isActive}>
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
			<div class="details">
				<p class="title">GICA — A LIVING SPACE FOR ART, RESEARCH, AND COLLECTIVE IMAGINATION.</p>
				{#if isActive}
					<div class="sub-text">
						<p>
							Gihanga Institute of Contemporary Art (GICA) is a non-profit center for the arts in
							Kigali, Rwanda. Founded on the belief that art can be a catalyst for social progress,
							GICA is home to a library, exhibition spaces, platforms for performance and
							contemporary theatre, screening room, studio, and an artist residency. Working from
							Kigali as a nexus of contemporary art and intellectual discourse, GICA aims to elevate
							Rwanda's artistic landscape, opening new possibilities through thoughtfully curated,
							high-quality exhibition spaces, collaborative platforms, and innovative educational
							programs. The institute aims to unite, support, and propel the cultural community in
							Rwanda, as a living space for art, research, and shared possibility.
						</p>
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
		color: var(--font-color-primary);
		z-index: 1000;
	}

	footer.active {
		height: 99vh;
		padding-block-start: var(--nav-height);
		background: linear-gradient(0deg, rgba(1, 21, 0, 1) 70%, rgba(255, 255, 0, 0) 92%);
	}

	.headline {
		cursor: pointer;
		transition: opacity 0.2s ease;
		display: grid;
		grid-template-columns: 0.5fr 4fr;
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

	.details .title {
		font-size: var(--font-size-lg);
		font-family: var(--font-secondary);
	}

	.details .sub-text p {
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
		}
	}
</style>

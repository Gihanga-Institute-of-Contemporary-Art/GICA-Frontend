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
			GICA — A LIVING SPACE FOR ART, RESEARCH, AND COLLECTIVE IMAGINATION.
		</div>
		{#if isActive}
			<div class="sub-text">
				<p>
					Gihanga Institute of Contemporary Art (GICA) is a non-profit center for the arts in
					Kigali, Rwanda. Founded on the belief that art can be a catalyst for social progress, GICA
					is home to a library, exhibition spaces, platforms for performance and contemporary
					theatre, screening room, studio, and an artist residency. Working from Kigali as a nexus
					of contemporary art and intellectual discourse, GICA aims to elevate Rwanda's artistic
					landscape, opening new possibilities through thoughtfully curated, high-quality exhibition
					spaces, collaborative platforms, and innovative educational programs. The institute aims
					to unite, support, and propel the cultural community in Rwanda, as a living space for art,
					research, and shared possibility.
				</p>
			</div>
		{/if}
	</div>
</footer>

<style>
	footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 5rem;
		background: #011500;
		background: linear-gradient(0deg, rgba(1, 21, 0, 1) 35%, rgba(255, 255, 0, 0) 88%);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-primary);
		padding: var(--space-8);
		font-size: var(--font-size-xl);
	}

	footer.active {
		height: 99vh;
		background: linear-gradient(0deg, rgba(1, 21, 0, 1) 80%, rgba(255, 255, 0, 0) 92%);
	}

	.headline {
		cursor: pointer;
		transition: opacity 0.2s ease;
	}

	.headline:hover {
		opacity: 0.8;
	}

	.headline:focus {
		outline-offset: 2px;
	}

	.content {
		max-width: 70vw;
		margin: 0 auto;
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
</style>

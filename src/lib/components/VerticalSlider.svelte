<script lang="ts">
	const imageCount = 10;
	const timePerImage = 20; // seconds per image
	const animationDuration = imageCount * timePerImage;

	let isPaused = false;

	function toggleAnimation() {
		isPaused = !isPaused;
	}
</script>

<div class="slider-container">
	<ul style="--animation-duration: {animationDuration}s;" class:paused={isPaused}>
		<!-- First set of images -->
		{#each Array(imageCount) as _, index}
			<li>
				<img src={`https://picsum.photos/600/400?random=${index}`} alt="Random Image {index + 1}" />
			</li>
		{/each}
		<!-- Duplicate set for seamless looping -->
		{#each Array(imageCount) as _, index}
			<li>
				<img src={`https://picsum.photos/600/400?random=${index}`} alt="Random Image {index + 1}" />
			</li>
		{/each}
	</ul>
	<div class="slider-btn">
		<button on:click={toggleAnimation}>
			{isPaused ? 'Play' : 'Pause'}
		</button>
		<button
			class="icon"
			on:click={toggleAnimation}
			aria-label={isPaused ? 'Play animation' : 'Pause animation'}
		>
			<div class="pause" class:hidden={isPaused}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
				</svg>
			</div>
			<div class="play" class:hidden={!isPaused}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="M8 5v14l11-7z" />
				</svg>
			</div>
		</button>
	</div>
</div>

<style>
	.slider-container {
		display: flex;
		justify-content: center;
		padding-inline: 2rem;
		height: 100vh;
		width: 100%;
		overflow: hidden;
		position: absolute;
		top: 0;
	}

	.slider-btn {
		position: absolute;
		bottom: 0;
		right: 0;
		padding: 1.5rem;
		display: flex;
		gap: 1.5rem;
	}

	.slider-btn button {
		background-color: transparent;
		border: none;
		cursor: pointer;
		font-size: var(--font-size-xl);
		text-transform: uppercase;
		color: var(--color-primary);
		z-index: 100;
	}

	.slider-btn .icon {
		background-color: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 1.5em; /* Match the font size */
		width: 1.5em; /* Keep it square */
	}

	.slider-btn .icon svg {
		width: 100%;
		height: 100%;
		fill: currentColor; /* Inherit text color */
	}

	.hidden {
		display: none;
	}

	.slider-container ul {
		display: flex;
		height: fit-content;
		width: 90%;
		flex-direction: column;
		gap: 5rem;
		list-style: none;
		padding: 0;
		margin: 0;
		animation: moveUp var(--animation-duration) linear infinite;
	}

	.slider-container ul.paused {
		animation-play-state: paused;
	}

	.slider-container li {
		width: 100%;
		height: 100%;
		background-color: white;
		mix-blend-mode: multiply;
	}

	.slider-container li:hover {
		mix-blend-mode: normal;
	}

	.slider-container li:hover img {
		filter: none;
	}

	.slider-container img {
		width: 100%;
		height: auto;
		display: block;
		filter: url(#duotone-filter);
	}

	/* Responsive Design */
	@media (max-width: 768px) {
	}

	/* move up animation */

	@keyframes moveUp {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(-50%);
		}
	}
</style>

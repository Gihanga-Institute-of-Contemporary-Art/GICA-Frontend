<script lang="ts">
	import { onMount } from 'svelte';
	import type { MediaCover } from '$lib/api';

	// MediaCover now includes photographer support!
	// Current MediaCover now includes: url, alt, caption, photographer, width, height, srcset

	interface Props {
		images: MediaCover[];
	}

	let { images }: Props = $props();

	const timePerImage = 20; // seconds per image
	const imageCount = $derived(images.length);
	const animationDuration = $derived(imageCount * timePerImage);

	let isPaused = $state(false);
	let sliderUl: HTMLUListElement;

	function toggleAnimation() {
		isPaused = !isPaused;
	}

	// Method to set paused state externally
	export function setPaused(paused: boolean) {
		isPaused = paused;
	}

	// Preload images for better performance
	onMount(() => {
		const preloadImages = () => {
			images.forEach((image) => {
				const img = new Image();
				img.src = image.url;
			});
		};

		preloadImages();

		// Optimize animation performance
		if (sliderUl) {
			sliderUl.style.willChange = 'transform';
		}

		return () => {
			if (sliderUl) {
				sliderUl.style.willChange = 'auto';
			}
		};
	});
</script>

<div class="slider-container">
	<ul
		style="--animation-duration: {animationDuration}s;"
		class:paused={isPaused}
		bind:this={sliderUl}
	>
		<!-- First set of images -->
		{#each images as image, index}
			<li>
				<figure>
					<img
						src={image.url}
						alt={image.alt || `Gallery Image ${index + 1}`}
						width={image.width}
						height={image.height}
					/>
					{#if image.caption || image.photographer}
						<figcaption>
							{#if image.caption}
								<span class="caption-text">{image.caption}</span>
							{/if}
							{#if image.photographer}
								<span class="photographer-credit">Photo: {image.photographer}</span>
							{/if}
						</figcaption>
					{/if}
				</figure>
			</li>
		{/each}
		<!-- Duplicate set for seamless looping -->
		{#each images as image, index}
			<li>
				<figure>
					<img
						src={image.url}
						alt={image.alt || `Gallery Image ${index + 1}`}
						width={image.width}
						height={image.height}
					/>
					{#if image.caption || image.photographer}
						<figcaption>
							{#if image.caption}
								<span class="caption-text">{image.caption}</span>
							{/if}
							{#if image.photographer}
								<span class="photographer-credit">Photo: {image.photographer}</span>
							{/if}
						</figcaption>
					{/if}
				</figure>
			</li>
		{/each}
	</ul>
	<div class="slider-btn">
		<button class="btn-text" onclick={toggleAnimation}>
			{isPaused ? 'Play' : 'Pause'}
		</button>
		<button
			class="icon"
			onclick={toggleAnimation}
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
		right: var(--space-4);
		height: var(--footer-height);
		padding-top: var(--space-4);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-1);
	}

	.slider-btn button {
		background-color: transparent;
		border: none;
		cursor: pointer;
		font-size: var(--font-size-lg);
		text-transform: uppercase;
		color: rgb(188, 146, 0);
		z-index: 1001;
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
		width: var(--content-width);
		flex-direction: column;
		gap: var(--space-16);
		list-style: none;
		padding: 0;
		margin: 0;
		animation: moveUp var(--animation-duration) linear infinite;
		will-change: transform;
		transform: translateZ(0); /* Force hardware acceleration */
		backface-visibility: hidden; /* Optimize for animations */
	}

	.slider-container ul.paused {
		animation-play-state: paused;
	}

	.slider-container li {
		width: 100%;
		height: 100%;
		/* background-color: white; */
		mix-blend-mode: multiply;
		border-radius: var(--radius-xl);
		contain: layout style paint; /* CSS containment for performance */
	}

	/* .slider-container li:hover {
		mix-blend-mode: normal;
	} */

	.slider-container li:hover img {
		filter: none;
	}

	.slider-container img {
		width: 100%;
		height: auto;
		display: block;
		filter: url(#duotone-filter);
		transform: translateZ(0); /* Force hardware acceleration for images */
		backface-visibility: hidden;
		border-radius: var(--radius-xl);
	}

	.slider-container figure {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
	}

	.slider-container figcaption {
		padding-block-start: var(--space-2);
		/* background: rgba(255, 255, 255, 0.9); */
		font-family: var(--font-secondary);
		font-size: var(--font-size-md);
		color: #d5c593;
		font-style: normal;
		border-radius: 0 0 var(--radius-xl) var(--radius-xl);
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.slider-container figcaption span {
		margin-bottom: var(--space-2);
	}

	.caption-text {
		display: block;
	}

	.photographer-credit {
		display: block;
		color: rgba(213, 197, 147, 0.7); /* Slightly more transparent version of the caption color */
		font-weight: 400;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.slider-btn {
			padding-block-start: var(--space-4);
			align-items: start;
			padding-inline-end: 0;
		}

		.slider-container ul {
			gap: var(--space-8);
		}
		.btn-text {
			display: none;
		}
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

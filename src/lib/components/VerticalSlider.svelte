<script lang="ts">
	import { onMount } from 'svelte';
	import type { MediaAsset } from '$lib/api';
	import { isFooterActive } from '$lib/stores/footerStore';

	// MediaCover now includes photographer support!
	// Current MediaCover now includes: url, alt, caption, photographer, width, height, srcset

	interface Props {
		images: MediaAsset[];
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

{#snippet imageItem(image: MediaAsset, index: number)}
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
						<span class="caption-text">
							{image.caption}
							{#if image.photographer}
								Photo: {image.photographer}
							{/if}
						</span>
					{/if}
				</figcaption>
			{/if}
		</figure>
	</li>
{/snippet}

<div class="slider-container">
	<ul
		style="--animation-duration: {animationDuration}s;"
		class:paused={isPaused}
		bind:this={sliderUl}
	>
		<!-- First set of images -->
		{#each images as image, index}
			{@render imageItem(image, index)}
		{/each}
		<!-- Duplicate set for seamless looping -->
		{#each images as image, index}
			{@render imageItem(image, index)}
		{/each}
	</ul>
	<div class="slider-btn" class:hidden={$isFooterActive}>
		<button class="btn-text" onclick={toggleAnimation}>
			{isPaused ? 'Play' : 'Pause'}
		</button>
		<button
			class="icon"
			onclick={toggleAnimation}
			aria-label={isPaused ? 'Play animation' : 'Pause animation'}
		>
			<div class="pause" class:hidden={isPaused}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 79 73">
					<defs>
						<style>
							.cls-1 {
								fill: none;
								stroke: var(--color-primary-light);
								stroke-width: 3px;
							}
						</style>
					</defs>
					<line class="cls-1" x1="35.83" y1="16.18" x2="35.83" y2="56.84" />
					<line class="cls-1" x1="46.74" y1="16.18" x2="46.74" y2="56.84" />
				</svg>
			</div>
			<div class="play" class:hidden={!isPaused}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 79 73">
					<defs>
						<style>
							.cls-1,
							.cls-2 {
								fill: none;
							}

							.cls-2 {
								stroke: var(--color-primary-light);
								stroke-width: 3px;
							}

							.cls-3 {
								clip-path: url(#clippath);
							}
						</style>
						<clipPath id="clippath">
							<rect class="cls-1" x="4.15" y="15.98" width="40.74" height="41.04" />
						</clipPath>
					</defs>
					<g class="cls-3">
						<path
							class="cls-2"
							d="M41.5,36.36c-11.94-5.97-23.88-11.94-35.82-17.91.03,12.03.07,24.06.1,36.09,11.91-6.06,23.81-12.12,35.72-18.18Z"
						/>
					</g>
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
		position: fixed;
		bottom: 0;
		right: var(--space-4);
		height: var(--footer-height);
		padding-top: var(--space-4);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-1);
		z-index: 1020;
		transition: opacity 0.3s ease;
	}

	.slider-btn.hidden {
		opacity: 0;
		pointer-events: none;
	}

	.slider-btn button {
		background-color: transparent;
		border: none;
		cursor: pointer;
		font-size: var(--font-size-lg);
		text-transform: uppercase;
		color: var(--color-primary-light);
	}

	.slider-btn .icon {
		background-color: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		height: var(--arrow-size);
		width: var(--arrow-size);
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
		color: var(--font-color-primary);
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

	/* Responsive Design */
	@media (max-width: 768px) {
		/* .slider-btn {
			padding-block-start: var(--space-2);
			align-items: start;
			padding-inline-end: 0;
		} */

		.slider-container ul {
			gap: var(--space-8);
			width: 100%;
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

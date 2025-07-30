<script lang="ts">
	import { onMount } from 'svelte';
	import { createNoise2D } from 'simplex-noise';

	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;
	let width: number;
	let height: number;

	const FINAL_DENSITY_MULTIPLIER = 0.25;
	const INITIAL_DENSITY_MULTIPLIER = 0.00002;
	const ANIMATION_DURATION = 10000; // 10 seconds in milliseconds
	const DOT_SIZE = 1.5;
	const NOISE_SCALE = 0.01;
	const SEED = 12345; // Fixed seed for consistent pattern
	const noise2D = createNoise2D(); // Returns a function directly

	let currentDensityMultiplier = INITIAL_DENSITY_MULTIPLIER;
	let animationStartTime: number | null = null;
	let dotPositions: Array<{ x: number; y: number; density: number }> = [];
	let animationFrameId: number | null = null;
	let isAnimationComplete = false;

	// Seeded random number generator for consistent patterns
	function seededRandom(seed: number) {
		let state = seed;
		return function () {
			state = (state * 1664525 + 1013904223) % 4294967296;
			return state / 4294967296;
		};
	}

	function generateDotPositions() {
		if (!width || !height) return;

		const area = width * height;
		const totalDots = Math.floor(area * FINAL_DENSITY_MULTIPLIER);
		const rng = seededRandom(SEED);

		dotPositions = [];

		for (let i = 0; i < totalDots; i++) {
			const x = rng() * width;
			const y = rng() * height;
			const density = densityAt(x, y);

			if (rng() < density) {
				dotPositions.push({ x, y, density });
			}
		}
	}

	function densityAt(x: number, y: number): number {
		const nx = x * NOISE_SCALE;
		const ny = y * NOISE_SCALE;
		const value = noise2D(nx, ny); // Call the function directly
		return Math.max(0, Math.min(1, (value + 1) / 2)); // Normalize to [0, 1]
	}

	function drawPattern(ctx: CanvasRenderingContext2D) {
		if (dotPositions.length === 0) return;

		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = '#756c4d';

		const targetDotCount = Math.floor(
			dotPositions.length * (currentDensityMultiplier / FINAL_DENSITY_MULTIPLIER)
		);

		for (let i = 0; i < targetDotCount; i++) {
			const dot = dotPositions[i];
			ctx.fillRect(dot.x - DOT_SIZE / 2, dot.y - DOT_SIZE / 2, DOT_SIZE, DOT_SIZE);
		}
	}

	function easeInOutCubic(t: number): number {
		return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	}

	function animate(timestamp: number) {
		if (animationStartTime === null) {
			animationStartTime = timestamp;
		}

		const elapsed = timestamp - animationStartTime;
		const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
		const easedProgress = easeInOutCubic(progress);

		currentDensityMultiplier =
			INITIAL_DENSITY_MULTIPLIER +
			(FINAL_DENSITY_MULTIPLIER - INITIAL_DENSITY_MULTIPLIER) * easedProgress;

		const ctx = canvas?.getContext('2d');
		if (ctx && width && height) {
			drawPattern(ctx);
		}

		if (progress < 1) {
			animationFrameId = requestAnimationFrame(animate);
		} else {
			// Animation complete - clean up
			isAnimationComplete = true;
			animationFrameId = null;
			currentDensityMultiplier = FINAL_DENSITY_MULTIPLIER;
		}
	}

	function resizeCanvas() {
		if (!canvas || !container) return;

		const rect = container.getBoundingClientRect();
		const ratio = window.devicePixelRatio || 1;

		width = rect.width * ratio;
		height = rect.height * ratio;

		canvas.width = width;
		canvas.height = height;
		canvas.style.width = rect.width + 'px';
		canvas.style.height = rect.height + 'px';

		const ctx = canvas.getContext('2d');
		if (ctx) {
			ctx.scale(ratio, ratio);
			width = rect.width;
			height = rect.height;
			generateDotPositions();

			// Only redraw if animation is complete, otherwise let animate() handle it
			if (isAnimationComplete) {
				drawPattern(ctx);
			}
		}
	}

	onMount(() => {
		resizeCanvas();
		animationFrameId = requestAnimationFrame(animate);

		window.addEventListener('resize', resizeCanvas);

		return () => {
			// Clean up event listeners and cancel any pending animation frame
			window.removeEventListener('resize', resizeCanvas);
			if (animationFrameId !== null) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	});
</script>

<div class="pattern" bind:this={container}>
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.pattern {
		width: 100%;
		height: 100vh;
		position: fixed;
		overflow: hidden;
	}

	canvas {
		display: block;
		width: 100%;
		height: 100%;
		image-rendering: pixelated;
	}
</style>

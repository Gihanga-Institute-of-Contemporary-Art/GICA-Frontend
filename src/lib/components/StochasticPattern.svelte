<script lang="ts">
	import { onMount } from 'svelte';
	import { createNoise2D } from 'simplex-noise';

	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;
	let width: number;
	let height: number;

	const DENSITY_MULTIPLIER = 0.25;
	const DOT_SIZE = 1.5;
	const NOISE_SCALE = 0.01;
	const noise2D = createNoise2D(); // Returns a function directly

	function densityAt(x: number, y: number): number {
		const nx = x * NOISE_SCALE;
		const ny = y * NOISE_SCALE;
		const value = noise2D(nx, ny); // Call the function directly
		return Math.max(0, Math.min(1, (value + 1) / 2)); // Normalize to [0, 1]
	}

	function drawPattern(ctx: CanvasRenderingContext2D) {
		const area = width * height;
		const dotCount = Math.floor(area * DENSITY_MULTIPLIER);

		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = '#756c4d';

		for (let i = 0; i < dotCount; i++) {
			const x = Math.random() * width;
			const y = Math.random() * height;

			const density = densityAt(x, y);
			if (Math.random() < density) {
				ctx.fillRect(x - DOT_SIZE / 2, y - DOT_SIZE / 2, DOT_SIZE, DOT_SIZE);
			}
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
			drawPattern(ctx);
		}
	}

	onMount(() => {
		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);
		return () => window.removeEventListener('resize', resizeCanvas);
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

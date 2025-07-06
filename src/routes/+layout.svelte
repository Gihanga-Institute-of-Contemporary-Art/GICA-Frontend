<script lang="ts">
	import Footer from '../lib/components/Footer.svelte';
	import { onMount } from 'svelte';

	let { data, children } = $props();

	let customCursor: HTMLDivElement;

	onMount(() => {
		let animationId: number;
		let mouseX = 0;
		let mouseY = 0;

		const updateCursor = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};

		const animateCursor = () => {
			if (customCursor) {
				customCursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
			}
			animationId = requestAnimationFrame(animateCursor);
		};

		const hideCursor = () => {
			if (customCursor) {
				customCursor.style.opacity = '0';
			}
		};

		const showCursor = () => {
			if (customCursor) {
				customCursor.style.opacity = '1';
			}
		};

		document.addEventListener('mousemove', updateCursor, { passive: true });
		document.addEventListener('mouseleave', hideCursor);
		document.addEventListener('mouseenter', showCursor);

		// Hide default cursor
		document.body.style.cursor = 'none';

		// Start animation loop
		animationId = requestAnimationFrame(animateCursor);

		return () => {
			document.removeEventListener('mousemove', updateCursor);
			document.removeEventListener('mouseleave', hideCursor);
			document.removeEventListener('mouseenter', showCursor);
			document.body.style.cursor = 'auto';
			cancelAnimationFrame(animationId);
		};
	});
</script>

<!-- Custom Cursor -->
<div class="custom-cursor" bind:this={customCursor}></div>

<!-- Page content -->
{@render children()}

<Footer headline={data.home.headline} about={data.home.about} />

<style>
	.custom-cursor {
		position: fixed;
		top: 0;
		left: 0;
		width: 25px;
		height: 25px;
		background-color: #04cf00;
		border-radius: 50%;
		pointer-events: none;
		z-index: 9999;
		will-change: transform;
		transform: translate(-50%, -50%);
		transition: opacity 0.2s ease;
	}

	/* Hide default cursor globally */
	:global(*) {
		cursor: none !important;
	}
</style>

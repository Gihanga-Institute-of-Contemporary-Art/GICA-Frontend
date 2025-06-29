<script lang="ts">
	import { onMount } from 'svelte';

	let customCursor: HTMLDivElement;

	onMount(() => {
		const updateCursor = (e: MouseEvent) => {
			if (customCursor) {
				customCursor.style.left = e.clientX + 'px';
				customCursor.style.top = e.clientY + 'px';
			}
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

		document.addEventListener('mousemove', updateCursor);
		document.addEventListener('mouseleave', hideCursor);
		document.addEventListener('mouseenter', showCursor);

		// Hide default cursor
		document.body.style.cursor = 'none';

		return () => {
			document.removeEventListener('mousemove', updateCursor);
			document.removeEventListener('mouseleave', hideCursor);
			document.removeEventListener('mouseenter', showCursor);
			document.body.style.cursor = 'auto';
		};
	});
</script>

<!-- Custom Cursor -->
<div class="custom-cursor" bind:this={customCursor}></div>

<!-- Page content -->
<slot />

<style>
	.custom-cursor {
		position: fixed;
		top: 0;
		left: 0;
		width: 50px;
		height: 50px;
		background-color: #04cf00;
		border-radius: 50%;
		pointer-events: none;
		z-index: 9999;
		transform: translate(-50%, -50%);
	}

	/* Hide default cursor globally */
	:global(*) {
		cursor: none !important;
	}
</style>

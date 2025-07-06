<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import VerticalSlider from '$lib/components/VerticalSlider.svelte';
	import DuotoneFilter from '$lib/components/DuotoneFilter.svelte';
	import { isFooterActive } from '$lib/stores/footerStore';
	import type { PageData } from './$types';
	import { updateScopedColors, getCurrentColors } from '$lib/colorTime';
	import { onMount } from 'svelte';
	let { data }: { data: PageData } = $props();

	let sliderRef: VerticalSlider;
	let mainElement: HTMLElement;

	onMount(() => {
		if (mainElement) {
			updateScopedColors(mainElement);
			setInterval(() => updateScopedColors(mainElement), 10 * 60 * 1000); // every 10 minutes
		}
	});

	// Reactive effect to pause/unpause slider based on footer state
	$effect(() => {
		if (sliderRef) {
			sliderRef.setPaused($isFooterActive);
		}
	});
</script>

<main bind:this={mainElement} class="home-page">
	<Nav />
	<DuotoneFilter />

	<section class="content">
		<VerticalSlider bind:this={sliderRef} images={data.home.carousel} />
	</section>
</main>

<style>
	.home-page {
		background-color: var(--color-primary-light);
		color: var(--font-color-primary);
		min-height: 100vh;
	}

	section.content {
		display: flex;
		justify-content: center;
		height: 100%;
		overflow: hidden;
	}
</style>

<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Header from '$lib/components/Header.svelte';
	import VerticalSlider from '$lib/components/VerticalSlider.svelte';
	import DuotoneFilter from '$lib/components/DuotoneFilter.svelte';
	import { isFooterActive } from '$lib/stores/footerStore';
	import { createSEOData } from '$lib/seo';
	import { translateHomeContent } from '$lib/i18n/translate';
	import StochasticPattern from '$lib/components/StochasticPattern.svelte';
	// import { currentLanguage } from '$lib/stores/languageStore';
	import type { PageData } from './$types';
	// import { updateScopedColors, getCurrentColors } from '$lib/colorTime';
	// import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	let sliderRef: VerticalSlider;
	let mainElement: HTMLElement;

	// Get translated home content based on current language
	const translatedHome = $derived(translateHomeContent(data.home));

	// SEO data for home page
	const seoData = createSEOData({
		title: 'GICA',
		description: 'A LIVING SPACE FOR ART, RESEARCH, AND COLLECTIVE IMAGINATION',
		keywords: 'GICA, innovation, technology, creative solutions, digital experiences',
		// image: '/images/gica-home-og.jpg',
		imageAlt: 'GICA Homepage - A LIVING SPACE FOR ART, RESEARCH, AND COLLECTIVE IMAGINATION',
		type: 'website'
	});

	// onMount(() => {
	// 	if (mainElement) {
	// 		updateScopedColors(mainElement);
	// 		setInterval(() => updateScopedColors(mainElement), 10 * 60 * 1000); // every 10 minutes
	// 	}
	// });

	// Reactive effect to pause/unpause slider based on footer state
	$effect(() => {
		if (sliderRef) {
			sliderRef.setPaused($isFooterActive);
		}
	});
</script>

<Header {...seoData} />
<StochasticPattern />
<main bind:this={mainElement} class="home-page">
	<Nav />
	<DuotoneFilter baseHex="#756c4d" />

	<section class="content">
		<VerticalSlider bind:this={sliderRef} images={translatedHome.carousel} />
	</section>
</main>

<style>
	.home-page {
		/* background-color: var(--color-primary-light); */
		background-color: rgb(247, 233, 209);
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

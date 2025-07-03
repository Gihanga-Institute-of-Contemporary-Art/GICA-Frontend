<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import VerticalSlider from '$lib/components/VerticalSlider.svelte';
	import DuotoneFilter from '$lib/components/DuotoneFilter.svelte';

	let isFooterActive = $state(false);
	let sliderRef: VerticalSlider;

	// const props = $props();

	// Reactive effect to pause/unpause slider based on footer state
	$effect(() => {
		if (sliderRef) {
			sliderRef.setPaused(isFooterActive);
		}
	});
</script>

<main>
	<Nav />
	<DuotoneFilter />

	<section class="content">
		<VerticalSlider bind:this={sliderRef} />
	</section>
	<Footer bind:isActive={isFooterActive} />
</main>

<style>
	section.content {
		display: flex;
		justify-content: center;
		height: 100%;
		overflow: hidden;
	}
</style>

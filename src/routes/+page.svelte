<script>
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import VerticalSlider from '$lib/components/VerticalSlider.svelte';
	import DuotoneFilter from '$lib/components/DuotoneFilter.svelte';
</script>

<main>
	<Nav />
	<DuotoneFilter />

	<section class="content">
		<VerticalSlider />
	</section>
	<Footer />
</main>

<style>
	main {
		/* background-color: var(--color-primary); */
		padding-inline: 2rem;
	}

	section.content {
		display: flex;
		justify-content: center;
		height: 100%;
		overflow: hidden;
	}
</style>

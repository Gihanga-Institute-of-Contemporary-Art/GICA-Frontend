<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';
</script>

<main>
	<Nav />
	<h2>Visit Us</h2>
	<Footer />
</main>

<style>
	main {
		padding-block-start: var(--nav-height);
	}
</style>

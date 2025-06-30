<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';
</script>

<main>
	<Nav />
	<section class="content">
		<div class="blurb">
			<p>
				Gihanga Institute of Contemporary Art (GICA) is a non-profit center for the arts in Kigali,
				Rwanda. Founded on the belief that art can be a catalyst for social progress, GICA is home
				to a library, exhibition spaces, platforms for performance and contemporary theatre,
				screening room, studio, and an artist residency. Working from Kigali as a nexus of
				contemporary art and intellectual discourse, GICA aims to elevate Rwanda's artistic
				landscape, opening new possibilities through thoughtfully curated, high-quality exhibition
				spaces, collaborative platforms, and innovative educational programs. The institute aims to
				unite, support, and propel the cultural community in Rwanda, as a living space for art,
				research, and shared possibility.
			</p>
		</div>
	</section>
	<Footer />
</main>

<style>
	main {
		padding-inline: 2rem;
	}

	section.content {
		max-width: 75vw;
		margin: 0 auto;
	}
</style>

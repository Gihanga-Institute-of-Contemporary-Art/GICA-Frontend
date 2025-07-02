<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';
</script>

<main>
	<Nav />
	<section class="content">
		<article class="blurb">
			<p>
				Quarterly exhibitions anchor the work of Rwandan artists and their practices alongside
				global contemporaries. These exhibitions celebrate experimentation, dialogue, and the
				diverse ways artists engage with local and international contexts. Each show is curated to
				spark critical conversation and offer new perspectives on artmaking today. Through these
				exhibitions, the space cultivates a dynamic and inclusive platform for creative exchange.
			</p>
		</article>
	</section>
	<Footer />
</main>

<style>
	main {
		padding-block-start: var(--nav-height);
	}

	section.content {
		max-width: 75vw;
		margin: 0 auto;
		padding-block-end: var(--space-2);
	}

	section.content .blurb {
		font-family: var(--font-secondary);
		font-size: var(--font-size-xl);
	}

	@media (max-width: 768px) {
		section.content {
			max-width: 90vw;
		}
	}
</style>

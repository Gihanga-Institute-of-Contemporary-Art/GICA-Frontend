<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';

	const collaborators = [
		{
			name: 'KENEZA SCHAAL',
			title: 'Founding Director'
		},
		{
			name: 'KAMI GAHIGA',
			title: 'Co-Founder Director'
		},
		{
			name: 'AMINA EL-ABD',
			title: 'Visual Artist'
		},
		{
			name: 'JAMES ODURO',
			title: 'Writer'
		},
		{
			name: 'LILA MENSAH',
			title: 'Performance Artist'
		},
		{
			name: 'SOFIA RUIZ',
			title: 'Curator'
		},
		{
			name: 'DAVID KIM',
			title: 'Composer'
		},
		{
			name: 'FATIMA ALI',
			title: 'Poet'
		},
		{
			name: 'MARCUS TAYLOR',
			title: 'Film Director'
		},
		{
			name: 'YARA HASSAN',
			title: 'Multimedia Artist'
		},
		{
			name: 'CHLOE BROWN',
			title: 'Dramaturg'
		},
		{
			name: 'RAHUL SINGH',
			title: 'Installation Artist'
		}
	];
</script>

<main>
	<Nav />
	<section class="content">
		<article class="blurb">
			<p>
				We would like to thank the following individuals and organizations who have supported us
				along the way, which has helped us build and provide a solid foundation for artistic
				experiment ( ... space to thank below ) . If you like what we're doing and would like to
				donate, send us books for our free reading room, please send us a note using the form in the
				next column. We will be in touch soon
			</p>
		</article>
		<article class="collaborators">
			<!-- List all collaborators -->
			{#each collaborators as collaborator}
				<p>{collaborator.name}, {collaborator.title}</p>
			{/each}
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
		margin-block: var(--space-2);
		font-size: var(--font-size-xl);
	}

	article.collaborators {
		width: fit-content;
		margin: 0 auto;
		padding-block-start: var(--space-16);
		padding-block-end: calc(2 * var(--space-16));
	}
</style>

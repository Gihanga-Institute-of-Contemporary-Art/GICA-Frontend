<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';

	const collaborators = [
		{
			name: 'Kami Gahiga',
			title: 'Co-Founding Director'
		},
		{
			name: 'Kaneza Schaal',
			title: 'Co-Founding Director'
		},
		{
			name: 'Christian Nyampeta',
			title: 'Library & Film Custodian'
		},
		{
			name: 'Alvin Ashiatey',
			title: 'Website Design Partner'
		},
		{
			name: 'Nontsikelelo Mutiti',
			title: 'Visual Design Partner'
		},
		{
			name: 'Amin Gafaranga',
			title: 'Architect'
		},
		{
			name: 'Eric Kacou',
			title: 'Strategic Advisor'
		},
		{
			name: 'Lydie Murorunkwere',
			title: 'Strategic Advisoret'
		}
	];
</script>

<main>
	<Nav />
	<section class="content">
		<article class="blurb">
			<p>
				If you like what we're doing and would like to donate, send us books for our free reading
				room, please send us a note using the form in the next column. We will be in touch soon...
			</p>
		</article>
		<article class="collaborators">
			<!-- List all collaborators -->
			{#each collaborators as collaborator}
				<p>
					<span class="name">{collaborator.name}</span>,
					<span class="title">{collaborator.title}</span>
				</p>
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
	}

	section.content .blurb {
		font-family: var(--font-primary);
		font-size: var(--font-size-xl);
	}

	article.collaborators {
		width: fit-content;
		margin: 0 auto;
		font-size: var(--font-size-lg);
		padding-block-start: var(--space-16);
		padding-block-end: calc(2 * var(--space-16));
	}

	.collaborators span.name {
		font-family: var(--font-primary);
	}

	.collaborators .name {
		text-transform: uppercase;
	}

	@media (max-width: 768px) {
		section.content {
			max-width: 90vw;
		}
	}
</style>

<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Header from '$lib/components/Header.svelte';
	import type { Contributors } from '$lib/api/schemas/gicaSchema';
	import type { PageData } from './$types';
	import { createSEOData } from '$lib/seo';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Type the contributors data properly
	const contributors: Contributors = data.contributors;

	// Create SEO data for the contributors page
	const seoData = createSEOData({
		title: 'Contributors',
		description: `Meet the team and contributors behind GICA - artists, curators, researchers, and cultural practitioners who make our work possible. ${
			contributors.children?.length
				? `Featuring ${contributors.children.length} contributors and collaborators.`
				: 'Our growing community of creative professionals.'
		}`,
		keywords:
			'GICA contributors, team, collaborators, artists, curators, researchers, staff, Rwanda, contemporary art',
		type: 'website',
		section: 'contributors'
	});
</script>

<Header {...seoData} />

<main>
	<Nav />
	<section class="content">
		<article class="collaborators">
			<!-- List all contributors from API data -->
			{#if contributors.children && contributors.children.length > 0}
				{#each contributors.children as contributor}
					<div class="contributor">
						<p>
							<span class="name">{contributor.title}</span>
							{#if contributor.role}
								<span class="role">{contributor.role}</span>
							{/if}
						</p>
					</div>
				{/each}
			{:else}
				<p>No contributors data available.</p>
			{/if}
			<div class="contributor">
				<div class="sponsor__logo">
					<span class="name">Major Sponsors</span>
					<img src="/images/MellonFoundation_Black.png" alt="Mellon Foundation Logo" />
				</div>
			</div>
		</article>
	</section>
</main>

<style>
	main {
		padding-block-start: var(--nav-height);
	}
	section.content {
		max-width: var(--content-width);
		margin: 0 auto;
		margin-block-end: var(--space-2);
	}

	article.collaborators {
		width: 100%;
		font-size: var(--font-size-lg);
		padding-block-end: calc(2 * var(--space-16));
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-2);
	}

	.contributor {
		display: flex;
		align-items: flex-start;
		gap: var(--space-4);
		margin-bottom: var(--space-8);
	}

	.contributor p {
		display: flex;
		flex-direction: column;
	}

	.contributor p span {
		margin: 0;
	}

	.contributor .sponsor__logo {
		width: 12rem;
	}

	.collaborators span.name {
		font-family: var(--font-primary);
		text-transform: uppercase;
		white-space: nowrap;
	}

	@media (max-width: 768px) {
		section.content {
			max-width: 90vw;
		}

		article.collaborators {
			grid-template-columns: 1fr;
		}

		.contributor {
			margin-bottom: var(--space-2);
		}
	}
</style>

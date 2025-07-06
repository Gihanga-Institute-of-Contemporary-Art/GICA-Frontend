<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import type { Contributors } from '$lib/api/schemas/gicaSchema';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Type the contributors data properly
	const contributors: Contributors = data.contributors;
</script>

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
								, <span class="role">{contributor.role}</span>
							{/if}
						</p>
					</div>
				{/each}
			{:else}
				<p>No contributors data available.</p>
			{/if}
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
		margin-block: var(--space-2);
	}

	article.collaborators {
		width: fit-content;
		margin: 0 auto;
		font-size: var(--font-size-lg);
		padding-block-end: calc(2 * var(--space-16));
	}

	.contributor {
		display: flex;
		align-items: flex-start;
		gap: var(--space-4);
		margin-bottom: var(--space-8);
	}

	.collaborators span.name {
		font-family: var(--font-primary);
		text-transform: uppercase;
	}

	@media (max-width: 768px) {
		section.content {
			max-width: 90vw;
		}
	}
</style>

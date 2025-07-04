<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import type { Contributors } from '$lib/api/types';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Type the contributors data properly
	const contributors: Contributors = data.contributors;

	console.log('Contributors data:', contributors);
</script>

<main>
	<Nav />
	<section class="content">
		<article class="blurb">
			<h1>{contributors.title}</h1>
			<p>
				If you like what we're doing and would like to donate, send us books for our free reading
				room, please send us a note using the form in the next column. We will be in touch soon...
			</p>
		</article>
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

	section.content .blurb {
		font-family: var(--font-primary);
		font-size: var(--font-size-xl);
	}

	section.content .blurb h1 {
		font-family: var(--font-primary);
		font-size: var(--font-size-xxl);
		margin-bottom: var(--space-4);
		text-transform: uppercase;
	}

	article.collaborators {
		width: fit-content;
		margin: 0 auto;
		font-size: var(--font-size-lg);
		padding-block-start: var(--space-16);
		padding-block-end: calc(2 * var(--space-16));
	}

	.contributor {
		display: flex;
		align-items: flex-start;
		gap: var(--space-4);
		margin-bottom: var(--space-8);
	}

	.contributor.text-only {
		display: block;
		margin-bottom: var(--space-2);
	}

	.contributor.text-only .contributor-info {
		width: 100%;
	}

	.contributor-image {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		object-fit: cover;
	}

	.contributor-info {
		flex: 1;
	}

	.collaborators span.name {
		font-family: var(--font-primary);
		text-transform: uppercase;
	}

	.collaborators .bio {
		font-family: var(--font-secondary);
	}

	.socials {
		margin-top: var(--space-2);
		display: flex;
		gap: var(--space-4);
	}

	.socials a {
		font-size: var(--font-size-sm);
		color: var(--color-secondary);
		text-decoration: none;
	}

	.socials a:hover {
		text-decoration: underline;
	}

	@media (max-width: 768px) {
		section.content {
			max-width: 90vw;
		}
	}
</style>

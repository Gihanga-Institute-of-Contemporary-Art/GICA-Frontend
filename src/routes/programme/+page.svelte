<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';

	const programmes = [
		{
			title: 'Kamelah Janan Rasheed: The Unseen',
			type: 'Exhibition',
			link: '#',
			date: '2023-10-01',
			startTime: '10:00 AM',
			cover: 'https://picsum.photos/600/400?random=1'
		},
		{
			title: 'Black Girl',
			type: 'Screening',
			link: '#',
			date: '2023-11-15',
			startTime: '09:00 AM',
			cover: 'https://picsum.photos/600/400?random=2'
		},
		{
			title: 'Beloved By Toni Morrison',
			type: 'Library',
			link: '#',
			date: '2023-12-01',
			startTime: '11:00 AM',
			cover: null
		}
	];
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
	<section class="programmes">
		<div class="programmes-grid">
			{#each programmes as programme}
				<a href={programme.link} class="programme-card">
					<div
						class="programme-image"
						style="background-color: #003e00; {programme.cover
							? `background-image: url(${programme.cover})`
							: ''}"
					>
						<div class="programme-overlay">
							<h3 class="programme-title">{programme.title}</h3>
							<p class="programme-date">{programme.date}</p>
							<p class="programme-time">{programme.startTime}</p>
						</div>
					</div>
				</a>
			{/each}
			{#each programmes as programme}
				<a href={programme.link} class="programme-card">
					<div
						class="programme-image"
						style="background-color: #003e00; {programme.cover
							? `background-image: url(${programme.cover})`
							: ''}"
					>
						<div class="programme-overlay">
							<h3 class="programme-title">{programme.title}</h3>
							<p class="programme-date">{programme.date}</p>
							<p class="programme-time">{programme.startTime}</p>
						</div>
					</div>
				</a>
			{/each}
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
		margin-bottom: 4rem;
	}

	section.content .blurb {
		font-size: var(--font-size-xl);
	}

	.programmes {
		max-width: 75vw;
		margin: 0 auto;
		padding-bottom: var(--space-16);
		margin-bottom: 4rem;
	}

	.programmes-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 2rem;
	}

	.programme-card {
		text-decoration: none;
		color: inherit;
	}

	.programme-card:hover {
		outline: 2px solid var(--color-primary-light);
	}
	.programme-card:hover .programme-overlay {
		color: var(--color-primary-light);
	}

	.programme-card:hover .programme-image {
		background-color: transparent !important;
	}

	.programme-image {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		background-size: cover;
		background-position: center;
		overflow: hidden;
	}

	.programme-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: 1.5rem;
		color: white;
	}

	.programme-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		line-height: 1.3;
	}

	.programme-date {
		font-size: 1rem;
		margin-bottom: 0.25rem;
	}

	.programme-time {
		font-size: 0.9rem;
		opacity: 0.9;
	}

	/* Responsive design */
	@media (max-width: 1200px) {
		.programmes-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 768px) {
		.programmes-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 1.5rem;
		}
	}

	@media (max-width: 480px) {
		.programmes-grid {
			grid-template-columns: 1fr;
		}
	}
</style>

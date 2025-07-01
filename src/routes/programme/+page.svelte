<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import ProgrammeModal from '$lib/components/ProgrammeModal.svelte';
	import type { Programme } from '$lib/api/types';

	const { data } = $props();

	let isModalOpen = $state(false);
	let selectedProgramme = $state<Programme | null>(null);
	let selectedFilter = $state<string | null>(null);
	let selectedTimeFilter = $state<string | null>(null);
	let programmesSection: HTMLElement | undefined;

	// Helper function to determine programme status based on date
	function getProgrammeStatus(dateString: string): 'past' | 'current' | 'upcoming' {
		const programmeDate = new Date(dateString);
		const today = new Date();
		const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

		if (programmeDate < todayStart) {
			return 'past';
		} else if (programmeDate >= todayStart && programmeDate < todayEnd) {
			return 'current';
		} else {
			return 'upcoming';
		}
	}

	// Get unique programme types and create submenu
	const programmeTypes = Array.from(new Set(data.site.programmes.map((p) => p.type)));

	const typeSubmenu = $derived(
		programmeTypes.map((type) => ({
			label: type,
			value: type.toLowerCase(),
			isActive: selectedFilter === type.toLowerCase()
		}))
	);

	const timeSubmenu = $derived([
		{ label: 'Past', value: 'past', isActive: selectedTimeFilter === 'past' },
		{ label: 'Current', value: 'current', isActive: selectedTimeFilter === 'current' },
		{ label: 'Upcoming', value: 'upcoming', isActive: selectedTimeFilter === 'upcoming' }
	]);

	const submenuRows = $derived([
		{
			items: typeSubmenu,
			onSelect: (value: string) => {
				// Toggle logic: if already selected, deselect it
				selectedFilter = selectedFilter === value ? null : value;
				scrollToProgrammes();
			}
		},
		{
			items: timeSubmenu,
			onSelect: (value: string) => {
				// Toggle logic: if already selected, deselect it
				selectedTimeFilter = selectedTimeFilter === value ? null : value;
				scrollToProgrammes();
			}
		}
	]);

	// Filter programmes based on both selected filters
	const filteredProgrammes = $derived(
		(() => {
			let filtered = data.site.programmes;

			// Filter by type (only if a type is selected)
			if (selectedFilter) {
				filtered = filtered.filter((p) => p.type.toLowerCase() === selectedFilter);
			}

			// Filter by time (only if a time filter is selected)
			if (selectedTimeFilter) {
				filtered = filtered.filter((p) => getProgrammeStatus(p.date) === selectedTimeFilter);
			}

			return filtered;
		})()
	);

	function openModal(programme: Programme) {
		selectedProgramme = programme;
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		selectedProgramme = null;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isModalOpen) {
			closeModal();
		}
	}

	function scrollToProgrammes() {
		// Scroll to programmes section when filter is selected
		if (programmesSection) {
			// Calculate the offset to position programmes section right under the nav + submenus
			const navHeight = (document.querySelector('nav') as HTMLElement)?.offsetHeight || 0;
			const submenuElements = document.querySelectorAll('.submenu');
			const totalSubmenuHeight = Array.from(submenuElements).reduce((total, submenu) => {
				return total + ((submenu as HTMLElement)?.offsetHeight || 0);
			}, 0);
			const totalOffset = navHeight + totalSubmenuHeight + 16; // Adding 16px for some visual breathing room

			const elementPosition = programmesSection.offsetTop;
			const offsetPosition = elementPosition - totalOffset;

			window.scrollTo({
				top: Math.max(0, offsetPosition), // Ensure we don't scroll to negative values
				behavior: 'smooth'
			});
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<main>
	<Nav {submenuRows} />
	<section class="content">
		<article class="blurb">
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
		</article>
		<article class="programmes" bind:this={programmesSection}>
			<div class="programmes-grid">
				{#each filteredProgrammes as programme}
					<button type="button" class="programme-card" onclick={() => openModal(programme)}>
						<div
							class="programme-image"
							style="background-color: #003e00; {programme.cover
								? `background-image: url(${programme.cover})`
								: ''}"
						>
							<div class="programme-overlay">
								<p class="programme-title">{programme.title}</p>
								<p class="programme-date">{programme.date}</p>
								<p class="programme-time">{programme.startTime}</p>
							</div>
						</div>
					</button>
				{/each}
			</div>
		</article>
	</section>

	<Footer />

	{#if isModalOpen && selectedProgramme}
		<ProgrammeModal programme={selectedProgramme} {closeModal} />
	{/if}
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
		font-size: var(--font-size-xl);
	}

	article.programmes {
		max-width: 75vw;
		margin: 0 auto;
		/* padding-bottom: var(--space-16); */
		margin-block: var(--space-16);
	}

	.programmes-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 2rem;
	}

	.programme-card {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		text-decoration: none;
		text-transform: uppercase;
		color: inherit;
		width: 100%;
	}

	.programme-card:hover {
		outline: 2px solid var(--color-secondary);
	}
	.programme-card:hover .programme-overlay {
		color: var(--color-secondary);
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
		font-size: var(--font-size-lg);
	}

	.programme-title {
		margin-bottom: 0.5rem;
		line-height: 1.3;
	}

	.programme-date {
		margin-bottom: 0.25rem;
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

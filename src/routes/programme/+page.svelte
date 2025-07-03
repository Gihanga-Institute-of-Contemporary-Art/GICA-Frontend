<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import ProgrammeModal from '$lib/components/ProgrammeModal.svelte';
	import type { Programme } from '$lib/api/types';
	import { formatProgrammeDate, getProgrammeStatus } from '$lib/utils';

	const { data } = $props();

	let isModalOpen = $state(false);
	let selectedProgramme = $state<Programme | null>(null);
	let selectedProgrammeIndex = $state<number>(0);
	let selectedFilter = $state<string | null>(null);
	let selectedTimeFilter = $state<string | null>(null);
	let programmesSection = $state<HTMLElement | undefined>(undefined);

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
		selectedProgrammeIndex = filteredProgrammes.findIndex((p) => p === programme);
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		selectedProgramme = null;
	}

	function navigateToPreviousProgramme() {
		if (selectedProgrammeIndex > 0) {
			selectedProgrammeIndex--;
			selectedProgramme = filteredProgrammes[selectedProgrammeIndex];
		}
	}

	function navigateToNextProgramme() {
		if (selectedProgrammeIndex < filteredProgrammes.length - 1) {
			selectedProgrammeIndex++;
			selectedProgramme = filteredProgrammes[selectedProgrammeIndex];
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isModalOpen) {
			closeModal();
		} else if (isModalOpen) {
			if (event.key === 'ArrowLeft') {
				event.preventDefault();
				navigateToPreviousProgramme();
			} else if (event.key === 'ArrowRight') {
				event.preventDefault();
				navigateToNextProgramme();
			}
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
	{#if !isModalOpen}
		<section class="content">
			<article class="blurb">
				<p>
					LIBRARY: <br />
					Named after the late visionary curator and thinker, the Koyo Kouoh library, is dedicated to
					nurturing independent thought, innovative dialogue, and cross-disciplinary research. It aims
					to inspire and foster critical engagement, and to support the development of artistic and intellectual
					practices, honoring Koyo's legacy of empowering creative agency and cultural resilience.
				</p>

				<p>
					WORKSHOPS: <br />
					GICA's in-person and online workshops are designed to create space for collective learning,
					exchange, and experimentation. Led by artists and cultural practitioners, they invite the public
					to engage directly through making, discussion, and experimentation.
				</p>

				<p>
					SCREENINGS: <br />
					Our screening programme showcases film and moving image works that expand how we see, feel,
					and think. From artist films and experimental shorts to documentaries and archival footage,
					screenings offer a space for visual storytelling and critical engagement.
				</p>

				<p>
					TALKS & EVENTS: <br />
					Talks and events at GICA bring together artists, thinkers, and the public for conversation
					and critical inquiry. Through lectures, roundtables, and informal gatherings, they invite critical
					reflection on the evolving practices and ideas shaping contemporary art.
				</p>
			</article>
			<article class="programmes" bind:this={programmesSection}>
				<div class="programmes-grid">
					{#each filteredProgrammes as programme}
						<button type="button" class="programme-card" onclick={() => openModal(programme)}>
							<div
								class="programme-image"
								style="background-color: var(--color-primary-dark); {programme.cover
									? `background-image: url(${programme.cover})`
									: ''}"
							>
								<div class="programme-overlay">
									<h5 class="programme-title">{programme.title}</h5>
									<h5 class="programme-date">{formatProgrammeDate(programme.date)}</h5>
									<h5 class="programme-time">{programme.startTime}</h5>
								</div>
							</div>
						</button>
					{/each}
				</div>
			</article>
		</section>
	{/if}

	{#if isModalOpen && selectedProgramme}
		<ProgrammeModal
			programme={selectedProgramme}
			{closeModal}
			{navigateToPreviousProgramme}
			{navigateToNextProgramme}
			canNavigatePrevious={selectedProgrammeIndex > 0}
			canNavigateNext={selectedProgrammeIndex < filteredProgrammes.length - 1}
		/>
	{/if}
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

	article.blurb p + p {
		margin-top: var(--space-8);
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
		outline: 2.5px solid var(--color-secondary);
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
		section.content {
			max-width: 90vw;
		}
		.programmes-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
	}

	@media (max-width: 480px) {
		.programmes-grid {
			grid-template-columns: 1fr;
		}
	}
</style>

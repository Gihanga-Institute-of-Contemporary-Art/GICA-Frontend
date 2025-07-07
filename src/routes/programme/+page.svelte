<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Card from '$lib/components/Card.svelte';
	import type { Programme, Programmes } from '$lib/api/schemas/gicaSchema';
	import type { PageData } from './$types';
	import {
		formatProgrammeDateFromArray,
		getProgrammeStatusFromArray,
		getTimeRange
	} from '$lib/utils';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const programmes: Programmes = data.programmes;

	// Debug: Log all programmes data
	// console.log(
	// 	'All programmes:',
	// 	programmes.children.map((p) => ({ title: p.title, tags: p.tags }))
	// );

	let isModalOpen = $state(false);
	let selectedProgramme = $state<Programme | null>(null);
	let selectedProgrammeIndex = $state<number>(0);
	let selectedFilter = $state<string | null>(null);
	let selectedTimeFilter = $state<string | null>(null);
	let programmesSection = $state<HTMLElement | undefined>(undefined);

	// Function to reset modal and filters
	function resetProgrammePage() {
		if (isModalOpen) {
			closeModal();
		}
		selectedFilter = null;
		selectedTimeFilter = null;
		// Optionally scroll to top of programmes
		scrollToProgrammes();
	}

	// Get unique programme types and create submenu
	const programmeTypes = Array.from(new Set(programmes.children.flatMap((p) => p.tags)));
	const programmeBlurb = data.pages.find((p) => p.slug === 'programmes') || {
		title: '',
		slug: '',
		description: {
			value: ''
		}
	};

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

	const submenuRows = $derived(
		(() => {
			const rows = [
				{
					items: typeSubmenu,
					onSelect: (value: string) => {
						// Close modal if open
						if (isModalOpen) {
							closeModal();
						}
						// Toggle logic: if already selected, deselect it
						selectedFilter = selectedFilter === value ? null : value;
						scrollToProgrammes();
					}
				}
			];

			// Only show time submenu if there are programmes
			if (programmes.children && programmes.children.length > 0) {
				rows.push({
					items: timeSubmenu,
					onSelect: (value: string) => {
						// Close modal if open
						if (isModalOpen) {
							closeModal();
						}
						// Toggle logic: if already selected, deselect it
						selectedTimeFilter = selectedTimeFilter === value ? null : value;
						scrollToProgrammes();
					}
				});
			}

			return rows;
		})()
	);

	// Filter programmes based on both selected filters
	const filteredProgrammes = $derived(
		(() => {
			let filtered = programmes.children;

			// Filter by type (only if a type is selected)
			if (selectedFilter) {
				filtered = filtered.filter((p) => p.tags.some((t) => t.toLowerCase() === selectedFilter));
			}

			// Filter by time (only if a time filter is selected)
			if (selectedTimeFilter) {
				filtered = filtered.filter(
					(p) => getProgrammeStatusFromArray(p.dates) === selectedTimeFilter
				);
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
	<Nav {submenuRows} onProgrammeNavClick={resetProgrammePage} />
	{#if !isModalOpen}
		<section class="content">
			<article class="blurb">
				{@html programmeBlurb.description.value}
			</article>
			<article class="programmes" bind:this={programmesSection}>
				<div class="programmes-grid">
					{#each filteredProgrammes as programme}
						<Card item={programme} onClick={() => openModal(programme)} />
					{/each}
				</div>
			</article>
		</section>
	{/if}

	{#if isModalOpen && selectedProgramme}
		<Modal
			item={selectedProgramme}
			{closeModal}
			navigateToPreviousItem={navigateToPreviousProgramme}
			navigateToNextItem={navigateToNextProgramme}
			canNavigatePrevious={selectedProgrammeIndex > 0}
			canNavigateNext={selectedProgrammeIndex < filteredProgrammes.length - 1}
		/>
	{/if}
</main>

<style>
	main {
		padding-block-start: var(--nav-height);
	}
	section.content {
		max-width: var(--content-width);
		margin: 0 auto;
		padding-block-end: var(--space-2);
	}

	section.content .blurb {
		font-family: var(--font-secondary);
		font-size: var(--font-size-xl);
	}

	article.programmes {
		max-width: var(--content-width);
		margin: 0 auto;
		/* padding-bottom: var(--space-16); */
		margin-block: var(--space-16);
	}

	.programmes-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 2rem;
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

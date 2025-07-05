<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Card from '$lib/components/Card.svelte';
	import type { PageData } from './$types';
	import type { Exhibitions, Exhibition } from '$lib/api/types';
	import { getProgrammeStatusFromArray } from '$lib/utils';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();
	const exhibitions: Exhibitions = data.exhibitions;

	let isModalOpen = $state(false);
	let selectedExhibition = $state<Exhibition | null>(null);
	let selectedExhibitionIndex = $state<number>(0);
	let selectedTimeFilter = $state<string | null>(null);
	let exhibitionsSection = $state<HTMLElement | undefined>(undefined);

	const exhibitionBlurb = exhibitions.pages.find((p) => p.slug === 'exhibitions') || {
		title: '',
		slug: '',
		description: {
			value: ''
		}
	};

	const timeSubmenu = $derived([
		{ label: 'Past', value: 'past', isActive: selectedTimeFilter === 'past' },
		{ label: 'Current', value: 'current', isActive: selectedTimeFilter === 'current' },
		{ label: 'Upcoming', value: 'upcoming', isActive: selectedTimeFilter === 'upcoming' }
	]);

	const submenuRows = $derived([
		{
			items: timeSubmenu,
			onSelect: (value: string) => {
				// Close modal if open
				if (isModalOpen) {
					closeModal();
				}
				// Toggle logic: if already selected, deselect it
				selectedTimeFilter = selectedTimeFilter === value ? null : value;
				scrollToExhibitions();
			}
		}
	]);

	// Filter exhibitions based on time filter
	const filteredExhibitions = $derived(
		(() => {
			let filtered = exhibitions.children;

			// Filter by time (only if a time filter is selected)
			if (selectedTimeFilter) {
				filtered = filtered.filter(
					(e) => getProgrammeStatusFromArray(e.dates) === selectedTimeFilter
				);
			}

			return filtered;
		})()
	);

	function openModal(exhibition: Exhibition) {
		selectedExhibition = exhibition;
		selectedExhibitionIndex = filteredExhibitions.findIndex((e) => e === exhibition);
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		selectedExhibition = null;
	}

	function navigateToPreviousExhibition() {
		if (selectedExhibitionIndex > 0) {
			selectedExhibitionIndex--;
			selectedExhibition = filteredExhibitions[selectedExhibitionIndex];
		}
	}

	function navigateToNextExhibition() {
		if (selectedExhibitionIndex < filteredExhibitions.length - 1) {
			selectedExhibitionIndex++;
			selectedExhibition = filteredExhibitions[selectedExhibitionIndex];
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isModalOpen) {
			closeModal();
		} else if (isModalOpen) {
			if (event.key === 'ArrowLeft') {
				event.preventDefault();
				navigateToPreviousExhibition();
			} else if (event.key === 'ArrowRight') {
				event.preventDefault();
				navigateToNextExhibition();
			}
		}
	}

	function scrollToExhibitions() {
		// Scroll to exhibitions section when filter is selected
		if (exhibitionsSection) {
			// Calculate the offset to position exhibitions section right under the nav + submenus
			const navHeight = (document.querySelector('nav') as HTMLElement)?.offsetHeight || 0;
			const submenuElements = document.querySelectorAll('.submenu');
			const totalSubmenuHeight = Array.from(submenuElements).reduce((total, submenu) => {
				return total + ((submenu as HTMLElement)?.offsetHeight || 0);
			}, 0);
			const totalOffset = navHeight + totalSubmenuHeight + 16; // Adding 16px for some visual breathing room

			const elementPosition = exhibitionsSection.offsetTop;
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
				{@html exhibitionBlurb.description.value}
			</article>
			<article class="exhibitions" bind:this={exhibitionsSection}>
				<div class="exhibitions-grid">
					{#each filteredExhibitions as exhibition}
						<Card item={exhibition} onClick={() => openModal(exhibition)} />
					{/each}
				</div>
			</article>
		</section>
	{/if}

	{#if isModalOpen && selectedExhibition}
		<Modal
			item={selectedExhibition}
			{closeModal}
			navigateToPreviousItem={navigateToPreviousExhibition}
			navigateToNextItem={navigateToNextExhibition}
			canNavigatePrevious={selectedExhibitionIndex > 0}
			canNavigateNext={selectedExhibitionIndex < filteredExhibitions.length - 1}
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

	article.exhibitions {
		max-width: var(--content-width);
		margin: 0 auto;
		margin-block: var(--space-16);
	}

	.exhibitions-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 2rem;
	}

	/* Responsive design */
	@media (max-width: 1200px) {
		.exhibitions-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 768px) {
		section.content {
			max-width: 90vw;
		}
		.exhibitions-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
	}

	@media (max-width: 480px) {
		.exhibitions-grid {
			grid-template-columns: 1fr;
		}
	}
</style>

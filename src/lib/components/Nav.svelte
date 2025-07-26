<script lang="ts">
	import { page } from '$app/state';
	import { isFooterActive } from '$lib/stores/footerStore';
	import { translatedNavItems, initializeNavigation, type NavItem } from '$lib/stores/navStore';
	import { LanguageSwitcher } from '$lib';
	import { onMount } from 'svelte';

	interface SubmenuItem {
		label: string;
		value: string;
		isActive?: boolean;
	}

	interface SubmenuRow {
		items: SubmenuItem[];
		onSelect: (value: string) => void;
	}

	interface Props {
		submenu?: SubmenuItem[];
		submenuRows?: SubmenuRow[];
		onSubmenuSelect?: (value: string) => void;
		onProgrammeNavClick?: () => void;
	}

	let { submenu = [], submenuRows = [], onSubmenuSelect, onProgrammeNavClick }: Props = $props();

	// Initialize navigation on mount
	onMount(() => {
		initializeNavigation();
	});

	function isActive(href: string): boolean {
		if (href === '/') {
			return page.url.pathname === '/';
		}
		return page.url.pathname.startsWith(href);
	}

	function getLinkClass(href: string): string {
		const isHomePage = page.url.pathname === '/';
		const isCurrentActive = isActive(href);

		if (isHomePage) {
			return 'default';
		}

		if (isCurrentActive) {
			return 'active';
		}

		return 'inactive';
	}

	function handleSubmenuClick(item: SubmenuItem) {
		if (onSubmenuSelect) {
			onSubmenuSelect(item.value);
		}
	}

	function handleSubmenuRowClick(row: SubmenuRow, item: SubmenuItem) {
		row.onSelect(item.value);
	}

	function handleNavLinkClick() {
		isFooterActive.set(false);
	}

	function handleNavLinkClickWithReset(navItem: NavItem) {
		handleNavLinkClick();
		// If clicking on programme nav and we have a reset function and we're on the programme page
		if (
			navItem.href === '/programme' &&
			onProgrammeNavClick &&
			page.url.pathname === '/programme'
		) {
			onProgrammeNavClick();
		}
	}
</script>

<nav>
	<div class="content">
		<div class="top-nav">
			<ul>
				{#each $translatedNavItems as navItem}
					<li>
						<a
							href={navItem.href}
							class={getLinkClass(navItem.href)}
							onclick={() => handleNavLinkClickWithReset(navItem)}
						>
							<h5>{navItem.title}</h5>
						</a>
					</li>
				{/each}
			</ul>
			<section class="lang">
				<LanguageSwitcher showFlag={false} style="button" size="small" />
			</section>
		</div>
		{#if submenu.length > 0}
			{@render submenuTemplate(submenu, handleSubmenuClick)}
		{/if}
		{#if submenuRows.length > 0}
			{#each submenuRows as row}
				{@render submenuTemplate(row.items, (item) => handleSubmenuRowClick(row, item))}
			{/each}
		{/if}
	</div>
</nav>

{#snippet submenuTemplate(items: SubmenuItem[], clickHandler: (item: SubmenuItem) => void)}
	<div class="submenu">
		<ul class="submenu-list">
			{#each items as item}
				<li>
					<button
						class="submenu-item {item.isActive ? 'active' : ''}"
						onclick={() => clickHandler(item)}
					>
						<h5>{item.label}</h5>
					</button>
				</li>
			{/each}
		</ul>
	</div>
{/snippet}

<style>
	nav {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 1020;
		height: var(--nav-height);
		align-items: start;
		background: var(--color-primary);
		background: linear-gradient(0deg, rgba(255, 255, 0, 0) 0%, var(--color-primary) 55%);
		padding-inline: var(--space-8);
	}

	.top-nav {
		display: flex;
		justify-content: space-between;
		padding-block-end: var(--space-2);
		gap: var(--space-4);
	}

	.top-nav ul li a h5 {
		border: 2px solid var(--font-color-primary);
		padding-inline: var(--space-1);
		margin: 0;
		border-radius: 4px;
	}

	section.lang {
		padding-block-start: var(--space-8);
		font-family: var(--font-secondary);
	}

	section.lang {
		display: flex;
		align-items: center;
	}

	nav ul {
		list-style: none;
		padding: 0;
		margin: 0;
		padding-block-start: var(--space-8);
		display: flex;
		justify-content: start;
		gap: var(--space-8);
	}
	nav li {
		margin: 0 15px;
	}
	nav a {
		text-decoration: none;
		font-size: 16px;
		/* padding: 10px 15px; */
		text-transform: uppercase;
		font-size: var(--font-size-lg);
		letter-spacing: 0.5px;
	}

	nav a.default {
		/* Default font color when on home page */
		color: inherit;
	}

	nav a.active {
		/* Active page styling */
		color: var(--color-primary-light);
	}

	nav ul li a.active h5 {
		background-color: var(--color-secondary);
		border: none !important;
	}

	nav a.inactive {
		color: var(--font-color-primary);
	}

	/* Submenu styles */
	.submenu {
		padding-block-start: var(--space-1);
	}

	.submenu-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		justify-content: start;
		gap: var(--space-8);
	}

	.submenu-item {
		background: none;
		border: none;
		color: var(--font-color-primary);
		font-size: var(--font-size-lg);
		text-transform: uppercase;
		cursor: pointer;
		font-weight: normal;
		/* padding: var(--space-2) var(--space-4); */
		transition: all 0.2s ease;
		letter-spacing: 0.5px;
	}
	/* 
	.submenu-item:hover {
		background: rgba(0, 0, 0, 0.1);
	} */

	.submenu-item.active {
		color: var(--color-secondary);
	}

	@media (max-width: 768px) {
		nav {
			padding: 0;
		}
		nav .content {
			max-width: 90vw;
			margin: 0 auto;
		}

		.top-nav ul,
		.top-nav section.lang {
			padding-block-start: var(--space-2);
		}
		nav ul {
			flex-wrap: wrap;
			row-gap: var(--space-2);
		}

		nav li {
			margin: 0;
		}

		.submenu-list {
			/* gap: var(--space-2); */
			row-gap: var(--space-2);
		}
	}
</style>

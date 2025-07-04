<script lang="ts">
	import { page } from '$app/state';
	import { isFooterActive } from '$lib/stores/footerStore';
	import { navItems, initializeNavigation } from '$lib/stores/navStore';
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
	}

	let { submenu = [], submenuRows = [], onSubmenuSelect }: Props = $props();

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
</script>

<nav>
	<div class="top-nav">
		<ul>
			{#each $navItems as navItem}
				<li>
					<a href={navItem.href} class={getLinkClass(navItem.href)} onclick={handleNavLinkClick}>
						<h5>{navItem.title}</h5>
					</a>
				</li>
			{/each}
		</ul>
		<section class="lang">
			<button>
				<h5>EN</h5>
			</button>
			<span> / </span>
			<button><h5>RW</h5></button>
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
		z-index: 1002;
		height: var(--nav-height);
		align-items: start;
		background: var(--color-primary);
		background: linear-gradient(0deg, rgba(255, 255, 0, 0) 0%, var(--color-primary) 80%);
		padding-inline: var(--space-8);
	}

	.top-nav {
		display: flex;
		justify-content: space-between;
	}

	section.lang {
		padding-block-start: var(--space-8);
		font-family: var(--font-secondary);
	}

	section.lang button {
		background: none;
		border: none;
		font-size: var(--font-size-lg);
		color: var(--font-color-mid);
		text-transform: uppercase;
		cursor: pointer;
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
		color: var(--color-secondary);
	}

	nav a.inactive {
		/* Non-active links when not on home */
		color: var(--font-color-mid);
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
		color: var(--font-color-dark);
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
		nav ul {
			flex-wrap: wrap;
			column-gap: var(--space-8);
		}

		nav li {
			margin: 0;
		}
	}
</style>

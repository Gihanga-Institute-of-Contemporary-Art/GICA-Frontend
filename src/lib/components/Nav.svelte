<script lang="ts">
	import { page } from '$app/state';

	interface SubmenuItem {
		label: string;
		value: string;
		isActive?: boolean;
	}

	interface Props {
		submenu?: SubmenuItem[];
		onSubmenuSelect?: (value: string) => void;
	}

	let { submenu = [], onSubmenuSelect }: Props = $props();

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
</script>

<nav>
	<div class="top-nav">
		<ul>
			<li><a href="/" class={getLinkClass('/')}>Home</a></li>
			<li><a href="/exhibitions" class={getLinkClass('/exhibitions')}>Exhibitions</a></li>
			<li><a href="/programme" class={getLinkClass('/programme')}>Programme</a></li>
			<li><a href="/contributors" class={getLinkClass('/contributors')}>Contributors</a></li>
			<li><a href="/visit" class={getLinkClass('/visit')}>Visit us</a></li>
		</ul>
		<section class="lang">
			<button>RW</button>
		</section>
	</div>
	{#if submenu.length > 0}
		<div class="submenu">
			<ul class="submenu-list">
				{#each submenu as item}
					<li>
						<button
							class="submenu-item {item.isActive ? 'active' : ''}"
							onclick={() => handleSubmenuClick(item)}
						>
							{item.label}
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</nav>

<style>
	nav {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 1000;

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
	}

	section.lang button {
		margin: 0 15px;
	}

	section.lang button {
		background: none;
		border: none;
		color: var(--color-primary-dark);
		font-size: var(--font-size-xl);
		text-transform: uppercase;
		cursor: pointer;
		font-weight: bold;
	}
	nav ul {
		list-style: none;
		padding: 0;
		margin: 0;
		padding-block-start: var(--space-8);
		display: flex;
		justify-content: start;
	}
	nav li {
		margin: 0 15px;
	}
	nav a {
		text-decoration: none;
		font-size: 16px;
		padding: 10px 15px;
		text-transform: uppercase;
		font-size: var(--font-size-xl);
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
		color: var(--color-primary-dark);
	}

	/* Submenu styles */

	.submenu-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		justify-content: start;
		gap: var(--space-4);
	}

	.submenu-item {
		background: none;
		border: none;
		color: var(--color-primary-dark);
		font-size: var(--font-size-lg);
		text-transform: uppercase;
		cursor: pointer;
		font-weight: normal;
		padding: var(--space-2) var(--space-4);
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
</style>

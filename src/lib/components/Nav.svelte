<script lang="ts">
	import { page } from '$app/state';

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
</script>

<nav>
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
</nav>

<style>
	nav {
		position: relative;
		z-index: 1000;
		display: flex;
		justify-content: space-between;
		height: var(--nav-height);
		align-items: start;
		background: var(--color-primary);
		background: linear-gradient(0deg, rgba(255, 255, 0, 0) 0%, var(--color-primary) 80%);
		padding-inline: var(--space-8);
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
		color: var(--color-secondary);
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
</style>

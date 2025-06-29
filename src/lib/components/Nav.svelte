<nav>
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/exhibitions">Exhibitions</a></li>
		<li><a href="/programme">Programme</a></li>
		<li><a href="/contributors">Contributors</a></li>
		<li><a href="/visit">Visit us</a></li>
	</ul>
</nav>

<style>
	nav {
		position: relative;
		z-index: 1000;
		display: flex;
		justify-content: center;
		height: var(--nav-height);
		align-items: center;
		background: #ffff00;
		background: linear-gradient(0deg, rgba(255, 255, 0, 0) 0%, rgba(255, 255, 0, 1) 80%);
	}
	nav ul {
		width: 100%;
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		justify-content: space-between;
	}
	nav li {
		margin: 0 15px;
	}
	nav a {
		text-decoration: none;
		font-size: 16px;
		padding: 10px 15px;
		text-transform: uppercase;
		font-weight: bold;
		font-size: var(--font-size-xl);
		letter-spacing: 1px;
	}
</style>

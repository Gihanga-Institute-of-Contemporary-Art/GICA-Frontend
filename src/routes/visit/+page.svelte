<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';
</script>

<main>
	<Nav />
	<section class="content">
		<div class="left">
			<div class="hours">
				<p class="title">Opening Hours</p>
				<p>Monday to Friday: 10:00 AM - 6:00 PM</p>
				<p>Saturday and Sunday: 11:00 AM - 5:00 PM</p>
				<p>Closed on public holidays.</p>
			</div>
			<div class="location">
				<p class="title">Location</p>
				<address>KN 14 St 28, Kimihurura Sector, Kimihurura, Kigali, Rwanda</address>
			</div>
		</div>
		<div class="middle">
			<div class="images">
				<img src="https://picsum.photos/600/400?random=1" alt="Random Contact 1" />
			</div>
		</div>
		<div class="right">
			<div class="email">
				<p class="title">Email</p>
				<p>Contact: <a href="mailto:test@test.local">test@test.local</a></p>
			</div>
			<div class="social">
				<p class="title">Instagram</p>
				<ul>
					<li>
						<a href="https://www.instagram.com/gica.kigali/profilecard/" target="_blank"
							>Instagram</a
						>
					</li>
				</ul>
			</div>
		</div>
	</section>
</main>

<style>
	main {
		padding-block-start: var(--nav-height);
	}

	section.content {
		max-width: var(--content-width);
		margin: 0 auto;
		padding-block-end: var(--space-2);
		display: grid;
		grid-template-columns: 0.5fr 1fr 0.5fr;
		column-gap: var(--space-8);
		font-size: var(--font-size-md);
		font-family: var(--font-primary);
		/* font-family: var(--font-secondary); */
	}

	.left,
	.middle .images,
	.right {
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
	}

	address {
		font-style: normal;
	}

	.content p {
	}

	p.title {
		font-family: var(--font-secondary);
		text-transform: uppercase;
		margin-bottom: var(--space-2);
		font-size: var(--font-size-lg);
	}

	@media (max-width: 768px) {
		section.content {
			max-width: 90vw;
		}
	}
</style>

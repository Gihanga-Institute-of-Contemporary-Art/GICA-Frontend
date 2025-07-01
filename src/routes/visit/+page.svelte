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
			<div class="email">
				<p class="title">Email</p>
				<p>Contact: <a href="mailto:test@test.local">test@test.local</a></p>
			</div>
			<div class="social">
				<p class="title">Follow Us</p>
				<ul>
					<li><a href="https://www.facebook.com" target="_blank">Facebook</a></li>
					<li><a href="https://www.instagram.com" target="_blank">Instagram</a></li>
				</ul>
			</div>
		</div>
		<div class="middle">
			<div class="images">
				<img src="https://picsum.photos/600/400?random=1" alt="Contact Image 1" />
				<img src="https://picsum.photos/600/400?random=2" alt="Contact Image 2" />
				<img src="https://picsum.photos/600/400?random=3" alt="Contact Image 3" />
			</div>
		</div>
		<div class="right"></div>
	</section>
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
		display: grid;
		grid-template-columns: 0.5fr 1fr 0.5fr;
		font-size: var(--font-size-lg);
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

	p.title {
		text-decoration: underline;
		text-transform: uppercase;
		margin-bottom: var(--space-2);
	}

	@media (max-width: 768px) {
		section.content {
			max-width: 90vw;
		}
	}
</style>

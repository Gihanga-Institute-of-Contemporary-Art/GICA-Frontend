<!-- 
  Example: How to use the Header component in different page types
  This file demonstrates various ways to implement SEO with the Header component
-->

<script lang="ts">
	import { Header, createSEOData, createArticleSEO } from '$lib';

	// Example 1: Basic page SEO
	const basicSEO = createSEOData({
		title: 'About GICA',
		description: 'Learn about our innovative approach to technology and creative solutions',
		keywords: 'about, company, innovation, technology',
		image: '/images/about-hero.jpg',
		imageAlt: 'GICA team working on innovative solutions'
	});

	// Example 2: Article/Blog post SEO
	const articleSEO = createArticleSEO(
		'The Future of Digital Innovation',
		'Exploring how emerging technologies are reshaping industries and creating new opportunities',
		{
			author: 'GICA Team',
			image: '/images/blog/digital-innovation.jpg',
			imageAlt: 'Digital innovation and technology trends',
			tags: ['innovation', 'technology', 'digital transformation', 'future'],
			section: 'Technology',
			publishedTime: '2024-01-15T10:00:00Z'
		}
	);

	// Example 3: Product page SEO
	const productSEO = createSEOData({
		title: 'Premium Digital Solution - GICA',
		description:
			'Advanced digital solutions designed to accelerate your business growth and innovation',
		type: 'product',
		image: '/images/products/digital-solution.jpg',
		imageAlt: 'Premium digital solution interface',
		keywords: 'digital solution, business growth, innovation, premium'
	});

	// Example 4: Profile page SEO
	const profileSEO = createSEOData({
		title: 'John Doe - Innovation Lead',
		description:
			'Senior Innovation Lead at GICA, specializing in emerging technologies and digital transformation',
		type: 'profile',
		author: 'John Doe',
		image: '/images/team/john-doe.jpg',
		imageAlt: 'John Doe - Innovation Lead at GICA'
	});

	// You would typically use one of these, not all at once:
	let currentSEO = basicSEO;

	// Function to switch between different SEO examples
	function switchSEO(type: string) {
		switch (type) {
			case 'basic':
				currentSEO = basicSEO;
				break;
			case 'article':
				currentSEO = articleSEO;
				break;
			case 'product':
				currentSEO = productSEO;
				break;
			case 'profile':
				currentSEO = profileSEO;
				break;
		}
	}
</script>

<!-- Apply the current SEO configuration -->
<Header {...currentSEO} />

<main>
	<h1>SEO Header Component Examples</h1>

	<div class="examples">
		<h2>Switch SEO Type:</h2>
		<button onclick={() => switchSEO('basic')}>Basic Page SEO</button>
		<button onclick={() => switchSEO('article')}>Article SEO</button>
		<button onclick={() => switchSEO('product')}>Product SEO</button>
		<button onclick={() => switchSEO('profile')}>Profile SEO</button>
	</div>

	<div class="current-seo">
		<h2>Current SEO Data:</h2>
		<pre>{JSON.stringify(currentSEO, null, 2)}</pre>
	</div>
</main>

<style>
	main {
		padding: 2rem;
		max-width: 800px;
		margin: 0 auto;
	}

	.examples {
		margin: 2rem 0;
	}

	button {
		margin: 0.5rem;
		padding: 0.5rem 1rem;
		background: #04cf00;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		background: #03a800;
	}

	.current-seo {
		margin-top: 2rem;
	}

	pre {
		background: #f5f5f5;
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		font-size: 0.9rem;
	}
</style>

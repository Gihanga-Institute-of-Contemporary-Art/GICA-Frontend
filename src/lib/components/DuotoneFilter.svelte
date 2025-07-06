<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		id?: string;
		baseHex?: string;
		dither?: boolean;
		dithering_amount?: number;
		noise_scale?: number;
	}

	let {
		id = 'duotone-filter',
		baseHex = '#1A2400',
		dither = false,
		dithering_amount = 3,
		noise_scale = 0.8
	}: Props = $props();

	let r = $state(0);
	let g = $state(0);
	let b = $state(0);

	// Convert hex to normalized RGB
	function hexToNormalizedRGB(hex: string) {
		const match = hex
			.trim()
			.replace('#', '')
			.match(/.{1,2}/g);
		if (!match || match.length !== 3) return [r, g, b];
		const [rVal, gVal, bVal] = match.map((x) => parseInt(x, 16) / 255);
		return [rVal, gVal, bVal];
	}

	onMount(() => {
		[r, g, b] = hexToNormalizedRGB(baseHex);
	});

	// Watch for changes to baseHex and update RGB values
	$effect(() => {
		[r, g, b] = hexToNormalizedRGB(baseHex);
	});
</script>

<svg width="0" height="0" style="position: absolute;">
	<filter {id} color-interpolation-filters="sRGB">
		{#if dither}
			<feTurbulence
				type="fractalNoise"
				baseFrequency={noise_scale}
				numOctaves="3"
				seed="1"
				result="noise"
			/>
			<feDisplacementMap
				in="SourceGraphic"
				in2="noise"
				scale={dithering_amount}
				xChannelSelector="R"
				yChannelSelector="G"
			/>
		{/if}
		<feColorMatrix type="saturate" values="0" />
		<feComponentTransfer>
			<feFuncR type="table" tableValues={`${r} 1`} />
			<feFuncG type="table" tableValues={`${g} 1`} />
			<feFuncB type="table" tableValues={`${b} 1`} />
		</feComponentTransfer>
	</filter>
</svg>

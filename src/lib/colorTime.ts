type ColorStop = {
	time: number; // hour in 24h format
	color: string; // hex color string
};

const colorStops: ColorStop[] = [
	{ time: 0, color: '#1A2400' }, // Evening
	{ time: 6, color: '#5F5701' }, // Sundown / Dawn Breaking
	{ time: 12, color: '#BB9200' }, // Early Afternoon / Morning
	{ time: 18, color: '#D2C291' }, // Midday
	{ time: 24, color: '#1A2400' } // Loop back to Evening
];

function hexToRgb(hex: string): [number, number, number] {
	const parsed = parseInt(hex.replace('#', ''), 16);
	return [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
	return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

function lerpColor(
	c1: [number, number, number],
	c2: [number, number, number],
	t: number
): [number, number, number] {
	return [
		Math.round(lerp(c1[0], c2[0], t)),
		Math.round(lerp(c1[1], c2[1], t)),
		Math.round(lerp(c1[2], c2[2], t))
	];
}

function getTimeOfDayFloat(): number {
	// Get current time in Rwanda timezone (Central Africa Time - CAT, UTC+2)
	const now = new Date();
	const rwandaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Kigali' }));
	return rwandaTime.getHours() + rwandaTime.getMinutes() / 60;
}

function getRwandaTime(): Date {
	const now = new Date();
	return new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Kigali' }));
}

function getInterpolatedColor(time: number): string {
	let i = 0;
	while (i < colorStops.length - 1 && time >= colorStops[i + 1].time) {
		i++;
	}
	const start = colorStops[i];
	const end = colorStops[i + 1];
	const tNorm = (time - start.time) / (end.time - start.time);
	const blended = lerpColor(hexToRgb(start.color), hexToRgb(end.color), tNorm);
	return rgbToHex(blended);
}

function getContrastingColor(currentHex: string): string {
	const index = colorStops.findIndex(
		(stop) => stop.color.toLowerCase() === currentHex.toLowerCase()
	);
	if (index === -1) return '#000000'; // fallback
	// Select the complementary step: 2 ahead in circular list
	const oppositeIndex = (index + 2) % (colorStops.length - 1);
	return colorStops[oppositeIndex].color;
}

function updateCSSVariables(): void {
	const currentTime = getTimeOfDayFloat();
	const bgColor = getInterpolatedColor(currentTime);
	const contrastColor = getContrastingColor(bgColor);

	document.documentElement.style.setProperty('--color-primary-light', bgColor);
	document.documentElement.style.setProperty('--font-color-primary', contrastColor);
}

function updateScopedColors(element: HTMLElement): void {
	const currentTime = getTimeOfDayFloat();
	const bgColor = getInterpolatedColor(currentTime);
	const contrastColor = getContrastingColor(bgColor);

	element.style.setProperty('--color-primary-light', bgColor);
	element.style.setProperty('--font-color-primary', contrastColor);
}

function getRwandaTimeString(): string {
	const rwandaTime = getRwandaTime();
	return rwandaTime.toLocaleString('en-US', {
		timeZone: 'Africa/Kigali',
		hour12: false,
		hour: '2-digit',
		minute: '2-digit'
	});
}

function getCurrentColors(): { backgroundColor: string; textColor: string; rwandaTime: string } {
	const currentTime = getTimeOfDayFloat();
	const bgColor = getInterpolatedColor(currentTime);
	const contrastColor = getContrastingColor(bgColor);

	return {
		backgroundColor: bgColor,
		textColor: contrastColor,
		rwandaTime: getRwandaTimeString()
	};
}

export {
	updateCSSVariables,
	updateScopedColors,
	getCurrentColors,
	getRwandaTime,
	getRwandaTimeString
};

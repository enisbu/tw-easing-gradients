export const BRAND_COLORS = {
	from: '#6366F1',
	to: '#06B6D4'
};

export type BezierCurve = [number, number, number, number];

export const EASING_CURVES: Record<string, BezierCurve> = {
	ease: [0.25, 0.1, 0.25, 1],
	'ease-in': [0.42, 0, 1, 1],
	'ease-out': [0, 0, 0.58, 1],
	'ease-in-out': [0.42, 0, 0.58, 1]
};

export const DIRECTION_CSS: Record<string, string> = {
	t: 'to top', r: 'to right', b: 'to bottom', l: 'to left',
	tl: 'to top left', tr: 'to top right', bl: 'to bottom left', br: 'to bottom right'
};

export const INTERPOLATIONS = [
	{ value: '', label: 'oklab (default)', method: 'in oklab' },
	{ value: 'oklch', label: 'oklch', method: 'in oklch' },
	{ value: 'srgb', label: 'srgb', method: 'in srgb' },
	{ value: 'hsl', label: 'hsl', method: 'in hsl' },
	{ value: 'longer', label: 'longer hue', method: 'in oklch longer hue' },
	{ value: 'shorter', label: 'shorter hue', method: 'in oklch shorter hue' },
	{ value: 'increasing', label: 'increasing hue', method: 'in oklch increasing hue' },
	{ value: 'decreasing', label: 'decreasing hue', method: 'in oklch decreasing hue' }
];

export const COLOR_PRESETS = [
	{ fromHex: BRAND_COLORS.from, toHex: BRAND_COLORS.to, label: 'Indigo → Cyan' },
	{ fromHex: '#8b5cf6', toHex: '#ec4899', label: 'Violet → Pink' },
	{ fromHex: '#10b981', toHex: '#3b82f6', label: 'Emerald → Blue' },
	{ fromHex: '#f59e0b', toHex: '#ef4444', label: 'Amber → Red' },
	{ fromHex: '#000000', toHex: '#ffffff', label: 'Black → White' },
	{ fromHex: '#f43f5e', toHex: '#fb923c', label: 'Rose → Orange' }
];

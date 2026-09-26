import { getCoordinatesFromControlPoints } from 'tw-easing-gradients';
import type { BezierCurve } from './constants';
import { DIRECTION_CSS } from './constants';

export function buildGradientStops(curve: BezierCurve, method = 'in oklab'): string {
	const coords = getCoordinatesFromControlPoints(curve, 15);
	return coords.map(({ x, y }) => {
		const pos = Math.round(x * 1000) / 10;
		const pct = Math.round(y * 1000) / 10;
		if (pct === 0) return `var(--tw-gradient-from) ${pos}%`;
		if (pct === 100) return `var(--tw-gradient-to, transparent) ${pos}%`;
		return `color-mix(${method}, var(--tw-gradient-to, transparent) ${pct}%, var(--tw-gradient-from)) ${pos}%`;
	}).join(', ');
}

export function buildGradientStyle(curve: BezierCurve, direction: string, method?: string): string {
	return `background-image: linear-gradient(${DIRECTION_CSS[direction]}, ${buildGradientStops(curve, method)});`;
}

export function hexToArbitrary(hex: string): string {
	if (hex.length === 9) {
		const color = hex.slice(0, 7);
		const alpha = Math.round((parseInt(hex.slice(7, 9), 16) / 255) * 100);
		if (alpha === 100) return `[${color}]`;
		return `[${color}/${alpha}]`;
	}
	return `[${hex}]`;
}

export function curveToSvgPath(curve: BezierCurve, size: number): string {
	const points: string[] = [];
	for (let i = 0; i <= 44; i++) {
		const t = i / 44;
		const u = 1 - t;
		const bx = 3 * u * u * t * curve[0] + 3 * u * t * t * curve[2] + t * t * t;
		const by = 3 * u * u * t * curve[1] + 3 * u * t * t * curve[3] + t * t * t;
		points.push(`${bx * size},${size - by * size}`);
	}
	return `M ${points.join(' L ')}`;
}

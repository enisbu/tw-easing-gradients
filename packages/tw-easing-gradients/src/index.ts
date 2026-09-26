import plugin from 'tailwindcss/plugin';
import {
	getCoordinates,
	getCoordinatesFromControlPoints,
	parseBezierValues,
} from './easing.js';
import type { EasingFunction, PluginOptions } from './types.js';
import { DIRECTIONS, EASING_FUNCTIONS } from './types.js';

export { getCoordinates, getCoordinatesFromControlPoints, parseBezierValues } from './easing.js';
export type {
	Coordinate,
	Direction,
	EasingFunction,
	PluginOptions,
} from './types.js';

type TailwindPlugin = ReturnType<typeof plugin.withOptions<PluginOptions>>;

const EASINGS = Object.keys(EASING_FUNCTIONS) as EasingFunction[];
const DIRECTION_KEYS = Object.keys(DIRECTIONS) as (keyof typeof DIRECTIONS)[];

function generateGradientStops(
	coordinates: Array<{ x: number; y: number }>,
): string {
	return coordinates
		.map(({ x, y }) => {
			const position = Math.round(x * 1000) / 10;
			const percentage = Math.round(y * 1000) / 10;

			if (percentage === 0) {
				return `var(--tw-gradient-from) ${position}%`;
			}
			if (percentage === 100) {
				return `oklch(from var(--tw-gradient-to, oklch(from var(--tw-gradient-from) l c h / 0)) l c h / alpha) ${position}%`;
			}
			return `oklch(from color-mix(in oklab, var(--tw-gradient-to, oklch(from var(--tw-gradient-from) l c h / 0)) ${percentage}%, var(--tw-gradient-from)) l c h / alpha) ${position}%`;
		})
		.join(', ');
}

function makeGradientUtility(
	cssDirection: string,
	gradientStops: string,
): Record<string, string | Record<string, string>> {
	return {
		'background-image': `linear-gradient(${cssDirection}, var(--tw-gradient-from), var(--tw-gradient-to, transparent))`,
		'@supports (color: oklch(from red l c h))': {
			'background-image': `linear-gradient(${cssDirection}, ${gradientStops})`,
		},
	};
}

const easingGradients: TailwindPlugin = plugin.withOptions<PluginOptions>(
	(options = {}) =>
		({ addUtilities, matchUtilities }) => {
			const stops = options.stops ?? 15;
			const utilities: Record<
				string,
				Record<string, string | Record<string, string>>
			> = {};

			for (const easing of EASINGS) {
				const gradientStops = generateGradientStops(
					getCoordinates(easing, stops),
				);

				for (const dir of DIRECTION_KEYS) {
					utilities[`.bg-${easing}-to-${dir}`] =
						makeGradientUtility(DIRECTIONS[dir], gradientStops);
				}
			}

			addUtilities(utilities);

			// Custom bezier via arbitrary values: bg-ease-to-r-[0.22,1,0.36,1]
			const matchers: Record<string, (value: string) => Record<string, string | Record<string, string>> | {}> = {};

			for (const dir of DIRECTION_KEYS) {
				matchers[`bg-ease-to-${dir}`] = (value: string) => {
					const points = parseBezierValues(value);
					if (!points) return {};
					const coords = getCoordinatesFromControlPoints(points, stops);
					return makeGradientUtility(DIRECTIONS[dir], generateGradientStops(coords));
				};
			}

			matchUtilities(matchers, { values: {}, type: 'any' });
		},
);

export default easingGradients;

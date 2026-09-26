import plugin from 'tailwindcss/plugin';
import {
	getCoordinates,
	getCoordinatesFromControlPoints,
	parseBezierValues,
} from './easing.js';
import type { Coordinate, EasingFunction, PluginOptions } from './types.js';
import { DIRECTIONS, EASING_FUNCTIONS } from './types.js';

export { getCoordinates, getCoordinatesFromControlPoints, parseBezierValues } from './easing.js';
export type {
	Coordinate,
	Direction,
	EasingFunction,
	PluginOptions,
} from './types.js';

type TailwindPlugin = ReturnType<typeof plugin.withOptions<PluginOptions>>;
type GradientUtility = Record<string, string | Record<string, string>>;

const EASINGS = Object.keys(EASING_FUNCTIONS) as EasingFunction[];
const DIRECTION_KEYS = Object.keys(DIRECTIONS) as (keyof typeof DIRECTIONS)[];

const INTERPOLATION_METHODS = Object.fromEntries([
	...['srgb', 'srgb-linear', 'display-p3', 'a98-rgb', 'prophoto-rgb', 'rec2020', 'lab', 'oklab', 'xyz', 'xyz-d50', 'xyz-d65', 'hsl', 'hwb', 'lch', 'oklch'].map(
		(space) => [space, `in ${space}`],
	),
	...['shorter', 'longer', 'increasing', 'decreasing'].map(
		(hue) => [hue, `in oklch ${hue} hue`],
	),
]);

function generateGradientStops(
	coordinates: Coordinate[],
	method: string,
): string {
	return coordinates
		.map(({ x, y }) => {
			const position = Math.round(x * 1000) / 10;
			const percentage = Math.round(y * 1000) / 10;

			if (percentage === 0) {
				return `var(--tw-gradient-from) ${position}%`;
			}
			if (percentage === 100) {
				return `var(--tw-gradient-to, transparent) ${position}%`;
			}
			return `color-mix(${method}, var(--tw-gradient-to, transparent) ${percentage}%, var(--tw-gradient-from)) ${position}%`;
		})
		.join(', ');
}

function makeGradientUtility(
	cssDirection: string,
	coordinates: Coordinate[],
	modifier: string | null,
): GradientUtility {
	return {
		'background-image': `linear-gradient(${cssDirection}, var(--tw-gradient-from), var(--tw-gradient-to, transparent))`,
		'@supports (color: color-mix(in oklab, red, red))': {
			'background-image': `linear-gradient(${cssDirection}, ${generateGradientStops(coordinates, modifier ?? INTERPOLATION_METHODS.oklab)})`,
		},
	};
}

const easingGradients: TailwindPlugin = plugin.withOptions<PluginOptions>(
	(options = {}) =>
		({ matchUtilities }) => {
			const stops = options.stops ?? 15;

			matchUtilities(
				Object.fromEntries(
					EASINGS.flatMap((easing) => {
						const coordinates = getCoordinates(easing, stops);
						return DIRECTION_KEYS.map((dir) => [
							`bg-${easing}-to-${dir}`,
							(value: string, { modifier }: { modifier: string | null }): GradientUtility => {
								if (!value) {
									return makeGradientUtility(DIRECTIONS[dir], coordinates, modifier);
								}
								const points = easing === 'ease' ? parseBezierValues(value) : null;
								if (!points) return {};
								return makeGradientUtility(
									DIRECTIONS[dir],
									getCoordinatesFromControlPoints(points, stops),
									modifier,
								);
							},
						]);
					}),
				),
				{ values: { DEFAULT: '' }, modifiers: INTERPOLATION_METHODS },
			);
		},
);

export default easingGradients;

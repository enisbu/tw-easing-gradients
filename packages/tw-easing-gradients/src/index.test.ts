import { describe, it, expect, vi } from 'vitest';
import easingGradients, {
	getCoordinates,
	getCoordinatesFromControlPoints,
	parseBezierValues,
} from './index.js';
import { DIRECTIONS } from './types.js';

function runPlugin(options?: { stops?: number }) {
	const addUtilities = vi.fn();
	const matchUtilities = vi.fn();
	const p = options ? easingGradients(options) : easingGradients();

	p.handler({
		addUtilities,
		matchUtilities,
		addComponents: vi.fn(),
		matchComponents: vi.fn(),
		addBase: vi.fn(),
		addVariant: vi.fn(),
		matchVariant: vi.fn(),
		theme: vi.fn(),
		config: vi.fn(),
	} as any);

	return {
		utilities: addUtilities.mock.calls[0]?.[0] ?? {},
		addUtilities,
		matchUtilities,
	};
}

describe('easingGradients plugin', () => {
	it('exports getCoordinates function', () => {
		expect(typeof getCoordinates).toBe('function');
	});

	it('exports default plugin', () => {
		expect(easingGradients).toBeDefined();
	});

	describe('plugin generates utilities', () => {
		it('generates all 32 easing-direction combinations', () => {
			const { utilities, addUtilities } = runPlugin();

			expect(addUtilities).toHaveBeenCalledTimes(1);
			const classNames = Object.keys(utilities);

			expect(classNames).toHaveLength(32);
			expect(classNames).toContain('.bg-ease-to-r');
			expect(classNames).toContain('.bg-ease-in-to-b');
			expect(classNames).toContain('.bg-ease-out-to-tl');
			expect(classNames).toContain('.bg-ease-in-out-to-br');
		});

		it('generates fallback CSS as base property', () => {
			const { utilities } = runPlugin();
			const fallbackValue = utilities['.bg-ease-to-r']['background-image'];

			expect(fallbackValue).toContain('linear-gradient');
			expect(fallbackValue).toContain('to right');
			expect(fallbackValue).toContain('var(--tw-gradient-from)');
			expect(fallbackValue).toContain('var(--tw-gradient-to');
			expect(fallbackValue).not.toContain('oklch');
			expect(fallbackValue).not.toContain('color-mix');
		});

		it('generates CSS with color-mix in nested @supports block', () => {
			const { utilities } = runPlugin();
			const supportsBlock =
				utilities['.bg-ease-to-r'][
					'@supports (color: oklch(from red l c h))'
				];
			const cssValue = supportsBlock['background-image'];

			expect(cssValue).toContain('linear-gradient');
			expect(cssValue).toContain('to right');
			expect(cssValue).toContain('color-mix(in oklab');
			expect(cssValue).toContain('var(--tw-gradient-from)');
			expect(cssValue).toContain('var(--tw-gradient-to');
		});

		it('respects custom stops option', () => {
			const { utilities } = runPlugin({ stops: 5 });
			const supportsBlock =
				utilities['.bg-ease-to-r'][
					'@supports (color: oklch(from red l c h))'
				];
			const cssValue = supportsBlock['background-image'];

			const colorMixCount = (cssValue.match(/color-mix/g) || []).length;
			expect(colorMixCount).toBe(4);
		});

		it('uses default 15 stops when no option provided', () => {
			const { utilities } = runPlugin();
			const supportsBlock =
				utilities['.bg-ease-to-r'][
					'@supports (color: oklch(from red l c h))'
				];
			const cssValue = supportsBlock['background-image'];

			const colorMixCount = (cssValue.match(/color-mix/g) || []).length;
			expect(colorMixCount).toBe(14);
		});
	});

	describe('gradient directions', () => {
		it.each(Object.entries(DIRECTIONS))(
			'generates correct direction for %s → %s',
			(dir, expected) => {
				const { utilities } = runPlugin();
				const fallbackValue =
					utilities[`.bg-ease-to-${dir}`]['background-image'];
				expect(fallbackValue).toContain(`linear-gradient(${expected},`);
			},
		);
	});

	describe('class naming', () => {
		it('uses "bg-ease-to-" for ease (no redundant "ease")', () => {
			const classNames = Object.keys(runPlugin().utilities);

			expect(classNames).toContain('.bg-ease-to-r');
			expect(classNames).not.toContain('.bg-ease-ease-to-r');
		});

		it('uses "bg-ease-in-to-" for ease-in', () => {
			const classNames = Object.keys(runPlugin().utilities);
			expect(classNames).toContain('.bg-ease-in-to-r');
		});
	});

	describe('matchUtilities for custom bezier', () => {
		it('registers matchUtilities once with all direction handlers', () => {
			const { matchUtilities } = runPlugin();

			expect(matchUtilities).toHaveBeenCalledTimes(1);

			const matchers = matchUtilities.mock.calls[0][0];
			expect(Object.keys(matchers)).toHaveLength(8);
			expect(matchers['bg-ease-to-r']).toBeDefined();
			expect(matchers['bg-ease-to-b']).toBeDefined();
			expect(matchers['bg-ease-to-tl']).toBeDefined();
		});

		it('handler returns gradient CSS for valid bezier', () => {
			const { matchUtilities } = runPlugin();
			const matchers = matchUtilities.mock.calls[0][0];

			const result = matchers['bg-ease-to-r']('0.42,0,0.58,1');

			expect(result['background-image']).toContain('linear-gradient');
			expect(result['background-image']).toContain('to right');
			expect(result['@supports (color: oklch(from red l c h))']).toBeDefined();
		});

		it('handler returns empty for invalid bezier', () => {
			const { matchUtilities } = runPlugin();
			const matchers = matchUtilities.mock.calls[0][0];

			expect(matchers['bg-ease-to-r']('invalid')).toEqual({});
		});
	});
});

describe('exports', () => {
	it('exports all functions and types', async () => {
		const exports = await import('./index.js');

		expect(exports.getCoordinates).toBeDefined();
		expect(exports.getCoordinatesFromControlPoints).toBeDefined();
		expect(exports.parseBezierValues).toBeDefined();
		expect(exports.default).toBeDefined();
	});
});

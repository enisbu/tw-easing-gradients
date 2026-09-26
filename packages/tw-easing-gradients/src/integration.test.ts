import { describe, it, expect } from 'vitest';
import { compile } from 'tailwindcss';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { DIRECTIONS } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function compileWithPlugin(
	candidates: string[],
	pluginOptions?: string,
): Promise<string> {
	const pluginPath = resolve(__dirname, 'index.ts');
	const optionsStr = pluginOptions ? ` {\n\t\t\t\t${pluginOptions}\n\t\t\t}` : '';
	const input = `@plugin "${pluginPath}"${optionsStr};`;

	const tailwindCssPath = join(
		__dirname,
		'..',
		'node_modules',
		'tailwindcss',
		'index.css',
	);
	const tailwindCss = readFileSync(tailwindCssPath, 'utf-8');

	const compiler = await compile(`${tailwindCss}\n${input}`, {
		base: __dirname,
		loadStylesheet: async (id, base) => {
			const fullPath = resolve(base, id);
			return {
				path: fullPath,
				base: dirname(fullPath),
				content: readFileSync(fullPath, 'utf-8'),
			};
		},
		loadModule: async (id, base) => {
			const fullPath = resolve(base, id);
			const module = await import(fullPath);
			return {
				path: fullPath,
				base: dirname(fullPath),
				module: module.default || module,
			};
		},
	});

	return compiler.build(candidates);
}

describe('Tailwind CSS Integration', () => {
	it('generates CSS for linear gradient utilities', async () => {
		const css = await compileWithPlugin(['bg-ease-to-r', 'bg-ease-in-to-b']);

		expect(css).toContain('.bg-ease-to-r');
		expect(css).toContain('.bg-ease-in-to-b');
		expect(css).toContain('linear-gradient');
		expect(css).toContain('to right');
		expect(css).toContain('to bottom');
		expect(css).toContain('@supports (color: color-mix(in oklab, red, red))');
		expect(css).toContain('color-mix(in oklab');
	});

	it('generates all 32 utility classes', async () => {
		const allClasses = [
			'bg-ease-to-t', 'bg-ease-to-r', 'bg-ease-to-b', 'bg-ease-to-l',
			'bg-ease-to-tl', 'bg-ease-to-tr', 'bg-ease-to-bl', 'bg-ease-to-br',
			'bg-ease-in-to-t', 'bg-ease-in-to-r', 'bg-ease-in-to-b', 'bg-ease-in-to-l',
			'bg-ease-in-to-tl', 'bg-ease-in-to-tr', 'bg-ease-in-to-bl', 'bg-ease-in-to-br',
			'bg-ease-out-to-t', 'bg-ease-out-to-r', 'bg-ease-out-to-b', 'bg-ease-out-to-l',
			'bg-ease-out-to-tl', 'bg-ease-out-to-tr', 'bg-ease-out-to-bl', 'bg-ease-out-to-br',
			'bg-ease-in-out-to-t', 'bg-ease-in-out-to-r', 'bg-ease-in-out-to-b', 'bg-ease-in-out-to-l',
			'bg-ease-in-out-to-tl', 'bg-ease-in-out-to-tr', 'bg-ease-in-out-to-bl', 'bg-ease-in-out-to-br',
		];

		const css = await compileWithPlugin(allClasses);

		for (const className of allClasses) {
			expect(css).toContain(`.${className}`);
		}
	});

	it('uses default 15 stops producing exact gradient positions', async () => {
		const css = await compileWithPlugin(['bg-ease-to-r']);

		expect(css).toContain('@supports (color: color-mix(in oklab, red, red))');

		const expectedPositions = [
			'0%', '4.7%', '8.9%', '12.8%', '16.6%', '20.4%', '24.4%', '28.8%',
			'33.8%', '39.6%', '46.3%', '54.1%', '63.2%', '73.8%', '86%', '100%',
		];

		for (const position of expectedPositions) {
			expect(css).toContain(position);
		}

		const colorMixCount = (css.match(/color-mix/g) || []).length;
		expect(colorMixCount).toBeGreaterThanOrEqual(15);
	});

	it('generates simple 2-stop fallback as base property', async () => {
		const css = await compileWithPlugin(['bg-ease-to-r']);

		const ruleMatch = css.match(
			/\.bg-ease-to-r\s*\{\s*background-image:\s*([^;]+);/,
		);
		const fallbackValue = ruleMatch?.[1] || '';

		expect(fallbackValue).toContain('linear-gradient');
		expect(fallbackValue).toContain('var(--tw-gradient-from)');
		expect(fallbackValue).toContain('var(--tw-gradient-to');
		expect(fallbackValue).not.toContain('oklch');
		expect(fallbackValue).not.toContain('color-mix');
	});

	it('generates valid CSS syntax with balanced parentheses', async () => {
		const css = await compileWithPlugin(['bg-ease-to-r']);
		const bgEaseRule = css.match(/\.bg-ease-to-r\s*\{[^}]+\}/)?.[0] || '';

		const openParens = (bgEaseRule.match(/\(/g) || []).length;
		const closeParens = (bgEaseRule.match(/\)/g) || []).length;
		expect(openParens).toBe(closeParens);
		expect(bgEaseRule).toContain('background-image:');
	});

	it('generates correct gradient directions', async () => {
		for (const [dir, expected] of Object.entries(DIRECTIONS)) {
			const css = await compileWithPlugin([`bg-ease-to-${dir}`]);
			expect(css).toContain(`linear-gradient(${expected},`);
		}
	});

	it('works with Tailwind variants like hover and dark', async () => {
		const css = await compileWithPlugin([
			'hover:bg-ease-to-r',
			'dark:bg-ease-in-to-b',
		]);

		expect(css).toContain('hover');
		expect(css).toContain('bg-ease-to-r');
		expect(css).toContain('dark');
		expect(css).toContain('bg-ease-in-to-b');
	});

	it('plugin options work with custom stops', async () => {
		const css = await compileWithPlugin(['bg-ease-to-r'], 'stops: 5');

		expect(css).toContain('.bg-ease-to-r');
		expect(css).toContain('linear-gradient');
		expect(css).toContain('@supports (color: color-mix(in oklab, red, red))');

		const colorMixCount = (css.match(/color-mix/g) || []).length;
		expect(colorMixCount).toBeGreaterThanOrEqual(4);
		expect(colorMixCount).toBeLessThan(14);
	});

	it('CSS output is deterministic', async () => {
		const css1 = await compileWithPlugin(['bg-ease-to-r']);
		const css2 = await compileWithPlugin(['bg-ease-to-r']);

		expect(css1).toBe(css2);
	});

	describe('custom bezier arbitrary values', () => {
		it('generates CSS for custom bezier gradient', async () => {
			const css = await compileWithPlugin([
				'bg-ease-to-r-[0.22,1,0.36,1]',
			]);

			expect(css).toContain('linear-gradient');
			expect(css).toContain('to right');
			expect(css).toContain('@supports (color: color-mix(in oklab, red, red))');
			expect(css).toContain('color-mix');
		});
	});
});

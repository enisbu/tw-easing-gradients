import { defineConfig } from 'tsup';

export default defineConfig({
	footer: ({ format }) =>
		format === 'cjs'
			? { js: 'module.exports = Object.assign(module.exports.default, module.exports);' }
			: undefined,
});

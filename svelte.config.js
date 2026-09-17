import adapter from '@sveltejs/adapter-static';

// GitHub Pages serves project sites from /<repo-name>, the workflow sets BASE_PATH accordingly
const base = process.argv.includes('dev') ? '' : (process.env.BASE_PATH ?? '');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		paths: { base },
		typescript: {
			config: (tsconfig) => {
				tsconfig.include.push('../scripts/**/*.ts');
			}
		}
	},
	vitePlugin: {
		dynamicCompileOptions: ({ filename }) =>
			filename.includes('node_modules') ? undefined : { runes: true }
	}
};

export default config;

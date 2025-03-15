import adapter from '@sveltejs/adapter-node';
// import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		csrf: {
            checkOrigin: true,
		},
		alias: {
			"@/*": "/src/lib",
		},
		adapter: adapter({
			out: 'build', // Output directory (standaard: 'build')
			precompress: true, // Schakel compressie in (optioneel)
			envPrefix: 'APP_' // Aangepaste environment variable prefix (optioneel)
		  })
	},
};

export default config;

import adapter from '@sveltejs/adapter-node';
// import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    warningFilter: (warning) => {
      const ignore = [
        'a11y_media_has_caption',
        'a11y_no_redundant_roles',
        'a11y_consider_explicit_label',
        'a11y_no_noninteractive_tabindex',
        'a11y_click_events_have_key_events',
        'a11y_no_static_element_interactions',
        'a11y_no_noninteractive_element_interactions',
      ]
      return !ignore.includes(warning.code)
    },
  },
  kit: {
    csrf: {
      checkOrigin: true,
    },
    alias: {
      "@/*": "/src/lib",
    },
    adapter: adapter({
      proxy: {
        headers: {
          host: true,
          protocol: true
        }
      }
    })
  },
};

export default config;

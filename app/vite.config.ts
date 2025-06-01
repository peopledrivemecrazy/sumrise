import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		host: '0.0.0.0',
		port: 5173,
		allowedHosts: true,
		strictPort: true,
		watch: {
			usePolling: true,
		},
		hmr: {
			protocol: 'wss',
			host: 'sumrise.test',
			clientPort: 443,
			path: '/_hmr',
			timeout: 5000,
		}
	},
	preview: {
		host: '0.0.0.0',
		port: 5173,
		allowedHosts: true
	},

});

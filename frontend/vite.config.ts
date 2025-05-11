import { sveltekit } from '@sveltejs/kit/vite';
import NodeGlobalsPolyfillPlugin from 'vite-plugin-node-stdlib-browser';

import { defineConfig } from 'vite';
// import { nodePolyfills } from 'vite-plugin-node-polyfills';
// import browser from 'webextension-polyfill';


export default defineConfig({
	plugins: [
		sveltekit(),
		NodeGlobalsPolyfillPlugin()
	],
	define: {
		global: 'globalThis',
		'process.env': process.env,
		// browser: 'window.browser || {}',
	},
	resolve: {
		alias: {
			stream: 'stream-browserify',
			crypto: 'crypto-browserify',
			http: 'stream-http',
			https: 'https-browserify',
			os: 'os-browserify/browser',
			url: 'url',
			'es6-promise': 'es6-promise/auto'
		}
	},
	optimizeDeps: {
		esbuildOptions: {
			define: {
				global: 'globalThis'
			}
		},
		include: ['buffer', 'process', 'stream', 'crypto']
	},
	server: {
		proxy: {
			'/kubo': {
				target: 'https://ipfs.transport-union.dev/api/v0',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/kubo/, '') 
			},
			'/circles': {
				target: 'https://rpc.aboutcircles.com',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/circles/, '')
			}
		}
	}
});

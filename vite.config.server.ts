import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: 'src/server.ts',
			formats: ['es'],
		},
		outDir: 'dist/server',
		rollupOptions: {
			external: ['cloudflare:workers'],
		},
	},
});

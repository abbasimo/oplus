import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import svgrPlugin from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react({
			jsxImportSource: '@emotion/react'
		}),

		tsconfigPaths({
			parseNative: false
		}),

		svgrPlugin(),

		checker({
			eslint: {
				lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"'
			},
			typescript: {
				tsconfigPath: './tsconfig.json'
			},
			overlay: {
				initialIsOpen: false
			}
		})
	],
	build: {
		outDir: 'build'
	},
	server: {
		open: true,
		port: 3000
	},
	define: {
		global: 'window'
	},
	optimizeDeps: {
		include: [
			'@mui/material',
			'@mui/base',
			'@mui/styles',
			'@mui/system',
			'@mui/utils',
			'@emotion/cache',
			'@emotion/react',
			'@emotion/styled',
			'lodash'
		],
		exclude: [],
		esbuildOptions: {
			loader: {
				'.js': 'jsx'
			}
		}
	}
});

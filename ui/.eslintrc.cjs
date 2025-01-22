module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: ['react', '@typescript-eslint', 'react-hooks', 'simple-import-sort', 'prettier'],
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended'
	],
	parserOptions: {
		ecmaVersion: 2020,
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
		ecmaVersion: 'latest',
		ecmaFeatures: {
			jsx: true
		}
	},
	rules: {
		'prettier/prettier': 'warn',
		quotes: [
			1,
			'single',
			{
				allowTemplateLiterals: true,
				avoidEscape: true
			}
		],
		'padding-line-between-statements': [
			'warn',
			{ blankLine: 'always', prev: 'function', next: '*' },
			{ blankLine: 'always', prev: '*', next: 'if' },
			{ blankLine: 'always', prev: 'if', next: '*' },
			{ blankLine: 'always', prev: '*', next: 'function' }
		],
		'no-console': ['error', { allow: ['error', 'warn'] }],
		curly: 'error',
		'no-extra-boolean-cast': 'warn',
		'@typescript-eslint/ban-ts-comment': 'warn',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true, argsIgnorePattern: '^_' }],
		'@typescript-eslint/no-unsafe-argument': 'error',
		'@typescript-eslint/no-unsafe-return': 'error',
		'@typescript-eslint/prefer-optional-chain': 'error',
		'@typescript-eslint/prefer-nullish-coalescing': 'error',
		'react-hooks/rules-of-hooks': 'error',
		'react/react-in-jsx-scope': 'off',
		'react/jsx-uses-react': 'off',
		'react/jsx-no-bind': 'off',
		'react-hooks/exhaustive-deps': 'error',
		'react/display-name': 'warn',
		'react/prop-types': 'off',
		'simple-import-sort/imports': [
			'error',
			{
				groups: [
					// Side effect imports.
					['^\\u0000'],
					// Packages. `react` related packages come first.
					['^react', '^@?\\w'],
					// Parent imports. Put `..` last.
					['^\\.\\.(?!/?$)', '^\\.\\./?$'],
					// Other relative imports. Put same-folder imports and `.` last.
					['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$']
				]
			}
		],
		'simple-import-sort/exports': 'error'
	},
	overrides: [
		{
			files: ['*.test.ts', '*.test.tsx'],
			rules: {
				// Allow testing runtime errors to suppress TS errors
				'@typescript-eslint/ban-ts-comment': 'off'
			}
		}
	],
	settings: {
		react: {
			pragma: 'React',
			version: 'detect'
		}
	}
};

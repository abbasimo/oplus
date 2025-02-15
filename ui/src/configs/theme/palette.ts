import { alpha, ThemeOptions } from '@mui/material';

export const grey = {
	'50': '#FCFDFD',
	'100': '#F9FAFB',
	'200': '#F4F6F8',
	'300': '#e2e3ec',
	'400': '#C4CDD5',
	'500': '#919EAB',
	'600': '#637381',
	'700': '#454F5B',
	'800': '#1C252E',
	'900': '#141A21'
};

export const primary = {
	main: '#454CC9'
};

export const secondary = {
	main: '#188e8e'
};

export const success = {
	light: '#39D98A',
	main: '#06C270',
	dark: '#05A660',
	contrastText: '#fff'
};

export const warning = {
	light: '#FDDD48',
	main: '#FFCC00',
	dark: '#F1AE00'
};

export const info = {
	light: '#5B8DEF',
	main: '#0063F7',
	dark: '#004FC4',
	contrastText: '#fff'
};

export const error = {
	light: '#FF5C5C',
	main: '#FF3B3B',
	dark: '#E63535',
	contrastText: '#fff'
};

export const common = {
	black: '#000000',
	white: '#FFFFFF'
};

// Text
export const text = {
	light: {
		primary: '#2B2A58',
		secondary: '#545587',
		disabled: '#abb1cc'
	},
	dark: {
		primary: '#FFFFFF',
		secondary: grey[500],
		disabled: grey[600]
	}
};

// Background
export const background = {
	light: {
		paper: '#fcfcfd',
		default: '#f3f3f7',
		neutral: '#EBEBF2'
	},
	dark: {
		paper: grey[800],
		default: grey[900],
		neutral: grey[900]
	}
};

export const baseAction = {
	hover: alpha(grey[500], 0.08),
	selected: alpha(grey[500], 0.16),
	focus: alpha(grey[500], 0.24),
	disabled: alpha(grey[500], 0.8),
	disabledBackground: alpha(grey[500], 0.24),
	hoverOpacity: 0.08,
	disabledOpacity: 0.48
};

export const action = {
	light: { ...baseAction, active: grey[600] },
	dark: { ...baseAction, active: grey[500] }
};

export const basePalette: ThemeOptions['palette'] = {
	primary,
	secondary,
	info,
	success,
	warning,
	error,
	grey,
	common,
	divider: '#D2D3E1'
};

export const lightPalette: ThemeOptions['palette'] = {
	...basePalette,
	text: text.light,
	background: background.light,
	action: action.light
};

export const darkPalette: ThemeOptions['palette'] = {
	...basePalette,
	text: text.dark,
	background: background.dark,
	action: action.dark
};

export const palettes: { light: ThemeOptions['palette']; dark: ThemeOptions['palette'] } = {
	light: { mode: 'light', ...lightPalette },
	dark: { mode: 'dark', ...darkPalette }
};

declare module '@mui/material/styles' {
	interface TypeBackground {
		neutral: string;
	}
}

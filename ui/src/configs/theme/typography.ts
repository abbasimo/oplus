import { ThemeOptions } from '@mui/material';

export const defaultFontFamily = [
	'Inter var',
	'Roboto',
	'-apple-system',
	'BlinkMacSystemFont',
	'"Segoe UI"',
	'Roboto',
	'"Helvetica Neue"',
	'Arial',
	'"Noto Sans"',
	'sans-serif',
	'"Apple Color Emoji"',
	'"Segoe UI Emoji"',
	'"Segoe UI Symbol"',
	'"Noto Color Emoji"'
];

/**
 * Converts px to rem
 */
export function pxToRem(value: number) {
	return `${value / 10}rem`;
}

const typography: (lang: string) => ThemeOptions['typography'] = (lang) => {
	const fontFamily =
		lang === 'en' ? ['Poppins', ...defaultFontFamily].join(',') : ['Vazirmatn', ...defaultFontFamily].join(',');

	return {
		fontFamily,
		fontWeightLight: 300,
		fontWeightRegular: 400,
		fontWeightMedium: 500,
		fontWeightBold: 700,
		fontSize: 14,
		htmlFontSize: 10,

		headline1: {
			fontWeight: 700,
			lineHeight: pxToRem(144),
			fontSize: pxToRem(96)
		},
		headline2: {
			fontWeight: 700,
			lineHeight: pxToRem(112),
			fontSize: pxToRem(96)
		},
		headline3: {
			fontWeight: 700,
			lineHeight: pxToRem(72),
			fontSize: pxToRem(48)
		},

		title1: {
			fontWeight: 500,
			lineHeight: pxToRem(56),
			fontSize: pxToRem(32)
		},
		title2: {
			fontWeight: 500,
			lineHeight: pxToRem(28),
			fontSize: pxToRem(24)
		},
		title3: {
			fontWeight: 500,
			lineHeight: pxToRem(32),
			fontSize: pxToRem(18)
		},

		body1: {
			lineHeight: pxToRem(28),
			fontSize: pxToRem(16)
		},
		body2: {
			lineHeight: pxToRem(26),
			fontSize: pxToRem(14)
		},

		caption1: {
			lineHeight: pxToRem(14),
			fontSize: pxToRem(12)
		},
		caption2: {
			lineHeight: pxToRem(12),
			fontSize: pxToRem(10)
		},

		overline: {
			fontWeight: 700,
			lineHeight: pxToRem(14),
			fontSize: pxToRem(12),
			textTransform: 'uppercase'
		},

		button: {
			fontWeight: 400,
			lineHeight: pxToRem(28),
			fontSize: pxToRem(16),
			textTransform: 'unset'
		},

		h1: undefined,
		h2: undefined,
		h3: undefined,
		h4: undefined,
		h5: undefined,
		h6: undefined,
		subtitle1: undefined,
		subtitle2: undefined,
		caption: undefined
	};
};

declare module '@mui/material/styles' {
	interface TypographyVariants {
		headline1: React.CSSProperties;
		headline2: React.CSSProperties;
		headline3: React.CSSProperties;
		title1: React.CSSProperties;
		title2: React.CSSProperties;
		title3: React.CSSProperties;
		caption1: React.CSSProperties;
		caption2: React.CSSProperties;
	}

	// allow configuration using `createTheme()`
	interface TypographyVariantsOptions {
		headline1?: React.CSSProperties;
		headline2?: React.CSSProperties;
		headline3?: React.CSSProperties;
		title1?: React.CSSProperties;
		title2?: React.CSSProperties;
		title3?: React.CSSProperties;
		caption1?: React.CSSProperties;
		caption2?: React.CSSProperties;
	}
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
	interface TypographyPropsVariantOverrides {
		headline1: true;
		headline2: true;
		headline3: true;
		title1: true;
		title2: true;
		title3: true;
		caption1: true;
		caption2: true;

		h1: false;
		h2: false;
		h3: false;
		h4: false;
		h5: false;
		h6: false;
		subtitle1: false;
		subtitle2: false;
		caption: false;
	}
}

export default typography;

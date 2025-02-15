import { alpha, darken, lighten } from '@mui/material';

import { MuiComponents } from './types';

const MuiCssBaseline: MuiComponents['MuiCssBaseline'] = {
	styleOverrides: (theme) => ({
		mark: {
			backgroundColor: alpha(theme.palette.warning.main, 0.3),
			borderRadius: theme.shape.borderRadius / 3
		},
		'*, *::before, *::after, body, html': {
			fontFamily: theme.typography.fontFamily
		},
		html: {
			fontSize: '62.5%',
			backgroundColor: `${theme.palette.background.neutral}!important`,
			color: `${theme.palette.text.primary}!important`
		},
		body: {
			backgroundColor: theme.palette.background.neutral,
			color: theme.palette.text.primary
		},
		'table.simple tbody tr th': {
			borderColor: theme.palette.divider
		},
		'table.simple thead tr th': {
			borderColor: theme.palette.divider
		},
		'a:not([role=button]):not(.MuiButtonBase-root):not(.MuiLink-root)': {
			color: theme.palette.primary.main,
			textDecoration: 'underline',
			'&:hover': {}
		},
		'a.link, a:not([role=button])[target=_blank]': {
			background: alpha(theme.palette.primary.main, 0.2),
			color: 'inherit',
			borderBottom: `1px solid ${theme.palette.divider}`,
			textDecoration: 'none',
			'&:hover': {
				background: alpha(theme.palette.primary.main, 0.3),
				textDecoration: 'none'
			}
		},
		'[class^="border"]': {
			borderColor: theme.palette.divider
		},
		'[class*="border"]': {
			borderColor: theme.palette.divider
		},
		'[class*="divide-"] > :not([hidden]) ~ :not([hidden])': {
			borderColor: theme.palette.divider
		},
		hr: {
			borderColor: theme.palette.divider
		},

		'::-webkit-scrollbar-thumb': {
			boxShadow: `inset 0 0 0 20px ${
				theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.24)' : 'rgba(255, 255, 255, 0.24)'
			}`
		},
		'::-webkit-scrollbar-thumb:active': {
			boxShadow: `inset 0 0 0 20px ${
				theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.37)' : 'rgba(255, 255, 255, 0.37)'
			}`
		},

		/* Medium Devices, Desktops Only */
		[theme.breakpoints.up('md')]: {
			'*': {
				scrollbarWidth: 'thin',
				scrollbarColor: `${theme.palette.mode === 'dark' ? lighten(theme.palette.background.paper, 0.2) : darken(theme.palette.background.paper, 0.4)} transparent`
			},

			'::-webkit-scrollbar': {
				width: '8px',
				height: '8px',
				backgroundColor: 'rgba(0, 0, 0, 0)'
			},

			'::-webkit-scrollbar:hover': {
				width: '8px',
				height: '8px',
				backgroundColor: 'rgba(0, 0, 0, 0.06)'
			},

			'::-webkit-scrollbar-thumb': {
				border: '2px solid transparent',
				borderRadius: '20px'
			},

			'::-webkit-scrollbar-thumb:active': {
				borderRadius: '20px'
			}
		}
	})
};

export default MuiCssBaseline;

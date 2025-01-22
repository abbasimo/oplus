import React from 'react';
import { autocompleteClasses } from '@mui/material';
import { dividerClasses } from '@mui/material';
import { checkboxClasses } from '@mui/material';
import { createTheme, menuItemClasses, ThemeOptions } from '@mui/material';

/**
 * The extendThemeWithMixins function extends the theme with mixins.
 */
export function extendThemeWithMixins(themeOptions: ThemeOptions) {
	const theme = createTheme(themeOptions);

	return {
		border: (width = 1) => ({
			borderWidth: width,
			borderStyle: 'solid',
			borderColor: theme.palette.divider
		}),
		borderLeft: (width = 1) => ({
			borderLeftWidth: width,
			borderStyle: 'solid',
			borderColor: theme.palette.divider
		}),
		borderRight: (width = 1) => ({
			borderRightWidth: width,
			borderStyle: 'solid',
			borderColor: theme.palette.divider
		}),
		borderTop: (width = 1) => ({
			borderTopWidth: width,
			borderStyle: 'solid',
			borderColor: theme.palette.divider
		}),
		borderBottom: (width = 1) => ({
			borderBottomWidth: width,
			borderStyle: 'solid',
			borderColor: theme.palette.divider
		}),
		menuItem: {
			...theme.typography.body2,
			padding: theme.spacing(0.75, 1),
			borderRadius: theme.shape.borderRadius * 0.75,
			'&:not(:last-of-type)': { marginBottom: 2 },
			[`&.${menuItemClasses.selected}`]: {
				fontWeight: theme.typography.fontWeightBold,
				backgroundColor: theme.palette.action.selected,
				'&:hover': { backgroundColor: theme.palette.action.hover }
			},
			[`& .${checkboxClasses.root}`]: {
				padding: theme.spacing(0.5),
				marginLeft: theme.spacing(-0.5),
				marginRight: theme.spacing(0.5)
			},
			[`&.${autocompleteClasses.option}[aria-selected="true"]`]: {
				backgroundColor: theme.palette.action.selected,
				'&:hover': { backgroundColor: theme.palette.action.hover }
			},
			[`&+.${dividerClasses.root}`]: { margin: theme.spacing(0.5, 0) }
		}
	};
}

declare module '@mui/material' {
	export interface Mixins {
		border: (width: number) => React.CSSProperties;
		borderLeft: (width: number) => React.CSSProperties;
		borderRight: (width: number) => React.CSSProperties;
		borderTop: (width: number) => React.CSSProperties;
		borderBottom: (width: number) => React.CSSProperties;
		menuItem: React.CSSProperties;
	}
}

import { loadingButtonClasses } from '@mui/lab';
import { alpha, buttonClasses, darken, lighten } from '@mui/material';

import { pxToRem } from '../typography';

import { MuiComponents } from './types';

const MuiButton: MuiComponents['MuiButton'] = {
	defaultProps: {
		disableElevation: true,
		color: 'primary'
	},
	styleOverrides: {
		root: {
			textTransform: 'none',
			borderRadius: 12
		},

		contained: ({ ownerState, theme }) => {
			const backgroundColor =
				ownerState?.color === 'inherit' ? theme.palette.text.primary : theme.palette[ownerState.color!].main;

			const color =
				ownerState?.color === 'inherit'
					? theme.palette.getContrastText(theme.palette.text.primary)
					: theme.palette[ownerState.color!].contrastText;

			return {
				...(ownerState?.color === 'inherit' && {
					color,
					backgroundColor,
					'&:hover': {
						backgroundColor:
							theme.palette.mode === 'dark'
								? lighten(theme.palette.text.primary, theme.palette.contrastThreshold / 10)
								: darken(theme.palette.text.primary, theme.palette.contrastThreshold / 10)
					}
				}),
				[`&.${buttonClasses.disabled}`]: {
					opacity: 0.4,
					color,
					backgroundColor
				},
				[`& .${loadingButtonClasses.loadingIndicator}`]: {
					color
				}
			};
		},

		outlined: ({ ownerState, theme }) => {
			const borderColor =
				ownerState?.color === 'inherit' ? theme.palette.text.primary : theme.palette[ownerState.color!].main;
			const color =
				ownerState?.color === 'inherit' ? theme.palette.text.primary : theme.palette[ownerState.color!].main;

			return {
				borderWidth: 2,
				borderColor,
				color,
				...(ownerState?.color === 'inherit' && {
					color,
					borderColor: alpha(borderColor, 0.48),
					'&:hover': {
						borderColor
					}
				}),
				[`&.${buttonClasses.disabled}`]: {
					opacity: 0.4,
					color,
					borderColor
				},
				[`& .${loadingButtonClasses.loadingIndicator}`]: {
					color
				}
			};
		},

		text: ({ ownerState, theme }) => {
			const color =
				ownerState?.color === 'inherit' ? theme.palette.text.primary : theme.palette[ownerState.color!].main;

			return {
				color,
				...(ownerState.color === 'inherit' &&
					!ownerState.disabled && {
						'&:hover': { backgroundColor: theme.palette.action.hover }
					}),

				[`&.${buttonClasses.disabled}`]: {
					opacity: 0.4,
					color
				},
				[`& .${loadingButtonClasses.loadingIndicator}`]: {
					color
				}
			};
		},

		sizeSmall: ({ ownerState }) => ({
			fontSize: pxToRem(14),
			height: 32,
			...(ownerState.variant === 'text'
				? { paddingLeft: '8px', paddingRight: '8px' }
				: { paddingLeft: '24px', paddingRight: '24px' })
		}),
		sizeMedium: ({ ownerState }) => ({
			height: 40,
			...(ownerState.variant === 'text'
				? { paddingLeft: '8px', paddingRight: '8px' }
				: { paddingLeft: '24px', paddingRight: '24px' })
		}),
		sizeLarge: ({ ownerState }) => ({
			fontSize: pxToRem(16),
			height: 44,
			...(ownerState.variant === 'text'
				? { paddingLeft: '10px', paddingRight: '10px' }
				: { paddingLeft: '24px', paddingRight: '24px' })
		})
	}
};

export default MuiButton;

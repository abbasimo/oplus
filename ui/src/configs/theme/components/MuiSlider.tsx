import { sliderClasses } from '@mui/material/Slider';
import { alpha } from '@mui/system';

import { MuiComponents } from './types';

const SIZE = {
	rail: { small: 6, medium: 10 },
	thumb: { small: 16, medium: 20 },
	mark: { small: 4, medium: 6 }
};

const MuiSlider: MuiComponents['MuiSlider'] = {
	defaultProps: { size: 'small' },

	variants: [
		/**
		 * @state disabled
		 */
		{
			props: ({ ownerState }) => !!ownerState.disabled,
			style: ({ theme }) => ({
				[`&.${sliderClasses.disabled}`]: {
					color: alpha(theme.palette.grey[500], theme.palette.action.disabledOpacity)
				}
			})
		}
	],

	styleOverrides: {
		root: ({ theme }) => ({
			[`& .${sliderClasses.thumb}`]: {
				borderWidth: 1,
				borderStyle: 'solid',
				width: SIZE.thumb.medium,
				height: SIZE.thumb.medium,
				// boxShadow: theme.customShadows.z1,
				color: theme.palette.common.white,
				borderColor: alpha(theme.palette.grey[500], 0.08),
				'&::before': {
					opacity: 0.4,
					boxShadow: 'none',
					width: 'calc(100% - 4px)',
					height: 'calc(100% - 4px)',
					backgroundImage: `linear-gradient(180deg, ${theme.palette.grey[500]} 0%, ${alpha(theme.palette.grey[500], 0)} 100%)`,
					...(theme.palette.mode === 'dark' && { opacity: 0.8 })
				}
			}
		}),
		rail: ({ theme }) => ({
			opacity: 0.12,
			height: SIZE.rail.medium,
			backgroundColor: theme.palette.grey[500]
		}),
		track: { height: SIZE.rail.medium },
		mark: ({ theme }) => ({
			width: 1,
			height: SIZE.mark.medium,
			backgroundColor: alpha(theme.palette.grey[500], 0.48),
			'&[data-index="0"]': { display: 'none' }
		}),
		markActive: ({ theme }) => ({
			backgroundColor: alpha(theme.palette.common.white, 0.64)
		}),
		markLabel: ({ theme }) => ({
			fontSize: theme.typography.pxToRem(13),
			color: theme.palette.text.disabled
		}),
		valueLabel: ({ theme }) => ({
			borderRadius: 8,
			backgroundColor: theme.palette.grey[800],
			...(theme.palette.mode === 'dark' && { backgroundColor: theme.palette.grey[700] })
		}),
		sizeSmall: {
			[`& .${sliderClasses.thumb}`]: { width: SIZE.thumb.small, height: SIZE.thumb.small },
			[`& .${sliderClasses.rail}`]: { height: SIZE.rail.small },
			[`& .${sliderClasses.track}`]: { height: SIZE.rail.small },
			[`& .${sliderClasses.mark}`]: { height: SIZE.mark.small }
		}
	}
};

// ----------------------------------------------------------------------

export default MuiSlider;

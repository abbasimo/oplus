import { chipClasses } from '@mui/material/Chip';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

import { MuiComponents } from './types';

/**
 * Icons
 * https://icon-sets.iconify.design/solar/close-circle-bold
 */
export const ChipDeleteIcon = (props: SvgIconProps) => (
	<SvgIcon {...props}>
		<path
			fill="currentColor"
			fillRule="evenodd"
			d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10M8.97 8.97a.75.75 0 0 1 1.06 0L12 10.94l1.97-1.97a.75.75 0 0 1 1.06 1.06L13.06 12l1.97 1.97a.75.75 0 0 1-1.06 1.06L12 13.06l-1.97 1.97a.75.75 0 0 1-1.06-1.06L10.94 12l-1.97-1.97a.75.75 0 0 1 0-1.06"
			clipRule="evenodd"
		/>
	</SvgIcon>
);

const MuiChip: MuiComponents['MuiChip'] = {
	defaultProps: { deleteIcon: <ChipDeleteIcon /> },

	styleOverrides: {
		root: ({ ownerState, theme }) => {
			return {
				disabled: {
					[`&.${chipClasses.disabled}`]: {
						opacity: 1,
						[`& .${chipClasses.avatar}`]: {
							color: theme.palette.action.disabled,
							backgroundColor: theme.palette.action.disabledBackground
						},
						...(ownerState.variant === 'outlined' && {
							color: theme.palette.action.disabled,
							borderColor: theme.palette.action.disabledBackground
						}),
						...('filled' === ownerState.variant && {
							color: theme.palette.action.disabled,
							backgroundColor: theme.palette.action.disabledBackground
						})
					}
				}
			};
		},
		label: ({ theme }) => ({ fontWeight: theme.typography.fontWeightMedium }),
		icon: { color: 'currentColor' },
		deleteIcon: {
			opacity: 0.48,
			color: 'currentColor',
			'&:hover': { opacity: 1, color: 'currentColor' }
		},
		sizeMedium: ({ theme }) => ({ borderRadius: theme.shape.borderRadius * 1.25 }),
		sizeSmall: ({ theme }) => ({ borderRadius: theme.shape.borderRadius })
	}
};

export default MuiChip;

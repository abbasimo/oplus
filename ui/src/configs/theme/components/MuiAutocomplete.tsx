import { autocompleteClasses } from '@mui/material/Autocomplete';
import SvgIcon, { svgIconClasses, SvgIconProps } from '@mui/material/SvgIcon';
import { alpha } from '@mui/system';

import { MuiComponents } from './types';

/**
 * Icons
 * https://icon-sets.iconify.design/eva/arrow-ios-downward-fill/
 */
const ArrowDownIcon = (props: SvgIconProps) => (
	<SvgIcon {...props}>
		<path
			fill="currentColor"
			d="M12 16a1 1 0 0 1-.64-.23l-6-5a1 1 0 1 1 1.28-1.54L12 13.71l5.36-4.32a1 1 0 0 1 1.41.15a1 1 0 0 1-.14 1.46l-6 4.83A1 1 0 0 1 12 16"
		/>
	</SvgIcon>
);

const MuiAutocomplete: MuiComponents['MuiAutocomplete'] = {
	defaultProps: { popupIcon: <ArrowDownIcon /> },

	styleOverrides: {
		root: ({ theme }) => ({
			[`& span.${autocompleteClasses.tag}`]: {
				...theme.typography.body2,
				fontWeight: 600,
				height: 24,
				minWidth: 24,
				lineHeight: '24px',
				textAlign: 'center',
				padding: theme.spacing(0, 0.75),
				color: theme.palette.text.secondary,
				borderRadius: theme.shape.borderRadius,
				backgroundColor: alpha(theme.palette.grey['500'], 0.16)
			}
		}),
		paper: ({ theme }) => ({
			padding: theme.spacing(0.5),
			borderRadius: `${theme.shape.borderRadius * 1.25}px`
		}),
		listbox: ({ theme }) => ({
			padding: 0,
			[`& .${autocompleteClasses.option}`]: { ...theme.mixins.menuItem }
		}),
		endAdornment: { [`& .${svgIconClasses.root}`]: { width: 18, height: 18 } }
	}
};

export default MuiAutocomplete;

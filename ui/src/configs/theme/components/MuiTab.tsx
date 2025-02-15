import { tabClasses } from '@mui/material';

import { MuiComponents } from './types';

const MuiTab: MuiComponents['MuiTab'] = {
	defaultProps: { disableRipple: true, iconPosition: 'start' },

	styleOverrides: {
		root: ({ theme }) => ({
			opacity: 1,
			minWidth: 92,
			minHeight: 54,
			padding: theme.spacing(1, 0),
			color: theme.palette.text.secondary,
			fontWeight: theme.typography.fontWeightRegular,
			lineHeight: theme.typography.body2.lineHeight,
			[`&.${tabClasses.selected}`]: {
				color: theme.palette.primary.main,
				fontWeight: theme.typography.fontWeightBold
			}
		})
	}
};

export default MuiTab;

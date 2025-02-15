import { MuiComponents } from './types';

const MuiTabs: MuiComponents['MuiTabs'] = {
	defaultProps: {
		variant: 'scrollable',
		allowScrollButtonsMobile: true
	},

	styleOverrides: {
		flexContainer: ({ ownerState, theme }) => ({
			...(ownerState.variant !== 'fullWidth' && {
				gap: '24px',
				[theme.breakpoints.up('sm')]: {
					gap: '40px'
				}
			})
		}),
		indicator: {
			height: 4,
			borderTopRightRadius: 100,
			borderTopLeftRadius: 100
		}
	}
};

export default MuiTabs;

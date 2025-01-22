import { MuiComponents } from './types';

const MuiTabs: MuiComponents['MuiTabs'] = {
	defaultProps: {
		textColor: 'inherit',
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
		indicator: { backgroundColor: 'currentColor' }
	}
};

export default MuiTabs;

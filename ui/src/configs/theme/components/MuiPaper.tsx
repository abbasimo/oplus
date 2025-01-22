import { MuiComponents } from './types';

const MuiPaper: MuiComponents['MuiPaper'] = {
	defaultProps: { elevation: 0 },

	styleOverrides: {
		root: { backgroundImage: 'none' },
		outlined: ({ theme }) => ({
			borderColor: theme.palette.divider
		})
	}
};

export default MuiPaper;

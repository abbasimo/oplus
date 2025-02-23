import { alpha } from '@mui/system';

import { MuiComponents } from './types';

const MuiBackdrop: MuiComponents['MuiBackdrop'] = {
	styleOverrides: {
		root: ({ theme }) => ({
			backgroundColor: alpha(theme.palette.grey['800'], 0.48)
		}),
		invisible: { background: 'transparent' }
	}
};

export default MuiBackdrop;

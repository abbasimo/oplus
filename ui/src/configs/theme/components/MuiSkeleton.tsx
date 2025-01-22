import { alpha } from '@mui/system';

import { MuiComponents } from './types';

const MuiSkeleton: MuiComponents['MuiSkeleton'] = {
	defaultProps: { animation: 'wave', variant: 'rounded' },

	styleOverrides: {
		root: ({ theme }) => ({
			backgroundColor: alpha(theme.palette.grey[700], 0.12)
		}),
		rounded: ({ theme }) => ({ borderRadius: theme.shape.borderRadius * 2 })
	}
};

export default MuiSkeleton;

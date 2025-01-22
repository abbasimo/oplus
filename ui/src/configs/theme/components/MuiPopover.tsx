import { listClasses } from '@mui/material/List';

import { MuiComponents } from './types';

const MuiPopover: MuiComponents['MuiPopover'] = {
	styleOverrides: {
		paper: ({ theme }) => ({
			padding: theme.spacing(0.5),
			borderRadius: `${theme.shape.borderRadius * 1.25}px`,
			[`& .${listClasses.root}`]: { paddingTop: 0, paddingBottom: 0 }
		})
	}
};

export default MuiPopover;

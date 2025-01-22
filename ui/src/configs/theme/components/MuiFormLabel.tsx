import { inputLabelClasses } from '@mui/material';

import { MuiComponents } from './types';

const MuiFormLabel: MuiComponents['MuiFormLabel'] = {
	styleOverrides: {
		root: ({ theme }) => ({
			...theme.typography.body2,
			[`&.${inputLabelClasses.shrink}`]: {
				...theme.typography.body1,
				fontWeight: 600
			}
		})
	}
};

export default MuiFormLabel;

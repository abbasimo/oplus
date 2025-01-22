import { inputBaseClasses } from '@mui/material';

import { MuiComponents } from './types';

const MuiInputBase: MuiComponents['MuiInputBase'] = {
	styleOverrides: {
		root: ({ theme }) => ({
			[`&.${inputBaseClasses.disabled}`]: {
				'& svg': { color: theme.palette.text.disabled }
			}
		}),
		input: ({ theme }) => ({
			'&::placeholder': {
				opacity: 1,
				color: theme.palette.text.disabled
			}
		})
	}
};

export default MuiInputBase;

import { outlinedInputClasses } from '@mui/material';

import { MuiComponents } from './types';

const MuiOutlinedInput: MuiComponents['MuiOutlinedInput'] = {
	styleOverrides: {
		root: ({ theme }) => ({
			[`&.${outlinedInputClasses.error}`]: {
				[`& .${outlinedInputClasses.notchedOutline}`]: {
					borderColor: theme.palette.error.main
				}
			},
			[`&.${outlinedInputClasses.disabled}`]: {
				[`& .${outlinedInputClasses.notchedOutline}`]: {
					borderColor: theme.palette.action.disabledBackground
				}
			}
		}),
		notchedOutline: ({ theme }) => ({
			transition: theme.transitions.create(['border-color'], {
				duration: theme.transitions.duration.shortest
			})
		})
	}
};

export default MuiOutlinedInput;

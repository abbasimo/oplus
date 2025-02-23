import { MuiComponents } from './types';

const MuiFormControlLabel: MuiComponents['MuiFormControlLabel'] = {
	styleOverrides: { label: ({ theme }) => ({ ...theme.typography.body2 }) }
};

export default MuiFormControlLabel;

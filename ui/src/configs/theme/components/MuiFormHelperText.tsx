import { MuiComponents } from './types';

const MuiFormHelperText: MuiComponents['MuiFormHelperText'] = {
	defaultProps: { component: 'div' },

	styleOverrides: { root: ({ theme }) => ({ marginTop: theme.spacing(1), typography: 'body2' }) }
};

export default MuiFormHelperText;

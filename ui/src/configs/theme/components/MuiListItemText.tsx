import { MuiComponents } from './types';

const MuiListItemText: MuiComponents['MuiListItemText'] = {
	defaultProps: { primaryTypographyProps: { typography: 'body2', fontWeight: 600 } },

	styleOverrides: { root: { margin: 0 }, multiline: { margin: 0 } }
};

export default MuiListItemText;

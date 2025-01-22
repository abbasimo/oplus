import { MuiComponents } from './types';

const MuiMenuItem: MuiComponents['MuiMenuItem'] = {
	styleOverrides: { root: ({ theme }) => ({ ...theme.mixins.menuItem }) }
};

export default MuiMenuItem;

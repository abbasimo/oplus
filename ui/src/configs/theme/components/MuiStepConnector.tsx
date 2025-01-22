import { MuiComponents } from './types';

const MuiStepConnector: MuiComponents['MuiStepConnector'] = {
	styleOverrides: { line: ({ theme }) => ({ borderColor: theme.palette.divider }) }
};

export default MuiStepConnector;

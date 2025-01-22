import { MuiComponents } from './types';

const MuiTypography: MuiComponents['MuiTypography'] = {
	styleOverrides: {
		paragraph: ({ theme }) => ({ marginBottom: theme.spacing(2) }),
		gutterBottom: ({ theme }) => ({ marginBottom: theme.spacing(1) })
	},
	defaultProps: {
		variantMapping: {
			headline1: 'h1',
			headline2: 'h2',
			headline3: 'h3',
			title1: 'h4',
			title2: 'h5',
			title3: 'h6'
		}
	}
};

export default MuiTypography;

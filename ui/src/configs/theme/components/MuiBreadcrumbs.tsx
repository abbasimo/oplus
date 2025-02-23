import { MuiComponents } from './types';

const MuiBreadcrumbs: MuiComponents['MuiBreadcrumbs'] = {
	styleOverrides: {
		ol: ({ theme }) => ({ rowGap: theme.spacing(0.5), columnGap: theme.spacing(1) }),

		li: ({ theme }) => ({ display: 'inline-flex', '& > *': { ...theme.typography.body2 } }),
		separator: { margin: 0 }
	}
};

export default MuiBreadcrumbs;

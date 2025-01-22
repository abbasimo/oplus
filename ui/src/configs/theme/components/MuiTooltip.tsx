import { tooltipClasses } from '@mui/material/Tooltip';

import { MuiComponents } from './types';

const MuiTooltip: MuiComponents['MuiTooltip'] = {
	styleOverrides: {
		tooltip: ({ theme }) => ({
			backgroundColor: theme.palette.grey[800],
			...(theme.palette.mode === 'dark' && {
				backgroundColor: theme.palette.grey[700]
			})
		}),
		arrow: ({ theme }) => ({
			color: theme.palette.grey[800],
			...(theme.palette.mode === 'dark' && {
				color: theme.palette.grey[700]
			})
		}),
		popper: {
			[`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]: {
				marginTop: 12
			},
			[`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]: {
				marginBottom: 12
			},
			[`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]: {
				marginLeft: 12
			},
			[`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]: {
				marginRight: 12
			}
		}
	}
};

export default MuiTooltip;

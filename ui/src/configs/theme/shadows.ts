import { Shadows } from '@mui/material';

export function shadows(): Shadows {
	return [
		'none',
		'0px -1px 4px 0px rgba(0,0,0,0.04)',
		'0px 1px 4px 0px rgba(0,0,0,0.04)',
		'0px 1px 8px 0px rgba(0,0,0,0.08)',
		'0px 1px 8px 0px rgba(0,0,0,0.12)',
		'0px 8px 12px 0px rgba(0,0,0,0.12)',
		...new Array<string>(19).fill('0px 8px 8px 0px rgba(0,0,0,0.16)')
	] as Shadows;
}

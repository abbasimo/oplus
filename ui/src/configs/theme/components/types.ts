import { Components, Theme } from '@mui/material';

export type MuiComponents = Components<Omit<Theme, 'components'>>;

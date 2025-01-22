import { createTheme, PaletteMode, ThemeOptions } from '@mui/material';

import components from './components';
import { extendThemeWithMixins } from './mixins';
import { palettes } from './palette';
import { shadows } from './shadows';
import typography from './typography';

/**
 * Generates the MUI theme object.
 */
export default function generateMuiTheme(colorScheme: PaletteMode, lang: string, direction: 'ltr' | 'rtl') {
	const theme: ThemeOptions = {
		direction,
		shape: { borderRadius: 8 },
		typography: typography(lang),
		components: components,
		shadows: shadows(),
		palette: palettes[colorScheme]
	};

	return createTheme({
		...theme,
		mixins: extendThemeWithMixins(theme)
	});
}

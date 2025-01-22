/* eslint-disable react/jsx-no-constructed-context-values */
import React from 'react';
import generateMuiTheme from '@configs/theme/generateMuiTheme';
import createCache, { Options } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { StyledEngineProvider, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import useEnhancedEffect from '@mui/material/utils/useEnhancedEffect';
import { SecureLocalStorage } from '@remate/core';
import { useAppSelector } from '@store/hooks';
import { selectCurrentLanguageDirection, selectCurrentLanguageId } from '@store/slices/i18nSlice';
import rtlPlugin from 'stylis-plugin-rtl';

type ColorModeContextType = {
	mode: string;
	setMode: () => void;
};

type ColorModesType = 'light' | 'dark';

const emotionCacheOptions = {
	rtl: {
		key: 'muirtl',
		stylisPlugins: [rtlPlugin],
		insertionPoint: document.getElementById('emotion-insertion-point')
	},
	ltr: {
		key: 'muiltr',
		stylisPlugins: [],
		insertionPoint: document.getElementById('emotion-insertion-point')
	}
};

export const ColorModeContext = React.createContext<ColorModeContextType>({} as ColorModeContextType);

export const useColorMode = () => React.useContext(ColorModeContext);

const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const colorModeFromLocalStorage = SecureLocalStorage.getItem<ColorModesType>('color_mode');
	// const isSystemPreferenceDark = window?.matchMedia('(prefers-color-scheme: dark)').matches;

	// const systemPreference = isSystemPreferenceDark ? 'dark' : 'light';
	const systemPreference = 'light';
	const [mode, setMode] = React.useState<ColorModesType>(colorModeFromLocalStorage ?? systemPreference);

	const langDirection = useAppSelector(selectCurrentLanguageDirection);
	const currentLanguageId = useAppSelector(selectCurrentLanguageId);

	useEnhancedEffect(() => {
		document.body.dir = langDirection;
	}, [langDirection]);

	React.useEffect(() => {
		SecureLocalStorage.setItem('color_mode', mode);

		document.body.classList.add(mode === 'light' ? 'light' : 'dark');
		document.body.classList.remove(mode === 'light' ? 'dark' : 'light');
	}, [mode]);

	const setColorMode = () => {
		if (mode === 'light') {
			setMode('dark');
		} else {
			setMode('light');
		}
	};

	return (
		<StyledEngineProvider injectFirst>
			<CacheProvider value={createCache(emotionCacheOptions[langDirection] as Options)}>
				<ColorModeContext.Provider
					value={{
						setMode: setColorMode,
						mode
					}}
				>
					<MuiThemeProvider theme={generateMuiTheme(mode, currentLanguageId, langDirection)}>
						{children}
					</MuiThemeProvider>
				</ColorModeContext.Provider>
			</CacheProvider>
		</StyledEngineProvider>
	);
};

export default React.memo(ThemeProvider);

import React from 'react';
import { PiMoon, PiSun } from 'react-icons/pi';
import { useColorMode } from '@contexts/ThemeProvider';
import { IconButton } from '@mui/material';

function ColorModeToggle() {
	const { mode, setMode } = useColorMode();

	return (
		<IconButton
			onClick={() => {
				setMode();
			}}
			color="inherit"
		>
			{mode === 'dark' ? <PiSun /> : <PiMoon />}
		</IconButton>
	);
}

export default React.memo(ColorModeToggle);

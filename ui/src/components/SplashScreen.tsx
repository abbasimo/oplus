import { memo } from 'react';
import Box from '@mui/material/Box';

/**
 * The SplashScreen component is responsible for rendering a splash screen with a logo and a loading spinner.
 * It uses various MUI components to render the logo and spinner.
 * The component is memoized to prevent unnecessary re-renders.
 */
function SplashScreen() {
	return (
		<div id="splash-screen">
			<div className="logo">
				<img
					width="132"
					src="assets/images/logo/logo.png"
					alt="logo"
				/>
			</div>
			<Box
				id="spinner"
				sx={{
					'& > div': {
						backgroundColor: 'secondary.main'
					}
				}}
			>
				<div className="bounce1" />
				<div className="bounce2" />
				<div className="bounce3" />
			</Box>
		</div>
	);
}

export default memo(SplashScreen);

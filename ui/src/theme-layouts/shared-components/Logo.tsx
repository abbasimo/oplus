import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({
	'& > .logo-icon': {
		transition: theme.transitions.create(['width', 'height'], {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		})
	},
	'& > .badge': {
		transition: theme.transitions.create('opacity', {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		})
	}
}));

/**
 * The logo component.
 */
function Logo() {
	const { t } = useTranslation();

	return (
		<Root className="flex items-center flex-nowrap">
			<img
				className="logo-icon h-40 w-40"
				src="assets/images/logo/logo.png"
				alt="logo"
			/>
			<Typography
				className="whitespace-nowrap"
				variant="title2"
				marginLeft={2}
			>
				{t('APP_TITLE')}
			</Typography>
		</Root>
	);
}

export default Logo;

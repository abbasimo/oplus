import { useState } from 'react';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { changeLanguage, LanguageType, selectCurrentLanguage, selectLanguages } from '@store/slices/i18nSlice';

/**
 * The language switcher.
 */
function LanguageSwitcher() {
	const currentLanguage = useAppSelector(selectCurrentLanguage);
	const languages = useAppSelector(selectLanguages);
	const [menu, setMenu] = useState<null | HTMLElement>(null);
	const dispatch = useAppDispatch();

	const langMenuClick = (event: React.MouseEvent<HTMLElement>) => {
		setMenu(event.currentTarget);
	};

	const langMenuClose = () => {
		setMenu(null);
	};

	function handleLanguageChange(lng: LanguageType) {
		dispatch(changeLanguage(lng.id));

		langMenuClose();
	}

	return (
		<>
			<Button
				className="h-40 w-72"
				onClick={langMenuClick}
				color="inherit"
			>
				<img
					className="mx-4 min-w-20"
					src={`assets/images/flags/${currentLanguage.flag}.svg`}
					alt={currentLanguage.title}
				/>

				<Typography
					className="uppercase"
					sx={{
						fontFamily: 'Poppins',
						marginLeft: 0.5
					}}
				>
					{currentLanguage.id}
				</Typography>
			</Button>

			<Popover
				open={Boolean(menu)}
				anchorEl={menu}
				onClose={langMenuClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
			>
				{languages.map((lng) => (
					<MenuItem
						key={lng.id}
						onClick={() => handleLanguageChange(lng)}
					>
						<ListItemIcon>
							<img
								className="min-w-20"
								src={`assets/images/flags/${lng.flag}.svg`}
								alt={lng.title}
							/>
						</ListItemIcon>
						<ListItemText primary={lng.title} />
					</MenuItem>
				))}
			</Popover>
		</>
	);
}

export default LanguageSwitcher;

import { memo } from 'react';
import NavbarToggleButton from '@layouts/shared-components/navbar/NavbarToggleButton';
import AppBar from '@mui/material/AppBar';
import Hidden from '@mui/material/Hidden';
import Toolbar from '@mui/material/Toolbar';
import { useAppSelector } from '@store/hooks';
import { selectNavbar } from '@store/slices/navbarSlice';
import clsx from 'clsx';

import AdjustFontSize from '../../shared-components/AdjustFontSize';
import BreadCrumbs from '../../shared-components/BreadCrumbs';
import FullScreenToggle from '../../shared-components/FullScreenToggle';
import NavigationSearch from '../../shared-components/NavigationSearch';
import UserMenu from '../../shared-components/UserMenu';
import { Layout1ConfigType } from '../Layout1Config';

type ToolbarLayout1Props = {
	className?: string;
	config: Layout1ConfigType;
};

/**
 * The toolbar layout 1.
 */
function ToolbarLayout1(props: ToolbarLayout1Props) {
	const { className, config } = props;
	const navbar = useAppSelector(selectNavbar);

	return (
		<AppBar
			id="remate-toolbar"
			className={clsx('relative z-20 flex border-b-1', className)}
			color="inherit"
			sx={{
				backgroundColor: (theme) =>
					theme.palette.mode === 'light' ? theme.palette.background.paper : theme.palette.background.default,
				borderColor: 'divider'
			}}
			position="static"
			elevation={0}
		>
			<Toolbar className="min-h-48 p-0 md:min-h-64 justify-between">
				<div className="flex items-center px-16 gap-8">
					{config?.navbar?.display && config.navbar.position === 'left' && (
						<>
							<Hidden lgDown>
								{(config.navbar.style === 'style-3' || config.navbar.style === 'style-3-dense') && (
									<NavbarToggleButton className="mx-0 h-40 w-40 p-0" />
								)}

								{config.navbar.style === 'style-1' && !navbar.open && (
									<NavbarToggleButton className="mx-0 h-40 w-40 p-0" />
								)}
							</Hidden>

							<Hidden lgUp>
								<NavbarToggleButton className="mx-0 h-40 w-40 p-0 sm:mx-8" />
							</Hidden>
						</>
					)}

					{config?.toolbar?.displayBreadCrumbs && <BreadCrumbs />}
				</div>

				<div className="flex h-full items-center overflow-x-auto px-8">
					{/* <LanguageSwitcher /> */}
					<AdjustFontSize />
					{/* <ColorModeToggle /> */}
					<FullScreenToggle />
					<NavigationSearch />
					<UserMenu />
				</div>

				{config?.navbar?.display && config.navbar.position === 'right' && (
					<>
						<Hidden lgDown>{!navbar.open && <NavbarToggleButton className="mx-0 h-40 w-40 p-0" />}</Hidden>

						<Hidden lgUp>
							<NavbarToggleButton className="mx-0 h-40 w-40 p-0 sm:mx-8" />
						</Hidden>
					</>
				)}
			</Toolbar>
		</AppBar>
	);
}

export default memo(ToolbarLayout1);

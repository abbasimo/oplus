import { memo } from 'react';
import BreadCrumbs from '@layouts/shared-components/BreadCrumbs';
import NavbarToggleButton from '@layouts/shared-components/navbar/NavbarToggleButton';
import AppBar from '@mui/material/AppBar';
import Hidden from '@mui/material/Hidden';
import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';

import AdjustFontSize from '../../shared-components/AdjustFontSize';
import ColorModeToggle from '../../shared-components/ColorModeToggle';
import FullScreenToggle from '../../shared-components/FullScreenToggle';
import LanguageSwitcher from '../../shared-components/LanguageSwitcher';
import NavigationSearch from '../../shared-components/NavigationSearch';
import UserMenu from '../../shared-components/UserMenu';
import { Layout3ConfigType } from '../Layout3Config';

type ToolbarLayout3Props = {
	className?: string;
	config: Layout3ConfigType;
};

/**
 * The toolbar layout 3.
 */
function ToolbarLayout3(props: ToolbarLayout3Props) {
	const { className = '', config } = props;

	return (
		<AppBar
			id="remate-toolbar"
			className={clsx('relative z-20 flex border-b-1', className)}
			color="inherit"
			sx={{ backgroundColor: 'background.paper', borderColor: 'divider' }}
			elevation={0}
		>
			<Toolbar className="container min-h-48 p-0 md:min-h-64 lg:px-24">
				{config?.navbar?.display && (
					<Hidden lgUp>
						<NavbarToggleButton className="mx-0 h-40 w-40 p-0 sm:mx-8" />
					</Hidden>
				)}

				<div className="flex flex-1">{config?.toolbar?.displayBreadCrumbs && <BreadCrumbs />}</div>

				<div className="flex h-full items-center overflow-x-auto px-8 md:px-0">
					<Hidden smUp>
						<NavigationSearch />
					</Hidden>
					<LanguageSwitcher />
					<AdjustFontSize />
					<ColorModeToggle />
					<FullScreenToggle />
					<NavigationSearch />
					<UserMenu />
				</div>
			</Toolbar>
		</AppBar>
	);
}

export default memo(ToolbarLayout3);

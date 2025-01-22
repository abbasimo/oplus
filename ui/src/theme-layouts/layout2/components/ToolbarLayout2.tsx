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
import { Layout2ConfigType } from '../Layout2Config';

type ToolbarLayout2Props = {
	className?: string;
	config: Layout2ConfigType;
};

/**
 * The toolbar layout 2.
 */
function ToolbarLayout2(props: ToolbarLayout2Props) {
	const { className = '', config } = props;

	return (
		<AppBar
			id="remate-toolbar"
			className={clsx('relative z-20 flex shadow-md', className)}
			color="default"
			style={{ backgroundColor: 'background.paper' }}
		>
			<Toolbar className="container min-h-48 p-0 md:min-h-64 lg:px-24">
				{config?.navbar?.display && (
					<Hidden lgUp>
						<NavbarToggleButton className="mx-0 h-40 w-40 p-0 sm:mx-8" />
					</Hidden>
				)}

				<div className="flex flex-1">{config?.toolbar?.displayBreadCrumbs && <BreadCrumbs />}</div>

				<div className="flex h-full items-center overflow-x-auto px-8">
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

export default memo(ToolbarLayout2);
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import NavbarToggleFabLayout1 from '@layouts/layout1/components/NavbarToggleFabLayout1';
import { useMediaQuery } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { navbarCloseMobile, selectNavbar } from '@store/slices/navbarSlice';

import { Layout1ConfigType } from '../Layout1Config';

import NavbarStyle1 from './navbar/style-1/NavbarStyle1';
import NavbarStyle2 from './navbar/style-2/NavbarStyle2';
import NavbarStyle3 from './navbar/style-3/NavbarStyle3';

interface NavbarWrapperLayout1Props {
	config: Layout1ConfigType;
}

/**
 * The navbar wrapper layout 1.
 */
function NavbarWrapperLayout1({ config }: NavbarWrapperLayout1Props) {
	const navbar = useAppSelector(selectNavbar);
	const location = useLocation();
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
	const { pathname } = location;
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (isMobile) {
			dispatch(navbarCloseMobile());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname, isMobile]);

	return (
		<>
			{config?.navbar?.style === 'style-1' && <NavbarStyle1 config={config} />}
			{config?.navbar?.style === 'style-2' && <NavbarStyle2 config={config} />}
			{config?.navbar?.style === 'style-3' && <NavbarStyle3 config={config} />}
			{config?.navbar?.style === 'style-3-dense' && (
				<NavbarStyle3
					dense
					config={config}
				/>
			)}

			{config?.navbar?.display && !config?.toolbar?.display && !navbar.open && (
				<NavbarToggleFabLayout1 config={config} />
			)}
		</>
	);
}

export default NavbarWrapperLayout1;

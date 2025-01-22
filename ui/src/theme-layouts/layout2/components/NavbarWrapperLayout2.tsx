import { memo, useEffect } from 'react';
import { useLocation } from 'react-router';
import NavbarToggleFabLayout2 from '@layouts/layout2/components/NavbarToggleFabLayout2';
import { useMediaQuery } from '@mui/material';
import Hidden from '@mui/material/Hidden';
import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { navbarCloseMobile, navbarSlice, selectNavbar } from '@store/slices/navbarSlice';
import withSlices from '@store/withSlices';

import { Layout2ConfigType } from '../Layout2Config';

import NavbarLayout2 from './NavbarLayout2';
import NavbarMobileLayout2 from './NavbarMobileLayout2';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
	'& > .MuiDrawer-paper': {
		height: '100%',
		flexDirection: 'column',
		flex: '1 1 auto',
		width: 280,
		minWidth: 280,
		transition: theme.transitions.create(['width', 'min-width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.shorter
		})
	}
}));

type NavbarWrapperLayout2Props = {
	className?: string;
	config: Layout2ConfigType;
};

/**
 * The navbar wrapper layout 2.
 */
function NavbarWrapperLayout2(props: NavbarWrapperLayout2Props) {
	const { className = '', config } = props;
	const dispatch = useAppDispatch();
	const navbar = useAppSelector(selectNavbar);
	const location = useLocation();
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));
	const { pathname } = location;

	useEffect(() => {
		if (isMobile) {
			dispatch(navbarCloseMobile());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname, isMobile]);

	return (
		<>
			<Hidden lgDown>
				<NavbarLayout2 />
			</Hidden>

			<Hidden lgUp>
				<StyledSwipeableDrawer
					anchor="left"
					variant="temporary"
					open={navbar.mobileOpen}
					onClose={() => dispatch(navbarCloseMobile())}
					onOpen={() => {}}
					disableSwipeToOpen
					className={className}
					ModalProps={{
						keepMounted: true // Better open performance on mobile.
					}}
				>
					<NavbarMobileLayout2 />
				</StyledSwipeableDrawer>
			</Hidden>
			{config?.navbar?.display && !config?.toolbar?.display && (
				<Hidden lgUp>
					<NavbarToggleFabLayout2 />
				</Hidden>
			)}
		</>
	);
}

export default withSlices<NavbarWrapperLayout2Props>([navbarSlice])(memo(NavbarWrapperLayout2));

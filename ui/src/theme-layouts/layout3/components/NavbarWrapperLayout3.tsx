import { memo, useEffect } from 'react';
import { useLocation } from 'react-router';
import NavbarToggleFab from '@layouts/shared-components/navbar/NavbarToggleFab';
import { useMediaQuery } from '@mui/material';
import Hidden from '@mui/material/Hidden';
import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { navbarCloseMobile, selectNavbar } from '@store/slices/navbarSlice';

import { Layout3ConfigType } from '../Layout3Config';

import NavbarLayout3 from './NavbarLayout3';
import NavbarMobileLayout3 from './NavbarMobileLayout3';

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

type NavbarWrapperLayout3Props = {
	className?: string;
	config: Layout3ConfigType;
};

/**
 * The navbar wrapper layout 3.
 */
function NavbarWrapperLayout3(props: NavbarWrapperLayout3Props) {
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
				<NavbarLayout3 className={className} />
			</Hidden>

			<Hidden lgUp>
				<StyledSwipeableDrawer
					anchor="left"
					variant="temporary"
					open={navbar.mobileOpen}
					onClose={() => dispatch(navbarCloseMobile())}
					onOpen={() => {}}
					disableSwipeToOpen
					ModalProps={{
						keepMounted: true // Better open performance on mobile.
					}}
				>
					<NavbarMobileLayout3 />
				</StyledSwipeableDrawer>
			</Hidden>

			{config?.navbar?.display && !config?.toolbar?.display && (
				<Hidden lgUp>
					<NavbarToggleFab />
				</Hidden>
			)}
		</>
	);
}

export default memo(NavbarWrapperLayout3);

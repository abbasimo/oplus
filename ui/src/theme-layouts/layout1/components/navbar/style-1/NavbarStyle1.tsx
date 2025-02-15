import { Layout1ConfigType } from '@layouts/layout1/Layout1Config';
import Hidden from '@mui/material/Hidden';
import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Theme } from '@mui/system/createTheme';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { navbarCloseMobile, selectNavbar } from '@store/slices/navbarSlice';

import NavbarStyle1Content from './NavbarStyle1Content';

const navbarWidth = 260;

type StyledNavBarProps = {
	theme?: Theme;
	open: boolean;
	position: string;
};

const StyledNavBar = styled('div')<StyledNavBarProps>(({ theme, open, position }) => ({
	minWidth: navbarWidth,
	width: navbarWidth,
	maxWidth: navbarWidth,
	...(!open && {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.leavingScreen
		}),
		...(position === 'left' && {
			marginLeft: `-${navbarWidth}px`
		}),
		...(position === 'right' && {
			marginRight: `-${navbarWidth}px`
		})
	}),
	...(open && {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		})
	})
}));

const StyledNavBarMobile = styled(SwipeableDrawer)(() => ({
	'& .MuiDrawer-paper': {
		minWidth: navbarWidth,
		width: navbarWidth,
		maxWidth: navbarWidth
	}
}));

interface NavbarStyle1Props {
	config: Layout1ConfigType;
}

/**
 * The navbar style 1.
 */
function NavbarStyle1({ config }: NavbarStyle1Props) {
	const dispatch = useAppDispatch();
	const navbar = useAppSelector(selectNavbar);

	return (
		<>
			<Hidden mdDown>
				<StyledNavBar
					className="sticky top-0 z-20 h-screen flex-auto shrink-0 flex-col overflow-hidden"
					open={navbar.open}
					position={config?.navbar?.position ?? 'left'}
				>
					<NavbarStyle1Content />
				</StyledNavBar>
			</Hidden>

			<Hidden mdUp>
				<StyledNavBarMobile
					classes={{
						paper: 'flex-col flex-auto h-full'
					}}
					anchor={config?.navbar?.position ?? 'left'}
					variant="temporary"
					open={navbar.mobileOpen}
					onClose={() => dispatch(navbarCloseMobile())}
					onOpen={() => {}}
					disableSwipeToOpen
					ModalProps={{
						keepMounted: true // Better open performance on mobile.
					}}
				>
					<NavbarStyle1Content />
				</StyledNavBarMobile>
			</Hidden>
		</>
	);
}

export default NavbarStyle1;

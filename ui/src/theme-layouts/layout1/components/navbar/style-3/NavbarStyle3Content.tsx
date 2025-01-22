import { memo, useEffect, useState } from 'react';
import { Location, useLocation } from 'react-router';
import isUrlInChildren from '@layouts/shared-components/navigation/isUrlInChildren';
import NavigationFactory from '@layouts/shared-components/navigation/NavigationFactory';
import { NavItemType } from '@layouts/shared-components/navigation/types/NavItemType';
import { useMediaQuery } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { styled } from '@mui/material/styles';
import { darken, Theme } from '@mui/system';
import { useAuth } from '@remate/core';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { navbarCloseMobile } from '@store/slices/navbarSlice';
import { selectNavigation } from '@store/slices/navigationSlice';
import clsx from 'clsx';

const Root = styled('div')(({ theme }) => ({
	backgroundColor:
		theme.palette.mode === 'light' ? darken(theme.palette.primary.main, 0.75) : theme.palette.background.default,
	color: theme.palette.mode === 'light' ? theme.palette.primary.contrastText : theme.palette.text.primary,
	'& ::-webkit-scrollbar-thumb': {
		boxShadow: `inset 0 0 0 20px ${
			theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.24)' : 'rgba(255, 255, 255, 0.24)'
		}`
	},
	'& ::-webkit-scrollbar-thumb:active': {
		boxShadow: `inset 0 0 0 20px ${
			theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.37)' : 'rgba(255, 255, 255, 0.37)'
		}`
	}
}));

type StyledPanelProps = {
	theme?: Theme;
	opened?: boolean;
};

const StyledPanel = styled('div')<StyledPanelProps>(({ theme, opened }) => ({
	...theme.mixins.borderRight(1),
	backgroundColor:
		theme.palette.mode === 'light' ? darken(theme.palette.primary.main, 0.75) : theme.palette.background.default,
	color: theme.palette.mode === 'light' ? theme.palette.primary.contrastText : theme.palette.text.primary,
	transition: theme.transitions.create(['opacity'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.shortest
	}),
	opacity: 0,
	pointerEvents: 'none',
	...(opened && {
		opacity: 1,
		pointerEvents: 'initial'
	})
}));

/**
 * Check if the item needs to be opened.
 */
function needsToBeOpened(location: Location, item: NavItemType) {
	return location && isUrlInChildren(item, location.pathname);
}

type NavbarStyle3ContentProps = { className?: string; dense?: number };

/**
 * The navbar style 3 content.
 */
function NavbarStyle3Content(props: NavbarStyle3ContentProps) {
	const { className = '', dense = false } = props;
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));
	const { canAccess } = useAuth();
	const navigation = useAppSelector(selectNavigation((rp) => canAccess(rp)));
	const [selectedNavigation, setSelectedNavigation] = useState<NavItemType[]>([]);
	const [panelOpen, setPanelOpen] = useState(false);
	const dispatch = useAppDispatch();
	const location = useLocation();

	useEffect(() => {
		navigation?.forEach((item) => {
			if (needsToBeOpened(location, item)) {
				setSelectedNavigation([item]);
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	function handleParentItemClick(selected: NavItemType) {
		/** if there is no child item do not set/open panel
		 */
		if (!selected.children || selected.children.length === 0) {
			setSelectedNavigation([]);
			setPanelOpen(false);
			return;
		}

		/**
		 * If navigation already selected toggle panel visibility
		 */
		if (selectedNavigation[0]?.id === selected.id) {
			setPanelOpen(!panelOpen);
		} else {
			/**
			 * Set navigation and open panel
			 */
			setSelectedNavigation([selected]);
			setPanelOpen(true);
		}
	}

	function handleChildItemClick() {
		setPanelOpen(false);

		if (isMobile) {
			dispatch(navbarCloseMobile());
		}
	}

	return (
		<ClickAwayListener
			onClickAway={() => {
				setPanelOpen(false);
			}}
		>
			<Root className={clsx('flex h-full flex-auto', className)}>
				<div
					id="remate-navbar-side-panel"
					className="flex shrink-0 flex-col items-center"
				>
					<img
						className="my-32 w-44"
						src="assets/images/logo/logo.png"
						alt="logo"
					/>

					<div className="flex min-h-0 w-full flex-1 justify-center overflow-y-auto overflow-x-hidden">
						<NavigationFactory
							className={clsx('navigation')}
							navigation={navigation}
							layout="vertical-2"
							onItemClick={handleParentItemClick}
							firstLevel
							selectedId={selectedNavigation[0]?.id}
							dense={Boolean(dense)}
						/>
					</div>
				</div>

				{selectedNavigation.length > 0 && (
					<StyledPanel
						id="remate-navbar-panel"
						opened={panelOpen}
						className={clsx('overflow-y-auto overflow-x-hidden shadow')}
					>
						<NavigationFactory
							className={clsx('navigation')}
							navigation={selectedNavigation}
							layout="vertical"
							onItemClick={handleChildItemClick}
						/>
					</StyledPanel>
				)}
			</Root>
		</ClickAwayListener>
	);
}

export default memo(NavbarStyle3Content);

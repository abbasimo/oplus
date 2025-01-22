import { useMediaQuery } from '@mui/material';
import { useAuth } from '@remate/core';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import withSlices from '@store/withSlices';
import clsx from 'clsx';

import { navbarCloseMobile } from '../../store/slices/navbarSlice';
import { navigationSlice, selectNavigation } from '../../store/slices/navigationSlice';

import NavigationFactory, { NavigationFactoryProps } from './navigation/NavigationFactory';

/**
 * Navigation
 */

type NavigationProps = Partial<NavigationFactoryProps>;

function NavigationContainer(props: NavigationProps) {
	const { className = '', layout = 'vertical', dense, active } = props;
	const { canAccess } = useAuth();

	const navigation = useAppSelector(selectNavigation((rp) => canAccess(rp)));

	const isMobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));

	const dispatch = useAppDispatch();

	function handleItemClick() {
		if (isMobile) {
			dispatch(navbarCloseMobile());
		}
	}

	return (
		<NavigationFactory
			className={clsx('navigation flex-1', className)}
			navigation={navigation}
			layout={layout}
			dense={dense}
			active={active}
			onItemClick={handleItemClick}
			checkPermission
			{...props}
		/>
	);
}

export default withSlices<NavigationFactoryProps>([navigationSlice])(NavigationContainer);

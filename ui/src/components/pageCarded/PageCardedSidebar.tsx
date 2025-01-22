import { ReactNode, Ref, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Hidden from '@mui/material/Hidden';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { SwipeableDrawerProps } from '@mui/material/SwipeableDrawer/SwipeableDrawer';
import clsx from 'clsx';

import PageCardedSidebarContent from './PageCardedSidebarContent';

/**
 * Props for the PageCardedSidebar component.
 */
type PageCardedSidebarProps = {
	ref?: Ref<{ toggleSidebar: (T: boolean) => void }>;
	open?: boolean;
	position?: SwipeableDrawerProps['anchor'];
	variant?: SwipeableDrawerProps['variant'];
	onClose?: () => void;
	children?: ReactNode;
};

/**
 * The PageCardedSidebar component is a sidebar for the PageCarded component.
 */
function PageCardedSidebar({ ref, ...props }: PageCardedSidebarProps) {
	const { open = true, position, variant, onClose = () => {} } = props;

	const [isOpen, setIsOpen] = useState(open);

	const handleToggleDrawer = useCallback((val: boolean) => {
		setIsOpen(val);
	}, []);

	useImperativeHandle(ref, () => ({
		toggleSidebar: handleToggleDrawer
	}));

	useEffect(() => {
		handleToggleDrawer(open);
	}, [handleToggleDrawer, open]);

	return (
		<>
			<Hidden lgUp={variant === 'permanent'}>
				<SwipeableDrawer
					variant="temporary"
					anchor={position}
					open={isOpen}
					onOpen={() => {}}
					onClose={() => onClose()}
					disableSwipeToOpen
					classes={{
						root: clsx('PageCarded-sidebarWrapper', variant),
						paper: clsx(
							'PageCarded-sidebar',
							variant,
							position === 'left' ? 'PageCarded-leftSidebar' : 'PageCarded-rightSidebar'
						)
					}}
					ModalProps={{
						keepMounted: true // Better open performance on mobile.
					}}
					BackdropProps={{
						classes: {
							root: 'PageCarded-backdrop'
						}
					}}
					style={{ position: 'absolute' }}
				>
					<PageCardedSidebarContent {...props} />
				</SwipeableDrawer>
			</Hidden>
			{variant === 'permanent' && (
				<Hidden lgDown>
					<Drawer
						variant="permanent"
						anchor={position}
						className={clsx(
							'PageCarded-sidebarWrapper',
							variant,
							isOpen ? 'opened' : 'closed',
							position === 'left' ? 'PageCarded-leftSidebar' : 'PageCarded-rightSidebar'
						)}
						open={isOpen}
						onClose={onClose}
						classes={{
							paper: clsx('PageCarded-sidebar', variant)
						}}
					>
						<PageCardedSidebarContent {...props} />
					</Drawer>
				</Hidden>
			)}
		</>
	);
}

export default PageCardedSidebar;

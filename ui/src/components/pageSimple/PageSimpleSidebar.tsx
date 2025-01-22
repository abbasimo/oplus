import { ReactNode, Ref, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Hidden from '@mui/material/Hidden';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { SwipeableDrawerProps } from '@mui/material/SwipeableDrawer/SwipeableDrawer';
import clsx from 'clsx';

import PageSimpleSidebarContent from './PageSimpleSidebarContent';

/**
 * Props for the PageSimpleSidebar component.
 */
type PageSimpleSidebarProps = {
	ref?: Ref<{ toggleSidebar: (T: boolean) => void }>;
	open?: boolean;
	position?: SwipeableDrawerProps['anchor'];
	variant?: SwipeableDrawerProps['variant'];
	onClose?: () => void;
	children?: ReactNode;
};

/**
 * The PageSimpleSidebar component.
 */
function PageSimpleSidebar({ ref, ...props }: PageSimpleSidebarProps) {
	const { open = true, position, variant, onClose = () => {} } = props;

	const [isOpen, setIsOpen] = useState(open);

	useImperativeHandle(ref, () => ({
		toggleSidebar: handleToggleDrawer
	}));

	const handleToggleDrawer = useCallback((val: boolean) => {
		setIsOpen(val);
	}, []);

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
						root: clsx('PageSimple-sidebarWrapper', variant),
						paper: clsx(
							'PageSimple-sidebar',
							variant,
							position === 'left' ? 'PageSimple-leftSidebar' : 'PageSimple-rightSidebar',
							'max-w-full'
						)
					}}
					ModalProps={{
						keepMounted: true // Better open performance on mobile.
					}}
					// container={rootRef.current}
					BackdropProps={{
						classes: {
							root: 'PageSimple-backdrop'
						}
					}}
					style={{ position: 'absolute' }}
				>
					<PageSimpleSidebarContent {...props} />
				</SwipeableDrawer>
			</Hidden>

			{variant === 'permanent' && (
				<Hidden lgDown>
					<Drawer
						variant="permanent"
						anchor={position}
						className={clsx(
							'PageSimple-sidebarWrapper',
							variant,
							isOpen ? 'opened' : 'closed',
							position === 'left' ? 'PageSimple-leftSidebar' : 'PageSimple-rightSidebar'
						)}
						open={isOpen}
						onClose={onClose}
						classes={{
							paper: clsx('PageSimple-sidebar border-0', variant)
						}}
					>
						<PageSimpleSidebarContent {...props} />
					</Drawer>
				</Hidden>
			)}
		</>
	);
}

export default PageSimpleSidebar;

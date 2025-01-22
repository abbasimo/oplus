import { cloneElement, isValidElement, useEffect, useMemo, useState } from 'react';
import { PiCaretDown, PiCaretLeft, PiCaretRight } from 'react-icons/pi';
import { Location, useLocation } from 'react-router';
import { ListItemButton, useTheme } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import List, { ListProps } from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { alpha, styled } from '@mui/material/styles';
import clsx from 'clsx';

import isUrlInChildren from '../../isUrlInChildren';
import NavBadge from '../../NavBadge';
import NavItem, { NavItemComponentProps } from '../../NavItem';
import NavLinkAdapter from '../../NavLinkAdapter';
import { NavItemType } from '../../types/NavItemType';

type ListComponentProps = ListProps & {
	itempadding: number;
};

const Root = styled(List)<ListComponentProps>(({ theme, ...props }) => ({
	padding: 0,
	'&.open': {},
	'& > .remate-list-item': {
		minHeight: 44,
		width: '100%',
		borderRadius: '6px',
		margin: '0 0 4px 0',
		paddingRight: 16,
		paddingLeft: props.itempadding > 80 ? 80 : props.itempadding,
		paddingTop: 10,
		paddingBottom: 10,
		color: alpha(theme.palette.text.primary, 0.7),
		'&:hover': {
			color: theme.palette.text.primary
		},
		'& > .remate-list-item-icon': {
			marginRight: 16,
			color: 'inherit'
		}
	}
}));

function needsToBeOpened(location: Location, item: NavItemType) {
	return location && isUrlInChildren(item, location.pathname);
}

/**
 * NavVerticalCollapse component used for vertical navigation items with collapsible children.
 */
function NavVerticalCollapse(props: NavItemComponentProps) {
	const location = useLocation();
	const theme = useTheme();
	const { item, nestedLevel = 0, onItemClick, checkPermission } = props;

	const [open, setOpen] = useState(() => needsToBeOpened(location, item));

	const itempadding = nestedLevel > 0 ? 38 + nestedLevel * 16 : 16;

	useEffect(() => {
		if (needsToBeOpened(location, item)) {
			if (!open) {
				setOpen(true);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location, item]);

	const component = item.url ? NavLinkAdapter : 'li';

	let itemProps = {};

	if (typeof component !== 'string') {
		itemProps = {
			disabled: item.disabled,
			to: item.url,
			end: item.end,
			role: 'button'
		};
	}

	if (checkPermission && !item?.hasPermission) {
		return null;
	}

	// eslint-disable-next-line react-hooks/rules-of-hooks
	return useMemo(
		() => (
			<Root
				className={clsx(open && 'open')}
				itempadding={itempadding}
				sx={item.sx}
			>
				<ListItemButton
					component={component}
					className="remate-list-item"
					onClick={() => {
						setOpen(!open);
					}}
					{...itemProps}
				>
					{isValidElement(item.icon) &&
						cloneElement(item.icon, {
							fontSize: item.icon.props.fontSize ?? 24,
							className: clsx('remate-list-item-icon shrink-0', item.icon.props.className)
						})}

					<ListItemText
						className="remate-list-item-text"
						primary={item.title}
						secondary={item.subtitle}
						classes={{
							primary: 'text-13 font-medium remate-list-item-text-primary truncate',
							secondary: 'text-11 font-medium remate-list-item-text-secondary leading-normal truncate'
						}}
					/>

					{item.badge && (
						<NavBadge
							className="mx-4"
							badge={item.badge}
						/>
					)}

					<IconButton
						disableRipple
						className="-mx-12 h-20 w-20 p-0 hover:bg-transparent focus:bg-transparent"
						onClick={(ev) => {
							ev.preventDefault();
							ev.stopPropagation();
							setOpen(!open);
						}}
						size="large"
						color="inherit"
					>
						{open ? (
							<PiCaretDown
								className="arrow-icon"
								fontSize={18}
							/>
						) : theme.direction === 'ltr' ? (
							<PiCaretRight
								className="arrow-icon"
								fontSize={18}
							/>
						) : (
							<PiCaretLeft
								className="arrow-icon"
								fontSize={18}
							/>
						)}
					</IconButton>
				</ListItemButton>

				{item.children && (
					<Collapse
						in={open}
						className="collapse-children"
					>
						{item.children.map((_item) => (
							<NavItem
								key={_item.id}
								type={`vertical-${_item.type}`}
								item={_item}
								nestedLevel={nestedLevel + 1}
								onItemClick={onItemClick}
								checkPermission={checkPermission}
							/>
						))}
					</Collapse>
				)}
			</Root>
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[item.badge, item.children, item.icon, item.title, item.url, itempadding, nestedLevel, onItemClick, open]
	);
}

export default NavVerticalCollapse;

import { cloneElement, isValidElement, memo, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { PiCaretLeft, PiCaretRight } from 'react-icons/pi';
import { Manager, Popper, Reference } from 'react-popper';
import { Location } from 'react-router';
import { ListItemButton, ListItemButtonProps } from '@mui/material';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import { styled, useTheme } from '@mui/material/styles';
import { useDebounce, withRouter } from '@remate/core';
import clsx from 'clsx';

import isUrlInChildren from '../../isUrlInChildren';
import NavBadge from '../../NavBadge';
import NavItem, { NavItemComponentProps } from '../../NavItem';
import NavLinkAdapter from '../../NavLinkAdapter';

const Root = styled(ListItemButton)<ListItemButtonProps>(({ theme }) => ({
	color: theme.palette.text.primary,
	minHeight: 48,
	cursor: 'pointer',
	'&.active, &.active:hover, &.active:focus': {
		backgroundColor: `${theme.palette.secondary.main}!important`,
		color: `${theme.palette.secondary.contrastText}!important`,

		'&.open': {
			backgroundColor: 'rgba(0,0,0,.08)'
		},

		'& > .remate-list-item-text': {
			padding: '0 0 0 16px'
		},

		'& .remate-list-item-icon': {
			color: 'inherit'
		}
	}
}));

type NavHorizontalCollapseProps = NavItemComponentProps & {
	location: Location;
};

/**
 * RemateNavHorizontalCollapse component helps rendering Horizontal Remate Navigation Item with children
 * Used in RemateNavVerticalItems and RemateNavHorizontalItems
 */
function NavHorizontalCollapse(props: NavHorizontalCollapseProps) {
	const [opened, setOpened] = useState(false);
	const { item, nestedLevel, dense, location, checkPermission } = props;
	const theme = useTheme();

	const handleToggle = useDebounce((open: boolean) => {
		setOpened(open);
	}, 150);

	const component = item.url ? NavLinkAdapter : 'li';

	let itemProps: any;

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
			<ul className="relative px-0">
				<Manager>
					<Reference>
						{({ ref }) => (
							<div ref={ref}>
								<Root
									component={component}
									className={clsx(
										'remate-list-item',
										opened && 'open',
										isUrlInChildren(item, location.pathname) && 'active'
									)}
									onMouseEnter={() => handleToggle(true)}
									onMouseLeave={() => handleToggle(false)}
									aria-owns={opened ? 'menu-remate-list-grow' : null}
									aria-haspopup="true"
									sx={item.sx}
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
										classes={{ primary: 'text-13 truncate' }}
									/>

									{item.badge && (
										<NavBadge
											className="mx-4"
											badge={item.badge}
										/>
									)}

									<IconButton
										disableRipple
										className="h-16 w-16 p-0 ltr:ml-4 rtl:mr-4"
										color="inherit"
									>
										{theme.direction === 'ltr' ? (
											<PiCaretRight
												className="arrow-icon"
												fontSize={16}
											/>
										) : (
											<PiCaretLeft
												className="arrow-icon"
												fontSize={16}
											/>
										)}
									</IconButton>
								</Root>
							</div>
						)}
					</Reference>
					{ReactDOM.createPortal(
						<Popper placement={theme.direction === 'ltr' ? 'right' : 'left'}>
							{({ ref, style, placement }) =>
								opened && (
									<div
										ref={ref}
										style={{
											...style,
											zIndex: 999 + nestedLevel! + 1
										}}
										data-placement={placement}
										className={clsx('z-999', !opened && 'pointer-events-none')}
									>
										<Grow
											in={opened}
											id="menu-remate-list-grow"
											style={{ transformOrigin: '0 0 0' }}
										>
											<Paper
												className="rounded-8"
												onMouseEnter={() => handleToggle(true)}
												onMouseLeave={() => handleToggle(false)}
											>
												{item.children && (
													<ul
														className={clsx(
															'popper-navigation-list',
															dense && 'dense',
															'px-0'
														)}
													>
														{item.children.map((_item) => (
															<NavItem
																key={_item.id}
																type={`horizontal-${_item.type}`}
																item={_item}
																nestedLevel={nestedLevel! + 1}
																dense={dense}
															/>
														))}
													</ul>
												)}
											</Paper>
										</Grow>
									</div>
								)
							}
						</Popper>,
						document.querySelector('#root')!
					)}
				</Manager>
			</ul>
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[dense, handleToggle, item, nestedLevel, opened, location.pathname, theme.direction]
	);
}

export default withRouter(memo(NavHorizontalCollapse));

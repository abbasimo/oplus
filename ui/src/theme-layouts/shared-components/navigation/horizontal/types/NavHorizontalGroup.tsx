import { cloneElement, isValidElement, memo, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { PiCaretLeft, PiCaretRight } from 'react-icons/pi';
import { Manager, Popper, Reference } from 'react-popper';
import { ListItemButton, ListItemButtonProps } from '@mui/material';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import { styled, useTheme } from '@mui/material/styles';
import * as PopperJS from '@popperjs/core';
import { useDebounce, withRouter, WithRouterProps } from '@remate/core';
import clsx from 'clsx';

import isUrlInChildren from '../../isUrlInChildren';
import NavItem, { NavItemComponentProps } from '../../NavItem';
import NavLinkAdapter from '../../NavLinkAdapter';

const Root = styled(ListItemButton)<ListItemButtonProps>(({ theme }) => ({
	color: theme.palette.text.primary,
	cursor: 'pointer',
	'&.active, &.active:hover, &.active:focus': {
		backgroundColor: `${theme.palette.secondary.main}!important`,
		color: `${theme.palette.secondary.contrastText}!important`,
		'& .remate-list-item-text-primary': {
			color: 'inherit'
		},
		'& .remate-list-item-icon': {
			color: 'inherit'
		}
	},
	'& .remate-list-item-text': {
		padding: '0 0 0 16px'
	},
	'&.level-0': {
		minHeight: 44,
		borderRadius: 4,
		'&:hover': {
			background: 'transparent'
		}
	}
}));

type NavHorizontalGroupProps = NavItemComponentProps & WithRouterProps;

/**
 * NavHorizontalGroup.
 * Represents a horizontal group component used in the Remate navigation navigation list.
 * It shows the list item as well as its children with a flyout effect.
 */
function NavHorizontalGroup(props: NavHorizontalGroupProps) {
	const [opened, setOpened] = useState(false);
	const { item, nestedLevel, dense, location, checkPermission } = props;
	const theme = useTheme();

	const handleToggle = useDebounce((open: boolean) => {
		setOpened(open);
	}, 150);

	return useMemo(() => {
		let popperPlacement: PopperJS.Placement;

		if (nestedLevel === 0) {
			popperPlacement = theme.direction === 'ltr' ? 'bottom-start' : 'bottom-end';
		} else {
			popperPlacement = theme.direction === 'ltr' ? 'right' : 'left';
		}

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

		return (
			<Manager>
				<Reference>
					{({ ref }) => (
						<div ref={ref}>
							<Root
								component={component}
								className={clsx(
									'remate-list-item',
									'relative',
									`level-${nestedLevel}`,
									isUrlInChildren(item, location!.pathname) && 'active'
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

								{nestedLevel! > 0 && (
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
								)}
							</Root>
						</div>
					)}
				</Reference>
				{ReactDOM.createPortal(
					<Popper placement={popperPlacement}>
						{({ ref, style, placement }) =>
							opened && (
								<div
									ref={ref}
									style={{
										...style,
										zIndex: 999 + nestedLevel!
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
													className={clsx('popper-navigation-list', dense && 'dense', 'px-0')}
												>
													{item.children.map((_item) => (
														<NavItem
															key={_item.id}
															type={`horizontal-${_item.type}`}
															item={_item}
															nestedLevel={nestedLevel}
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
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dense, handleToggle, item, nestedLevel, opened, props.location!.pathname, theme.direction]);
}

export default withRouter(memo(NavHorizontalGroup));

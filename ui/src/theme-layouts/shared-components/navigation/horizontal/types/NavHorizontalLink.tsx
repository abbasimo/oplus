import { cloneElement, isValidElement, memo, useMemo } from 'react';
import { Link, ListItemButton, ListItemButtonProps } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import { withRouter, WithRouterProps } from '@remate/core';
import clsx from 'clsx';

import NavBadge from '../../NavBadge';
import { NavItemComponentProps } from '../../NavItem';

const Root = styled(ListItemButton)<ListItemButtonProps>(({ theme }) => ({
	color: theme.palette.text.primary,
	textDecoration: 'none!important',
	minHeight: 48,
	'&.active': {
		backgroundColor: `${theme.palette.secondary.main}!important`,
		color: `${theme.palette.secondary.contrastText}!important`,
		pointerEvents: 'none',
		'& .remate-list-item-text-primary': {
			color: 'inherit'
		},
		'& .remate-list-item-icon': {
			color: 'inherit'
		}
	},
	'& .remate-list-item-icon': {},
	'& .remate-list-item-text': {
		padding: '0 0 0 16px'
	}
}));

type NavHorizontalLinkProps = NavItemComponentProps & WithRouterProps;

/*
 * NavHorizontalLink
 * This is a component to render horizontal navigation links in the Remate navigations.
 * It receieves `RemateNavItemComponentProps` and `WithRouterProps` as props.
 */
function NavHorizontalLink(props: NavHorizontalLinkProps) {
	const { item, checkPermission } = props;

	let itemProps: any;

	const component = item.url ? Link : 'li';

	if (typeof component !== 'string') {
		itemProps = {
			disabled: item.disabled,
			href: item.url,
			role: 'button',
			target: item.target ? item.target : '_blank'
		};
	}

	if (checkPermission && !item?.hasPermission) {
		return null;
	}

	// eslint-disable-next-line react-hooks/rules-of-hooks
	return useMemo(
		() => (
			<Root
				component={component}
				className={clsx('remate-list-item')}
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
					classes={{ primary: 'text-13 remate-list-item-text-primary truncate' }}
				/>

				{item.badge && (
					<NavBadge
						className="ltr:ml-8 rtl:mr-8"
						badge={item.badge}
					/>
				)}
			</Root>
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[item.badge, item.icon, item.target, item.title, item.url]
	);
}

export default withRouter(memo(NavHorizontalLink));

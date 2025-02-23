import { cloneElement, isValidElement, useMemo } from 'react';
import { Link, ListItemButton, ListItemButtonProps } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';

import NavBadge from '../../NavBadge';
import { NavItemComponentProps } from '../../NavItem';

type ListItemButtonStyleProps = ListItemButtonProps & {
	itempadding: number;
};

const Root = styled(ListItemButton)<ListItemButtonStyleProps>(({ theme, ...props }) => ({
	minHeight: 44,
	width: '100%',
	borderRadius: '6px',
	margin: '0 0 4px 0',
	paddingRight: 16,
	paddingLeft: props.itempadding > 80 ? 80 : props.itempadding,
	paddingTop: 10,
	paddingBottom: 10,
	'&.active': {
		backgroundColor: `${theme.palette.secondary.main}!important`,
		color: `${theme.palette.secondary.contrastText}!important`,
		pointerEvents: 'none',
		transition: 'border-radius .15s cubic-bezier(0.4,0.0,0.2,1)',
		'& > .remate-list-item-text-primary': {
			color: 'inherit'
		},
		'& > .remate-list-item-icon': {
			color: 'inherit'
		}
	},
	'& > .remate-list-item-icon': {
		marginRight: 16
	},
	'& > .remate-list-item-text': {},
	color: theme.palette.text.primary,
	textDecoration: 'none!important'
}));

/**
 * NavVerticalLink
 * Create a vertical Link to use inside the navigation component.
 */
function NavVerticalLink(props: NavItemComponentProps) {
	const { item, nestedLevel = 0, onItemClick, checkPermission } = props;

	const itempadding = nestedLevel > 0 ? 38 + nestedLevel * 16 : 16;

	let itemProps = {};

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
				className="remate-list-item"
				onClick={() => onItemClick && onItemClick(item)}
				itempadding={itempadding}
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
					secondary={item.subtitle}
					classes={{
						primary: 'text-13 font-medium remate-list-item-text-primary truncate',
						secondary: 'text-11 font-medium remate-list-item-text-secondary leading-normal truncate'
					}}
				/>

				{item.badge && <NavBadge badge={item.badge} />}
			</Root>
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[item, itempadding, onItemClick, checkPermission]
	);
}

export default NavVerticalLink;

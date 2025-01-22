import { cloneElement, isValidElement, useMemo } from 'react';
import { ListItemButton, ListItemButtonProps } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';

import NavBadge from '../../NavBadge';
import { NavItemComponentProps } from '../../NavItem';
import NavLinkAdapter from '../../NavLinkAdapter';

type ListItemButtonStyleProps = ListItemButtonProps & {
	itempadding: number;
};

const Root = styled(ListItemButton)<ListItemButtonStyleProps>(({ theme, ...props }) => ({
	minHeight: 52,
	width: '100%',
	margin: '0 0 16px 0',
	paddingRight: 16,
	paddingLeft: props.itempadding > 80 ? 80 : props.itempadding,
	paddingTop: 12,
	paddingBottom: 12,
	color: theme.palette.text.primary,
	cursor: 'pointer',
	textDecoration: 'none!important',
	'&:hover': {
		color: theme.palette.text.primary
	},
	'&.active': {
		color: theme.palette.text.primary,
		pointerEvents: 'none',
		transition: 'border-radius .15s cubic-bezier(0.4,0.0,0.2,1)',
		'&::before': {
			content: '""',
			position: 'absolute',
			left: 4,
			height: 24,
			width: 6,
			backgroundColor: theme.palette.primary.main,
			borderRadius: theme.shape.borderRadius * 0.5
		},
		'& > .remate-list-item-text-primary': {
			color: 'inherit'
		},
		'& > .remate-list-item-icon': {
			color: 'inherit'
		}
	},
	'& >.remate-list-item-icon': {
		marginRight: 8,
		color: 'inherit'
	},
	'& > .remate-list-item-text': {}
}));

/**
 * NavVerticalItem is a React component used to render RemateNavItem as part of the Remate navigational component.
 */
function NavVerticalItem(props: NavItemComponentProps) {
	const { item, nestedLevel = 0, onItemClick, checkPermission } = props;

	const itempadding = nestedLevel > 0 ? 42 + nestedLevel * 16 : 20;

	const component = item.url ? NavLinkAdapter : 'li';

	let itemProps = {};

	if (typeof component !== 'string') {
		itemProps = {
			disabled: item.disabled,
			to: item.url ?? '',
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
				component={component}
				className={clsx('remate-list-item', item.active && 'active')}
				onClick={() => onItemClick && onItemClick(item)}
				itempadding={itempadding}
				sx={item.sx}
				{...itemProps}
			>
				{isValidElement(item.icon) &&
					cloneElement(item.icon, {
						fontSize: item.icon.props.fontSize ?? 25,
						className: clsx('remate-list-item-icon shrink-0', item.icon.props.className)
					})}

				<ListItemText
					className="remate-list-item-text"
					primary={item.title}
					secondary={item.subtitle}
					classes={{
						primary: 'text-16 font-400 remate-list-item-text-primary truncate',
						secondary: 'text-12 font-400 remate-list-item-text-secondary leading-normal truncate'
					}}
				/>
				{item.badge && <NavBadge badge={item.badge} />}
			</Root>
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[item, itempadding, onItemClick]
	);
}

export default NavVerticalItem;

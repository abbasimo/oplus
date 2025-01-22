import List from '@mui/material/List';
import { alpha, styled } from '@mui/material/styles';
import clsx from 'clsx';

import { NavigationFactoryProps } from '../NavigationFactory';
import NavItem from '../NavItem';
import { NavItemType } from '../types/NavItemType';

const StyledList = styled(List)(({ theme }) => ({
	'& .remate-list-item': {
		'&:hover': {
			backgroundColor: alpha(
				theme.palette.mode === 'light' ? theme.palette.primary.contrastText : theme.palette.text.primary,
				0.04
			)
		},
		'&:focus:not(.active)': {
			backgroundColor: alpha(
				theme.palette.mode === 'light' ? theme.palette.primary.contrastText : theme.palette.text.primary,
				0.05
			)
		}
	},
	'& .remate-list-item-text': {
		margin: 0
	},
	'& .remate-list-item-text-primary': {
		lineHeight: '20px'
	},
	'&.active-square-list': {
		'& .remate-list-item, & .active.remate-list-item': {
			width: '100%',
			borderRadius: '0'
		}
	},
	'&.dense': {
		'& .remate-list-item': {
			paddingTop: 0,
			paddingBottom: 0,
			height: 32
		}
	}
}));

/**
 * NavVerticalLayout1
 * This component is used to render vertical navigations using
 * the Material-UI List component. It accepts the RemateNavigationProps props
 * and renders the RemateNavItem components accordingly
 */
function NavVerticalLayout1(props: NavigationFactoryProps) {
	const { navigation, active, dense, className, onItemClick, checkPermission } = props;

	function handleItemClick(item: NavItemType) {
		onItemClick?.(item);
	}

	return (
		<StyledList
			className={clsx(
				'navigation whitespace-nowrap px-12 py-0',
				`active-${active}-list`,
				dense && 'dense',
				className
			)}
		>
			{navigation?.map((_item) => (
				<NavItem
					key={_item.id}
					type={`vertical-${_item.type}`}
					item={_item}
					nestedLevel={0}
					onItemClick={handleItemClick}
					checkPermission={checkPermission}
				/>
			))}
		</StyledList>
	);
}

export default NavVerticalLayout1;

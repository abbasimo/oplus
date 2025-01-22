import List from '@mui/material/List';
import { alpha, styled } from '@mui/material/styles';
import clsx from 'clsx';

import { NavigationFactoryProps } from '../NavigationFactory';
import NavItem from '../NavItem';

const StyledList = styled(List)(({ theme }) => ({
	'& .remate-list-item': {
		'&:hover': {
			backgroundColor: alpha(theme.palette.primary.contrastText, 0.04)
		},
		'&:focus:not(.active)': {
			backgroundColor: alpha(theme.palette.primary.contrastText, 0.05)
		},
		padding: '8px 12px 8px 12px',
		height: 40,
		minHeight: 40,
		'&.level-0': {
			minHeight: 44,
			minminHeight: 44
		},
		'& .remate-list-item-text': {
			padding: '0 0 0 8px'
		}
	},
	'&.active-square-list': {
		'& .remate-list-item': {
			borderRadius: '0'
		}
	}
}));

/**
 * NavHorizontalLayout1 is a react component used for building and
 * rendering horizontal navigation menus, using the Material UI List component.
 */
function NavHorizontalLayout1(props: NavigationFactoryProps) {
	const { navigation, active, dense, className, checkPermission } = props;

	return (
		<StyledList
			className={clsx(
				'navigation flex whitespace-nowrap p-0',
				`active-${active}-list`,
				dense && 'dense',
				className
			)}
		>
			{navigation?.map((_item) => (
				<NavItem
					key={_item.id}
					type={`horizontal-${_item.type}`}
					item={_item}
					nestedLevel={0}
					dense={dense}
					checkPermission={checkPermission}
				/>
			))}
		</StyledList>
	);
}

export default NavHorizontalLayout1;

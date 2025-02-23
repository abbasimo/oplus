import List from '@mui/material/List';
import { alpha, styled } from '@mui/material/styles';
import clsx from 'clsx';

import { NavigationFactoryProps } from '../NavigationFactory';
import { NavItemType } from '../types/NavItemType';

import NavVerticalTab from './types/NavVerticalTab';

const StyledList = styled(List)(({ theme }) => ({
	'& .remate-list-item': {
		'&:hover': {
			backgroundColor: alpha(theme.palette.text.primary, 0.04)
		},
		'&:focus:not(.active)': {
			backgroundColor: alpha(theme.palette.text.primary, 0.05)
		}
	},
	'& .remate-list-item-text-primary': {
		lineHeight: '1'
	},
	'&.active-square-list': {
		'& .remate-list-item, & .active.remate-list-item': {
			width: '100%',
			borderRadius: '0'
		}
	},
	'&.dense': {}
}));

/**
 * NavVerticalLayout2 component represents a vertical navigation layout with material UI elements.
 * It displays the navigation object in the structured vertical menu and allows to handle onClick events for each navigation item.
 */
function NavVerticalLayout2(props: NavigationFactoryProps) {
	const { navigation, active, dense, className, onItemClick, firstLevel, selectedId, checkPermission } = props;

	function handleItemClick(item: NavItemType) {
		onItemClick?.(item);
	}

	return (
		<StyledList
			className={clsx(
				'navigation flex flex-col items-center whitespace-nowrap',
				`active-${active}-list`,
				dense && 'dense',
				className
			)}
		>
			{navigation?.map((_item) => (
				<NavVerticalTab
					key={_item.id}
					type={`vertical-${_item.type}`}
					item={_item}
					nestedLevel={0}
					onItemClick={handleItemClick}
					firstLevel={firstLevel}
					dense={dense}
					selectedId={selectedId}
					checkPermission={checkPermission}
				/>
			))}
		</StyledList>
	);
}

export default NavVerticalLayout2;

import { IconBaseProps } from 'react-icons';
import { SxProps } from '@mui/system';
import { RequestedPrivileges } from '@remate/core';

import { NavBadgeType } from './NavBadgeType';

/**
 * NavItemType
 * A type for Remate navigation item and its properties.
 */
export type NavItemType = {
	id: string;
	/**
	 * for translate, define the title in [`navigation-i18n`](src/configs/navigation-i18n)
	 */
	title: string;
	auth?: RequestedPrivileges;
	subtitle?: string;
	icon?: React.ReactElement<IconBaseProps>;
	url?: string;
	target?: string;
	type?: 'group' | 'collapse' | 'item' | 'link' | 'divider';
	sx?: SxProps;
	disabled?: boolean;
	active?: boolean;
	exact?: boolean;
	end?: boolean;
	badge?: NavBadgeType;
	children?: NavItemType[];
	hasPermission?: boolean;
};

export type FlatNavItemType = Omit<NavItemType, 'children' | 'sx'> & { children?: string[]; order: string };

import _ from 'lodash';
import { PartialDeep } from 'type-fest';

import { NavItemType } from '../types/NavItemType';

/**
 *  NavItemModel
 *  Constructs a navigation item based on RemateNavItemType
 */
function NavItemModel(data?: PartialDeep<NavItemType>) {
	data = data ?? {};

	return _.defaults(data, {
		id: _.uniqueId(),
		title: '',
		translate: '',
		auth: null,
		subtitle: '',
		url: '',
		target: '',
		type: 'item',
		sx: {},
		disabled: false,
		active: false,
		exact: false,
		end: false,
		children: []
	} as NavItemType);
}

export default NavItemModel;

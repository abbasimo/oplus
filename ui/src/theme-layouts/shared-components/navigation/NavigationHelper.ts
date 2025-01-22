import _ from 'lodash';
import { PartialDeep } from 'type-fest';

import NavItemModel from './models/NavItemModel';
import { FlatNavItemType, NavItemType } from './types/NavItemType';

class NavigationHelper {
	static selectById(nav: NavItemType[], id: string): NavItemType | undefined {
		for (let i = 0; i < nav.length; i += 1) {
			const item = nav[i];

			if (item.id === id) {
				return item;
			}

			if (item.children) {
				const childItem = this.selectById(item.children, id);

				if (childItem) {
					return childItem;
				}
			}
		}

		return undefined;
	}

	static appendNavItem(nav: NavItemType[], item: NavItemType, parentId: string | null = null): NavItemType[] {
		if (!parentId) {
			return [...nav, item];
		}

		return nav.map((node) => {
			if (node.id === parentId) {
				const newNode = { ...node };
				newNode.children = [...(node.children ?? []), item];
				return newNode;
			}

			if (node.children) {
				return { ...node, children: this.appendNavItem(node.children, item, parentId) };
			}

			return { ...node };
		});
	}

	static prependNavItem(nav: NavItemType[], item: NavItemType, parentId: string | null = null): NavItemType[] {
		if (!parentId) {
			return [item, ...nav];
		}

		return nav.map((node) => {
			if (node.id === parentId) {
				const newNode = { ...node };
				newNode.children = [item, ...(node.children ?? [])];
				return newNode;
			}

			if (node.children) {
				return { ...node, children: this.prependNavItem(node.children, item, parentId) };
			}

			return { ...node };
		});
	}

	/**
	 * The removeNavItem function removes a navigation item by its ID.
	 */
	static removeNavItem(nav: NavItemType[], id: string): NavItemType[] {
		return nav.reduce((acc, node) => {
			if (node.id !== id) {
				if (node.children) {
					acc.push({
						...node,
						children: this.removeNavItem(node.children, id)
					});
				} else {
					acc.push(node);
				}
			}

			return acc;
		}, [] as NavItemType[]);
	}

	/**
	 * The updateNavItem function updates a navigation item by its ID with new data.
	 */
	static updateNavItem(nav: NavItemType[], id: string, item: PartialDeep<NavItemType>): NavItemType[] {
		return nav.map((node) => {
			if (node.id === id) {
				return _.merge({}, node, item); // merge original node data with updated item data
			}

			if (node.children) {
				return {
					...node,
					children: this.updateNavItem(node.children, id, item)
				};
			}

			return node;
		});
	}

	/**
	 *  Convert to flat navigation
	 */
	static getFlatNavigation(navigationItems: NavItemType[] = [], flatNavigation: any[] = []) {
		for (let i = 0; i < navigationItems.length; i += 1) {
			const navItem = navigationItems[i];

			if (navItem.type === 'item') {
				const _navtItem = NavItemModel(navItem);
				flatNavigation.push(_navtItem);
			}

			if (navItem.type === 'collapse' || navItem.type === 'group') {
				if (navItem.children) {
					this.getFlatNavigation(navItem.children, flatNavigation);
				}
			}
		}
		return flatNavigation as NavItemType[] | [];
	}

	static flattenNavigation(navigation: NavItemType[], parentOrder: string = ''): FlatNavItemType[] {
		return navigation.flatMap((item, index) => {
			const order = parentOrder ? `${parentOrder}.${index + 1}` : `${index + 1}`;
			let flattened: FlatNavItemType[] = [{ ...item, order, children: item.children?.map((child) => child.id) }];

			if (item.children) {
				flattened = flattened.concat(this.flattenNavigation(item.children, order));
			}

			return flattened;
		});
	}

	static unflattenNavigation(navigation: FlatNavItemType[]): NavItemType[] {
		const itemMap: { [id: string]: NavItemType } = {};
		navigation.forEach((item) => {
			itemMap[item.id] = { ...item, children: [] };
		});

		const rootItems: NavItemType[] = [];

		navigation.forEach((item) => {
			if (item.order.includes('.')) {
				const parentOrder = item.order.substring(0, item.order.lastIndexOf('.'));
				const parent = navigation.find((navItem) => navItem.order === parentOrder);

				if (parent) {
					itemMap[parent.id].children?.push(itemMap[item.id]);
				}
			} else {
				rootItems.push(itemMap[item.id]);
			}
		});

		return rootItems.map((item) => {
			const { ...rest } = item;
			return rest;
		});
	}
}

export default NavigationHelper;

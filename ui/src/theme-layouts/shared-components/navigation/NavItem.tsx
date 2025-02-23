import { NavItemType } from './types/NavItemType';

const components: { [key: string]: React.FC<unknown> } = {};

/**
 * Register a component to RemateNavItem.
 */
export function registerComponent<T = unknown>(name: string, Component: React.FC<T>) {
	components[name] = Component as React.FC<unknown>;
}

export type NavItemComponentProps = {
	type: string;
	item: NavItemType;
	dense?: boolean;
	nestedLevel?: number;
	onItemClick?: (T: NavItemType) => void;
	checkPermission?: boolean;
};

/**
Component to render NavItem depending on its type.
*/
export default function NavItem(props: NavItemComponentProps) {
	const { type } = props;

	const C = components[type];

	return C ? <C {...(props as object)} /> : null;
}

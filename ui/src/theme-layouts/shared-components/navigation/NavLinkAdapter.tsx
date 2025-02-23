import { CSSProperties, ReactNode, Ref } from 'react';
import { NavLink, NavLinkProps, useNavigate } from 'react-router';

export type NavLinkAdapterPropsType = NavLinkProps & {
	ref?: Ref<HTMLAnchorElement>;
	activeClassName?: string;
	activeStyle?: CSSProperties;
	children?: ReactNode;
};

/**
 * The NavLinkAdapter component is a wrapper around the React Router NavLink component.
 * It adds the ability to navigate programmatically using the useNavigate hook.
 * The component is memoized to prevent unnecessary re-renders.
 */
function NavLinkAdapter({ ref, ...props }: NavLinkAdapterPropsType) {
	const { activeClassName = 'active', activeStyle, role = 'button', onClick, ..._props } = props;
	const navigate = useNavigate();

	return (
		<NavLink
			ref={ref}
			role={role}
			{..._props}
			onClick={(e) => {
				onClick?.(e);
				e.preventDefault();
				navigate(_props.to);
			}}
			className={({ isActive }) =>
				[_props.className, isActive ? activeClassName : null].filter(Boolean).join(' ')
			}
			style={({ isActive }) => ({
				..._props.style,
				...(isActive ? activeStyle : null)
			})}
		>
			{props.children}
		</NavLink>
	);
}

export default NavLinkAdapter;

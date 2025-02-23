import { ReactNode } from 'react';

/**
 * Props for the PageSimpleSidebarContent component.
 */
type PageSimpleSidebarContentProps = {
	children?: ReactNode;
};

/**
 * The PageSimpleSidebarContent component is a content container for the PageSimpleSidebar component.
 */
function PageSimpleSidebarContent(props: PageSimpleSidebarContentProps) {
	const { children } = props;

	if (!children) {
		return null;
	}

	return <div className="PageSimple-sidebarContent">{children}</div>;
}

export default PageSimpleSidebarContent;

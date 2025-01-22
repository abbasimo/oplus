import { ReactNode } from 'react';

/**
 * Props for the PageCardedSidebarContent component.
 */
type PageCardedSidebarContentProps = {
	children?: ReactNode;
};

/**
 * The PageCardedSidebarContent component is a content container for the PageCardedSidebar component.
 */
function PageCardedSidebarContent(props: PageCardedSidebarContentProps) {
	const { children } = props;

	if (!children) {
		return null;
	}

	return <div className="PageCarded-sidebarContent">{children}</div>;
}

export default PageCardedSidebarContent;

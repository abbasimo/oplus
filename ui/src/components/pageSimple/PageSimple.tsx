import { memo, ReactNode, Ref, useImperativeHandle, useRef } from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';
import { styled } from '@mui/material/styles';
import { Theme } from '@mui/system';
import { SystemStyleObject } from '@mui/system/styleFunctionSx/styleFunctionSx';
import clsx from 'clsx';

import PageSimpleHeader from './PageSimpleHeader';
import PageSimpleSidebar from './PageSimpleSidebar';

const headerHeight = 120;
const toolbarHeight = 64;

/**
 * Props for the PageSimple component.
 */
type PageSimpleProps = SystemStyleObject<Theme> & {
	ref?: Ref<{ toggleLeftSidebar: (T: boolean) => void; toggleRightSidebar: (T: boolean) => void }>;
	className?: string;
	leftSidebarContent?: ReactNode;
	leftSidebarVariant?: 'permanent' | 'persistent' | 'temporary';
	rightSidebarContent?: ReactNode;
	rightSidebarVariant?: 'permanent' | 'persistent' | 'temporary';
	header?: ReactNode;
	content?: ReactNode;
	scroll?: 'normal' | 'page' | 'content';
	leftSidebarOpen?: boolean;
	rightSidebarOpen?: boolean;
	leftSidebarWidth?: number;
	rightSidebarWidth?: number;
	rightSidebarOnClose?: () => void;
	leftSidebarOnClose?: () => void;
};

/**
 * The Root styled component is the top-level container for the PageSimple component.
 */
const Root = styled('div')<PageSimpleProps>(({ theme, ...props }) => ({
	display: 'flex',
	flexDirection: 'column',
	minWidth: 0,
	minHeight: '100%',
	position: 'relative',
	flex: '1 1 auto',
	width: '100%',
	height: 'auto',
	backgroundColor: theme.palette.background.default,

	'&.PageSimple-scroll-content': {
		height: '100%'
	},

	'& .PageSimple-wrapper': {
		display: 'flex',
		flexDirection: 'row',
		flex: '1 1 auto',
		zIndex: 2,
		minWidth: 0,
		height: '100%',
		backgroundColor: theme.palette.background.default,

		...(props.scroll === 'content' && {
			position: 'absolute',
			top: 0,
			bottom: 0,
			right: 0,
			left: 0,
			overflow: 'hidden'
		})
	},

	'& .PageSimple-header': {
		display: 'flex',
		flex: '0 0 auto',
		backgroundSize: 'cover',
		backgroundColor: theme.palette.background.default,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider
	},

	'& .PageSimple-topBg': {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		height: headerHeight,
		pointerEvents: 'none'
	},

	'& .PageSimple-contentWrapper': {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		flex: '1 1 auto',
		overflow: 'hidden',

		//    WebkitOverflowScrolling: 'touch',
		zIndex: 9999
	},

	'& .PageSimple-toolbar': {
		height: toolbarHeight,
		minHeight: toolbarHeight,
		display: 'flex',
		alignItems: 'center'
	},

	'& .PageSimple-content': {
		display: 'flex',
		flex: '1 1 auto',
		alignItems: 'start',
		minHeight: 0,
		overflowY: 'auto'
	},

	'& .PageSimple-sidebarWrapper': {
		overflow: 'hidden',
		backgroundColor: 'transparent',
		position: 'absolute',
		'&.permanent': {
			[theme.breakpoints.up('lg')]: {
				position: 'relative',
				marginLeft: 0,
				marginRight: 0,
				transition: theme.transitions.create('margin', {
					easing: theme.transitions.easing.sharp,
					duration: theme.transitions.duration.leavingScreen
				}),
				'&.closed': {
					transition: theme.transitions.create('margin', {
						easing: theme.transitions.easing.easeOut,
						duration: theme.transitions.duration.enteringScreen
					}),

					'&.PageSimple-leftSidebar': {
						marginLeft: -props.leftSidebarWidth!
					},
					'&.PageSimple-rightSidebar': {
						marginRight: -props.rightSidebarWidth!
					}
				}
			}
		}
	},

	'& .PageSimple-sidebar': {
		position: 'absolute',
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.text.primary,

		'&.permanent': {
			[theme.breakpoints.up('lg')]: {
				position: 'relative'
			}
		},
		maxWidth: '100%',
		height: '100%'
	},

	'& .PageSimple-leftSidebar': {
		width: props.leftSidebarWidth,

		[theme.breakpoints.up('lg')]: {
			borderRight: `1px solid ${theme.palette.divider}`,
			borderLeft: 0
		}
	},

	'& .PageSimple-rightSidebar': {
		width: props.rightSidebarWidth,

		[theme.breakpoints.up('lg')]: {
			borderLeft: `1px solid ${theme.palette.divider}`,
			borderRight: 0
		}
	},

	'& .PageSimple-sidebarHeader': {
		height: headerHeight,
		minHeight: headerHeight,
		backgroundColor: theme.palette.primary.dark,
		color: theme.palette.primary.contrastText
	},

	'& .PageSimple-sidebarHeaderInnerSidebar': {
		backgroundColor: 'transparent',
		color: 'inherit',
		height: 'auto',
		minHeight: 'auto'
	},

	'& .PageSimple-sidebarContent': {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '100%'
	},

	'& .PageSimple-backdrop': {
		position: 'absolute'
	}
}));

/**
 * The PageSimple component is a layout component that provides a simple page layout with a header, left sidebar, right sidebar, and content area.
 * It is designed to be used as a top-level component for an application or as a sub-component within a larger layout.
 */
function PageSimple({ ref, ...props }: PageSimpleProps) {
	const {
		scroll = 'page',
		className,
		header,
		content,
		leftSidebarContent,
		rightSidebarContent,
		leftSidebarOpen = false,
		rightSidebarOpen = false,
		rightSidebarWidth = 240,
		leftSidebarWidth = 240,
		leftSidebarVariant = 'permanent',
		rightSidebarVariant = 'permanent',
		rightSidebarOnClose,
		leftSidebarOnClose
	} = props;

	const leftSidebarRef = useRef<{ toggleSidebar: (T: boolean) => void }>(null);
	const rightSidebarRef = useRef<{ toggleSidebar: (T: boolean) => void }>(null);
	const rootRef = useRef(null);

	useImperativeHandle(ref, () => ({
		rootRef,
		toggleLeftSidebar: (val: boolean) => {
			leftSidebarRef?.current?.toggleSidebar(val);
		},
		toggleRightSidebar: (val: boolean) => {
			rightSidebarRef?.current?.toggleSidebar(val);
		}
	}));

	return (
		<>
			<GlobalStyles
				styles={() => ({
					...(scroll !== 'page' && {
						'#remate-toolbar': {
							position: 'static'
						},
						'#remate-footer': {
							position: 'static'
						}
					}),
					...(scroll === 'page' && {
						'#remate-toolbar': {
							position: 'sticky',
							top: 0
						},
						'#remate-footer': {
							position: 'sticky',
							bottom: 0
						}
					})
				})}
			/>
			<Root
				className={clsx('PageSimple-root', `PageSimple-scroll-${scroll}`, className)}
				ref={rootRef}
				scroll={scroll}
				leftSidebarWidth={leftSidebarWidth}
				rightSidebarWidth={rightSidebarWidth}
			>
				<div className="z-10 flex h-full flex-auto flex-col">
					<div className="PageSimple-wrapper">
						{leftSidebarContent && (
							<PageSimpleSidebar
								position="left"
								variant={leftSidebarVariant || 'permanent'}
								ref={leftSidebarRef}
								open={leftSidebarOpen}
								onClose={leftSidebarOnClose}
							>
								{leftSidebarContent}
							</PageSimpleSidebar>
						)}
						<div className="PageSimple-contentWrapper">
							{header && <PageSimpleHeader header={header} />}

							{content && <div className={clsx('PageSimple-content container')}>{content}</div>}
						</div>
						{rightSidebarContent && (
							<PageSimpleSidebar
								position="right"
								variant={rightSidebarVariant || 'permanent'}
								ref={rightSidebarRef}
								open={rightSidebarOpen}
								onClose={rightSidebarOnClose}
							>
								{rightSidebarContent}
							</PageSimpleSidebar>
						)}
					</div>
				</div>
			</Root>
		</>
	);
}

export default memo(styled(PageSimple)``);

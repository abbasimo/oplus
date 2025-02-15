import React, { memo, ReactNode } from 'react';
import { ErrorBoundary } from '@exception/components';
import Suspense from '@layouts/shared-components/Suspense';
import { Box, Hidden } from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import _ from 'lodash';

import FooterLayout1 from './components/FooterLayout1';
import LeftSideLayout1 from './components/LeftSideLayout1';
import NavbarWrapperLayout1 from './components/NavbarWrapperLayout1';
import RightSideLayout1 from './components/RightSideLayout1';
import ToolbarLayout1 from './components/ToolbarLayout1';
import layout1DefaultConfig, { Layout1ConfigType } from './Layout1Config';

type Layout1Props = {
	children?: ReactNode;
	config?: Layout1ConfigType;
};

const Root = styled('div')(({ config, theme }: { config: Layout1ConfigType; theme?: Theme }) => ({
	backgroundColor: theme?.palette?.grey?.[300],
	...(config.mode === 'boxed' && {
		clipPath: 'inset(0)',
		maxWidth: `${config.containerWidth}px`,
		margin: '0 auto',
		boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
	}),
	...(config.mode === 'container' && {
		'& .container': {
			maxWidth: `${config.containerWidth}px`,
			width: '100%',
			margin: '0 auto'
		}
	})
}));

/**
 * The layout 1.
 */
function Layout1({ children, config: configFromProps }: Layout1Props) {
	const config = React.useMemo(() => _.merge({}, layout1DefaultConfig, configFromProps ?? {}), [configFromProps]);

	return (
		<Root
			id="remate-layout"
			config={config}
			className="flex w-full"
		>
			{config?.leftSidePanel?.display && <LeftSideLayout1 />}

			<div className="flex min-w-0 flex-auto">
				{config?.navbar?.display && config?.navbar?.position === 'left' && (
					<NavbarWrapperLayout1 config={config} />
				)}

				<Box
					component="main"
					sx={(theme) => ({
						borderTopLeftRadius: theme.shape.borderRadius * 1.5,
						borderBottomLeftRadius: theme.shape.borderRadius * 1.5,
						// overflow: 'hidden',
						backgroundColor: theme.palette.background.neutral,
						...theme.mixins.border(1)
					})}
					id="remate-main"
					className="relative z-10 flex min-h-full min-w-0 flex-auto flex-col"
				>
					{config?.toolbar?.display && (
						<Hidden mdUp>
							<ToolbarLayout1
								config={config}
								className={config.toolbar.style === 'fixed' ? 'sticky top-0' : ''}
							/>
						</Hidden>
					)}

					<div className="relative z-10 flex min-h-0 flex-auto flex-col">
						<ErrorBoundary>
							<Suspense>{children}</Suspense>
						</ErrorBoundary>
					</div>

					{config?.footer?.display && (
						<FooterLayout1 className={config.footer.style === 'fixed' ? 'sticky bottom-0' : ''} />
					)}
				</Box>

				{config?.navbar?.display && config.navbar.position === 'right' && (
					<NavbarWrapperLayout1 config={config} />
				)}
			</div>

			{config?.rightSidePanel?.display && <RightSideLayout1 />}
		</Root>
	);
}

export default memo(Layout1);

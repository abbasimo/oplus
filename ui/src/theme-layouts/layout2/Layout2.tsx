import React, { memo, ReactNode } from 'react';
import { ErrorBoundary } from '@exception/components';
import Suspense from '@layouts/shared-components/Suspense';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import _ from 'lodash';

import FooterLayout2 from './components/FooterLayout2';
import LeftSideLayout2 from './components/LeftSideLayout2';
import NavbarWrapperLayout2 from './components/NavbarWrapperLayout2';
import RightSideLayout2 from './components/RightSideLayout2';
import ToolbarLayout2 from './components/ToolbarLayout2';
import layout2DefaultConfig, { Layout2ConfigType } from './Layout2Config';

const Root = styled('div')<{ config: Layout2ConfigType }>(({ config }) => ({
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

type Layout2Props = {
	children?: ReactNode;
	config?: Layout2ConfigType;
};

/**
 * The layout 2.
 */
function Layout2({ children, config: configFromProps }: Layout2Props) {
	const config = React.useMemo(() => _.merge({}, layout2DefaultConfig, configFromProps ?? {}), [configFromProps]);

	return (
		<Root
			id="remate-layout"
			className="flex w-full"
			config={config}
		>
			{config?.leftSidePanel?.display && <LeftSideLayout2 />}

			<div className="flex min-w-0 flex-auto flex-col">
				<main
					id="remate-main"
					className="relative flex min-h-full min-w-0 flex-auto flex-col"
				>
					{config?.navbar?.display && (
						<NavbarWrapperLayout2
							config={config}
							className={clsx(config.navbar.style === 'fixed' && 'sticky top-0 z-50')}
						/>
					)}

					{config?.toolbar?.display && (
						<ToolbarLayout2
							config={config}
							className={clsx(
								config.toolbar.style === 'fixed' && 'sticky top-0',
								config.toolbar.position === 'above' && 'z-40 order-first'
							)}
						/>
					)}

					<div className="relative z-10 flex min-h-0 flex-auto flex-col">
						<ErrorBoundary>
							<Suspense>{children}</Suspense>
						</ErrorBoundary>
					</div>

					{config?.footer?.display && (
						<FooterLayout2 className={config.footer.style === 'fixed' ? 'sticky bottom-0' : ''} />
					)}
				</main>
			</div>

			{config?.rightSidePanel?.display && <RightSideLayout2 />}
		</Root>
	);
}

export default memo(Layout2);

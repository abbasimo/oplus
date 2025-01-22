import React, { memo, ReactNode } from 'react';
import { ErrorBoundary } from '@exception/components';
import Suspense from '@layouts/shared-components/Suspense';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import _ from 'lodash';

import FooterLayout3 from './components/FooterLayout3';
import LeftSideLayout3 from './components/LeftSideLayout3';
import NavbarWrapperLayout3 from './components/NavbarWrapperLayout3';
import RightSideLayout3 from './components/RightSideLayout3';
import ToolbarLayout3 from './components/ToolbarLayout3';
import layout3DefaultConfig, { Layout3ConfigType } from './Layout3Config';

const Root = styled('div')<{ config: Layout3ConfigType }>(({ config }) => ({
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

type Layout3Props = {
	children?: ReactNode;
	config?: Layout3ConfigType;
};

/**
 * The layout 3.
 */
function Layout3({ children, config: configFromProps }: Layout3Props) {
	const config = React.useMemo(() => _.merge({}, layout3DefaultConfig, configFromProps ?? {}), [configFromProps]);

	return (
		<Root
			id="remate-layout"
			className="flex w-full"
			config={config}
		>
			{config?.leftSidePanel?.display && <LeftSideLayout3 />}

			<div className="flex min-w-0 flex-auto flex-col">
				<main
					id="remate-main"
					className="relative flex min-h-full min-w-0 flex-auto flex-col"
				>
					{config?.navbar?.display && (
						<NavbarWrapperLayout3
							config={config}
							className={clsx(config?.navbar?.style === 'fixed' ? 'sticky top-0 z-50' : '')}
						/>
					)}

					{config?.toolbar?.display && (
						<ToolbarLayout3
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
						<FooterLayout3 className={config.footer.style === 'fixed' ? 'sticky bottom-0' : ''} />
					)}
				</main>
			</div>

			{config?.rightSidePanel?.display && <RightSideLayout3 />}
		</Root>
	);
}

export default memo(Layout3);

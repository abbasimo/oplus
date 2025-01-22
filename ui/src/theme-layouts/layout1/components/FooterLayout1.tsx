import { memo } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';

type FooterLayout1Props = { className?: string };

/**
 * The footer layout 1.
 */
function FooterLayout1(props: FooterLayout1Props) {
	const { className } = props;

	return (
		<AppBar
			id="remate-footer"
			className={clsx('relative z-20 border-t-1', className)}
			color="default"
			sx={(theme) => ({
				backgroundColor: theme.palette.background.default,
				color: theme.palette.text.primary,
				borderColor: 'divider'
			})}
			elevation={0}
		>
			<Toolbar className="min-h-48 md:min-h-64 px-8 sm:px-12 py-0 flex items-center overflow-x-auto">
				Footer
			</Toolbar>
		</AppBar>
	);
}

export default memo(FooterLayout1);

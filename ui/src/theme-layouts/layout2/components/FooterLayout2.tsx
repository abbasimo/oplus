import { memo } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';

type FooterLayout2Props = {
	className?: string;
};

/**
 * The footer layout 2.
 */
function FooterLayout2(props: FooterLayout2Props) {
	const { className = '' } = props;

	return (
		<AppBar
			id="remate-footer"
			className={clsx('relative z-20 shadow-md', className)}
			color="default"
			sx={{ backgroundColor: 'background.paper' }}
		>
			<Toolbar className="container flex min-h-48 items-center overflow-x-auto px-8 py-0 sm:px-12 md:min-h-64">
				Footer
			</Toolbar>
		</AppBar>
	);
}

export default memo(FooterLayout2);

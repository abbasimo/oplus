import { memo } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';

type FooterLayout3Props = {
	className?: string;
};

/**
 * The footer layout 3.
 */
function FooterLayout3(props: FooterLayout3Props) {
	const { className = '' } = props;

	return (
		<AppBar
			id="remate-footer"
			className={clsx('relative z-20 shadow-md', className)}
			color="inherit"
			sx={{ backgroundColor: 'background.paper' }}
		>
			<Toolbar className="container flex min-h-48 items-center overflow-x-auto px-8 py-0 sm:px-12 md:min-h-64 lg:px-20">
				Footer
			</Toolbar>
		</AppBar>
	);
}

export default memo(FooterLayout3);

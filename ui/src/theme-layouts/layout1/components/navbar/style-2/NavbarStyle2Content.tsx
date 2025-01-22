import { memo } from 'react';
import Logo from '@layouts/shared-components/Logo';
import NavbarToggleButton from '@layouts/shared-components/navbar/NavbarToggleButton';
import Navigation from '@layouts/shared-components/Navigation';
import { Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';

const Root = styled('div')(({ theme }) => ({
	backgroundColor: theme.palette.grey[300],
	color: theme.palette.text.primary,
	'& ::-webkit-scrollbar-thumb': {
		boxShadow: `inset 0 0 0 20px ${
			theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.24)' : 'rgba(255, 255, 255, 0.24)'
		}`
	},
	'& ::-webkit-scrollbar-thumb:active': {
		boxShadow: `inset 0 0 0 20px ${
			theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.37)' : 'rgba(255, 255, 255, 0.37)'
		}`
	}
}));

const StyledContent = styled('div')(() => ({
	overscrollBehavior: 'contain',
	overflowX: 'hidden',
	overflowY: 'auto',
	WebkitOverflowScrolling: 'touch',
	backgroundRepeat: 'no-repeat',
	backgroundSize: '100% 40px, 100% 10px',
	backgroundAttachment: 'local, scroll'
}));

type NavbarStyle2ContentProps = { className?: string };

/**
 * The navbar style 2 content.
 */
function NavbarStyle2Content(props: NavbarStyle2ContentProps) {
	const { className = '' } = props;

	return (
		<Root className={clsx('flex h-full flex-auto flex-col overflow-hidden', className)}>
			<div className="flex h-48 shrink-0 flex-row items-center py-48 px-12 md:h-76">
				<div className="mx-4 flex flex-1">
					<Logo />
				</div>

				<NavbarToggleButton className="h-40 w-40 p-0" />
			</div>

			<Divider
				variant="middle"
				className="mb-48"
			/>

			<StyledContent>
				<Navigation layout="vertical" />
			</StyledContent>
		</Root>
	);
}

export default memo(NavbarStyle2Content);

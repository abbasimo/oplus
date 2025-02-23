import { PiList } from 'react-icons/pi';
import { useMediaQuery } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useAppDispatch } from '@store/hooks';
import { navbarToggle, navbarToggleMobile } from '@store/slices/navbarSlice';

type NavbarToggleButtonProps = {
	className?: string;
	children?: React.ReactNode;
};

/**
 * The navbar toggle button.
 */
function NavbarToggleButton(props: NavbarToggleButtonProps) {
	const { className = '', children = <PiList fontSize={20} /> } = props;

	const dispatch = useAppDispatch();
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));

	return (
		<IconButton
			className={className}
			color="inherit"
			size="small"
			onClick={() => {
				if (isMobile) {
					dispatch(navbarToggleMobile());
				} else {
					dispatch(navbarToggle());
				}
			}}
		>
			{children}
		</IconButton>
	);
}

export default NavbarToggleButton;

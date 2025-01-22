import NavbarToggleFab from '@layouts/shared-components/navbar/NavbarToggleFab';
import { useMediaQuery } from '@mui/material';
import { useAppDispatch } from '@store/hooks';
import { navbarToggle, navbarToggleMobile } from '@store/slices/navbarSlice';

type NavbarToggleFabLayout2Props = {
	className?: string;
};

/**
 * The navbar toggle fab layout 2.
 */
function NavbarToggleFabLayout2(props: NavbarToggleFabLayout2Props) {
	const { className } = props;

	const isMobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));

	const dispatch = useAppDispatch();

	return (
		<NavbarToggleFab
			className={className}
			onClick={() => {
				dispatch(isMobile ? navbarToggleMobile() : navbarToggle());
			}}
		/>
	);
}

export default NavbarToggleFabLayout2;

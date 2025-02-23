import NavbarToggleFab from '@layouts/shared-components/navbar/NavbarToggleFab';
import { useMediaQuery } from '@mui/material';
import { useAppDispatch } from '@store/hooks';
import { navbarToggle, navbarToggleMobile } from '@store/slices/navbarSlice';

import { Layout1ConfigType } from '../Layout1Config';

type NavbarToggleFabLayout1Props = {
	className?: string;
	config: Layout1ConfigType;
};

/**
 * The navbar toggle fab layout 1.
 */
function NavbarToggleFabLayout1(props: NavbarToggleFabLayout1Props) {
	const { className, config } = props;

	const isMobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));

	const dispatch = useAppDispatch();

	return (
		<NavbarToggleFab
			className={className}
			onClick={() => {
				dispatch(isMobile ? navbarToggleMobile() : navbarToggle());
			}}
			position={config?.navbar?.position}
		/>
	);
}

export default NavbarToggleFabLayout1;

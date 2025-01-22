import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from 'react-toastify';
import { GlobalStyles } from '@mui/material';
import { useAppSelector } from '@store/hooks';
import { selectCurrentLanguageDirection } from '@store/slices/i18nSlice';

function ToastNotification() {
	const langDirection = useAppSelector(selectCurrentLanguageDirection);

	return (
		<>
			<GlobalStyles
				styles={(theme) => ({
					'.Toastify__toast': {
						boxShadow: `${theme.shadows[1]} !important`,
						fontSize: theme.typography.body1.fontSize
					},

					'.Toastify__close-button': {
						color: `inherit !important`
					},

					':root': {
						'--toastify-toast-background': `${theme.palette.background.paper} !important`,
						'--toastify-color-light': `${theme.palette.background.paper} !important`,
						'--toastify-color-dark': `${theme.palette.background.paper} !important`,
						'--toastify-color-info': `${theme.palette.info.main} !important`,
						'--toastify-color-success': `${theme.palette.success.main} !important`,
						'--toastify-color-warning': `${theme.palette.warning.main} !important`,
						'--toastify-color-error': `${theme.palette.error.main} !important`,
						'--toastify-text-color-light': `${theme.palette.text.primary} !important`,
						'--toastify-text-color-dark': `${theme.palette.text.primary} !important`,
						'--toastify-text-color-info': `${theme.palette.info.contrastText} !important`,
						'--toastify-text-color-success': `${theme.palette.success.contrastText} !important`,
						'--toastify-text-color-warning': `${theme.palette.warning.contrastText} !important`,
						'--toastify-text-color-error': `${theme.palette.error.contrastText} !important`,
						'--toastify-color-progress-dark': `${theme.palette.primary.main} !important`,
						'--toastify-color-progress-light': `${theme.palette.primary.main} !important`,
						'--toastify-font-family': `${theme.typography.fontFamily} !important`,
						'--toastify-z-index': `9999 !important`
					}
				})}
			/>
			<ToastContainer
				theme="colored"
				position="top-center"
				hideProgressBar
				rtl={langDirection === 'rtl'}
			/>
		</>
	);
}

export default ToastNotification;

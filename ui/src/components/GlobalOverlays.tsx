import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertDialogContainer, DefaultModalContentWrapperComponent, ModalContainer } from 'react-material-overlay';
import { ErrorBoundary } from '@exception/components';

const GlobalOverlays = () => {
	const { t } = useTranslation();

	return (
		<>
			<ModalContainer
				defaultOptions={{
					fullWidth: true,
					closeOnBackdropClick: false,
					contentWrapper: ({ children, ...props }) => (
						<DefaultModalContentWrapperComponent {...props}>
							<ErrorBoundary>{children}</ErrorBoundary>
						</DefaultModalContentWrapperComponent>
					)
				}}
			/>

			<AlertDialogContainer defaultOptions={{ confirmOkText: t`OK`, confirmCancelText: t`CANCEL` }} />
		</>
	);
};

export default memo(GlobalOverlays);

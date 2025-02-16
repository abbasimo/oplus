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
					transitionPreset: 'grow',
					transitionDuration: 350,
					headerProps: {
						titleTypographyProps: {
							variant: 'title3'
						},
						sx: (theme) => ({ ...theme.mixins.borderBottom(1) })
					},
					contentWrapperProps: {
						paddingTop: 2
					},
					contentWrapper: ({ children, ...props }) => (
						<DefaultModalContentWrapperComponent {...props}>
							<ErrorBoundary>{children}</ErrorBoundary>
						</DefaultModalContentWrapperComponent>
					)
				}}
			/>

			<AlertDialogContainer
				defaultOptions={{
					confirmOkText: t`OK`,
					confirmCancelText: t`CANCEL`,
					DialogTitleProps: { variant: 'title3' },
					DialogContentProps: { sx: { typography: 'body2' } },
					maxWidth: 'xs'
				}}
			/>
		</>
	);
};

export default memo(GlobalOverlays);

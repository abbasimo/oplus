import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertDialogContainer, DefaultModalContentWrapperComponent, ModalContainer } from 'react-material-overlay';
import { ErrorBoundary } from '@exception/components';

import Loading from './Loading';

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
					),
					reactSuspenseFallback: <Loading className="py-80" />
				}}
			/>

			<AlertDialogContainer
				defaultOptions={{
					confirmOkText: t`OK`,
					confirmCancelText: t`CANCEL`,
					DialogTitleProps: { variant: 'title3' },
					DialogContentProps: { sx: { typography: 'body2' } },
					maxWidth: 'xs',
					confirmOkButtonProps: { size: 'small' },
					confirmCancelButtonProps: { size: 'small' }
				}}
			/>
		</>
	);
};

export default memo(GlobalOverlays);

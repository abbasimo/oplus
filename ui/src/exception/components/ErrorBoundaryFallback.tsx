import { FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import ExceptionView from '@exception/components/ExceptionView';
import { UnexpectedException, UnsupportedFeatureException } from '@exception/exceptions';
import handleExceptions from '@exception/handleExceptions';

import ErrorVectorImage from './ErrorVectorImage';

function ErrorBoundaryFallback({ error, resetErrorBoundary }: FallbackProps) {
	const exception = handleExceptions(error);
	const { t } = useTranslation();
	const [resetTxt, homePageTxt] = [t('TRY_AGAIN'), t('HOME_PAGE')];

	return (
		<ExceptionView
			retry={resetErrorBoundary}
			exception={exception}
			options={{
				useI18n: true,
				i18nResourceName: 'exceptions',
				imageElement: <ErrorVectorImage />,
				showHomePageButton: exception instanceof UnexpectedException,
				showResetButton: !(exception instanceof UnsupportedFeatureException),
				homePageButtonText: homePageTxt,
				resetButtonText: resetTxt
			}}
		/>
	);
}

export default ErrorBoundaryFallback;

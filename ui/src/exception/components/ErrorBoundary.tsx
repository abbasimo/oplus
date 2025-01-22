import { ErrorBoundary as ErrorBoundaryPackage, ErrorBoundaryPropsWithComponent } from 'react-error-boundary';
import { useLocation } from 'react-router';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

import ErrorBoundaryFallback from './ErrorBoundaryFallback';

type ErrorBoundaryProps = React.PropsWithChildren<Pick<ErrorBoundaryPropsWithComponent, 'onReset' | 'onError'>>;

function ErrorBoundary({ children, onError, onReset }: ErrorBoundaryProps) {
	const location = useLocation();

	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundaryPackage
					onError={onError}
					onReset={(...args) => {
						reset();
						onReset?.(...args);
					}}
					FallbackComponent={ErrorBoundaryFallback}
					resetKeys={[location.pathname]}
				>
					{children}
				</ErrorBoundaryPackage>
			)}
		</QueryErrorResetBoundary>
	);
}

export default ErrorBoundary;

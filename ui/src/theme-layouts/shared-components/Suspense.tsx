import { ReactNode, Suspense as ReactSuspense } from 'react';
import { useLocation } from 'react-router';

import Loading from '../../components/Loading';
import { LoadingProps } from '../../components/Loading';

type SuspenseProps = {
	loadingProps?: LoadingProps;
	children: ReactNode;
};

/**
 * The Suspense component is a wrapper around the React Suspense component.
 * It is used to display a loading spinner while the wrapped components are being loaded.
 * The component is memoized to prevent unnecessary re-renders.
 * React Suspense defaults
 * For to Avoid Repetition
 */
function Suspense(props: SuspenseProps) {
	const { children, loadingProps } = props;
	const location = useLocation();

	return (
		<ReactSuspense
			key={location.key}
			fallback={<Loading {...loadingProps} />}
		>
			{children}
		</ReactSuspense>
	);
}

export default Suspense;

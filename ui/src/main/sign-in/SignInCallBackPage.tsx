import { useEffect } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import SplashScreen from '@components/SplashScreen';
import { useAuth } from '@remate/core';

/**
 * The sign in page.
 */
function SignInCallBackPage() {
	const { showBoundary } = useErrorBoundary();
	const { signIn } = useAuth();

	useEffect(() => {
		signIn('sso').catch((err) => {
			showBoundary(err);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showBoundary]);

	return <SplashScreen />;
}

export default SignInCallBackPage;

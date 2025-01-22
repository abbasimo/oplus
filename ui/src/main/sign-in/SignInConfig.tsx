import React from 'react';
import { RemateRoutesType } from '@remate/core';

import SignInPage from './SignInPage';

const SignInCallBackPage = React.lazy(() => import('./SignInCallBackPage'));

const SignInConfig: RemateRoutesType = [
	{
		path: 'sign-in',
		title: 'SIGN_IN',
		children: [
			{ index: true, element: <SignInPage /> },
			{ path: 'cb', element: <SignInCallBackPage /> }
		]
	}
];

export default SignInConfig;

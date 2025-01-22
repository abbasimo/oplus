import { RemateRoutesType } from '@remate/core';

import SignUpPage from './SignUpPage';

const SignUpConfig: RemateRoutesType = [
	{
		path: 'sign-up',
		title: 'SIGN_UP',
		element: <SignUpPage />
	}
];

export default SignUpConfig;

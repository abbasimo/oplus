import { Navigate } from 'react-router';
import { authPrivileges } from '@auth';
import Error404Page from '@main/404/Error404Page';
import ExampleConfig from '@main/example/ExampleConfig';
import SignInConfig from '@main/sign-in/SignInConfig';
import SignUpConfig from '@main/sign-up/SignUpConfig';
import { RemateRoutesType } from '@remate/core';

/**
 * The routes of the application.
 */
const routes: RemateRoutesType = [
	/**
	 * with home page
	 */
	// {
	// 	path: '/',
	// 	element: <Home />,
	// 	title: 'HOME',
	// 	auth: settingsConfig.defaultAuth,
	// 	children: [...routes]
	// },

	/**
	 * without home page
	 */
	{
		path: '/',
		element: <Navigate to="/example" />,
		auth: authPrivileges.user
	},

	{
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		},
		isNavigable: false,
		auth: authPrivileges.onlyGuest,
		children: [...SignInConfig, ...SignUpConfig]
	},

	...ExampleConfig,

	{
		path: '*',
		auth: authPrivileges.user,
		title: 'PAGE_NOT_FOUND',
		isNavigable: false,
		element: <Error404Page />
	}
];

export default routes;

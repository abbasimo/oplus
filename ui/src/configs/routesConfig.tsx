import { Navigate } from 'react-router';
import { authPrivileges } from '@auth';
import Error404Page from '@main/404/Error404Page';
import ServiceHealthConfig from '@main/service-health/ServiceHealthConfig';
import SignInConfig from '@main/sign-in/SignInConfig';
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
		element: <Navigate to="/service-health" />,
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
		children: [...SignInConfig]
	},

	...ServiceHealthConfig,

	{
		path: '*',
		auth: authPrivileges.user,
		title: 'PAGE_NOT_FOUND',
		isNavigable: false,
		element: <Error404Page />
	}
];

export default routes;

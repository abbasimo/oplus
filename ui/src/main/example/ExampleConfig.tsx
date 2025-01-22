import { lazy } from 'react';
import { authPrivileges } from '@auth';
import i18n from '@i18n';
import { RemateRoutesType } from '@remate/core';

import en from './i18n/en';
import fa from './i18n/fa';

i18n.addResourceBundle('en', 'exampleFeature', en);
i18n.addResourceBundle('fa', 'exampleFeature', fa);

const Example = lazy(() => import('./Example'));
const ExampleDetailsPage = lazy(() => import('./ExampleDetailsPage'));
const ExampleNestedPage = lazy(() => import('./ExampleNestedPage'));

/**
 * The Example page config.
 */
const ExampleConfig: RemateRoutesType = [
	{
		auth: authPrivileges.user,
		path: 'example',
		title: 'EXAMPLE',
		id: 'example-main',
		children: [
			{
				// main page
				index: true,
				element: <Example />
			},
			{
				// danamic title
				path: ':id',
				dynamicTitle: true,
				id: 'example-details',
				children: [
					{
						index: true,
						auth: authPrivileges.staff,
						element: <ExampleDetailsPage />
					},
					{
						path: 'nested',
						element: <ExampleNestedPage />,
						title: 'EXAMPLE_NESTED',
						auth: authPrivileges.admin,
						id: 'example-nested'
					}
				]
			}
		]
	}
];

export default ExampleConfig;

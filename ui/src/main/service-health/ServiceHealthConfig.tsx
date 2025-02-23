import React from 'react';
import authPrivileges from '@auth/authPrivileges';
import { RemateRoutesType } from '@remate/core';

const ServiceHealthPage = React.lazy(() => import('./pages/ServiceHealth/ServiceHealthPage'));

const ServiceHealthConfig: RemateRoutesType = [
	{
		auth: authPrivileges.admin,
		path: 'service-health',
		title: 'SERVICE_HEALTH',
		element: <ServiceHealthPage />
	}
];

export default ServiceHealthConfig;

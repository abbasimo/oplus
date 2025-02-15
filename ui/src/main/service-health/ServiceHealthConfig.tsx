import React from 'react';
import { RemateRoutesType } from '@remate/core';

const ServiceHealthPage = React.lazy(() => import('./pages/ServiceHealth'));

const ServiceHealthConfig: RemateRoutesType = [
	{
		path: 'service-health',
		title: 'SERVICE_HEALTH',
		element: <ServiceHealthPage />
	}
];

export default ServiceHealthConfig;

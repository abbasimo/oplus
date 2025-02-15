import { apiService } from '@api/apiService';

import { IEnviroment, IEnviromentDetails } from './types';

export const { useAllEnvsQuery, useEnvDetailsQuery } = apiService.buildEndpoints((build) => ({
	allEnvs: build.query<IEnviroment[]>({
		queryKey: ['envs'],
		query: '/envs',
		transformResponse(baseQueryReturnValue: { environments: IEnviroment[] }) {
			return baseQueryReturnValue.environments;
		}
	}),
	envDetails: build.query<IEnviromentDetails, number>({
		queryKey: (envId) => ['envs', envId],
		query: (envId) => `/envs/${envId}`,
		transformResponse(baseQueryReturnValue: { environment: IEnviromentDetails }) {
			return baseQueryReturnValue.environment;
		}
	})
}));

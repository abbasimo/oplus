import { apiService } from '@api/apiService';

import { ICreateEnvPayload, IEnviroment, IEnviromentDetails, IUpdateEnvPayload } from './types';

export const { useAllEnvsQuery, useEnvDetailsQuery, useCreateEnvMutation, useUpdateEnvMutation, useDeleteEnvMutation } =
	apiService.buildEndpoints((build) => ({
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
		}),
		createEnv: build.mutation<IEnviroment, ICreateEnvPayload>({
			query: ({ title, description }) => ({
				url: '/envs',
				method: 'POST',
				data: { title, description }
			}),
			invalidates: [['envs']]
		}),
		updateEnv: build.mutation<void, IUpdateEnvPayload>({
			query: ({ envId, values }) => ({
				url: `/envs/${envId}`,
				method: 'PATCH',
				data: values
			}),
			invalidates: [['envs']],
			optimisticUpdate: [
				{
					queryKey: ['envs'],
					generateUpdatedData({ envId, values }, previusData: IEnviroment[]) {
						return previusData.map((env) => (env.id === envId ? { ...env, ...values } : env));
					}
				},
				{
					queryKey: ({ envId }) => ['envs', envId],
					generateUpdatedData: ({ values }, previusData: IEnviromentDetails) => ({
						...previusData,
						...values
					})
				}
			]
		}),
		deleteEnv: build.mutation<void, number>({
			query: (envId) => ({ url: `/envs/${envId}`, method: 'DELETE' }),
			invalidates: [['envs']],
			optimisticUpdate: [
				{
					queryKey: ['envs'],
					generateUpdatedData(envId, previusData: IEnviroment[]) {
						return previusData.filter((env) => env.id !== envId);
					}
				}
			]
		})
	}));

import { apiService } from '@api/apiService';

import { ICreateEnvPayload, IEnvironment, IEnvironmentDetails, IUpdateEnvPayload } from './types';

export const { useAllEnvsQuery, useEnvDetailsQuery, useCreateEnvMutation, useUpdateEnvMutation, useDeleteEnvMutation } =
	apiService.buildEndpoints((build) => ({
		allEnvs: build.query<IEnvironment[]>({
			queryKey: ['envs'],
			query: '/envs',
			transformResponse(baseQueryReturnValue: { environments: IEnvironment[] }) {
				return baseQueryReturnValue.environments;
			}
		}),
		envDetails: build.query<IEnvironmentDetails, number>({
			queryKey: (envId) => ['envs', envId],
			query: (envId) => `/envs/${envId}`,
			transformResponse(baseQueryReturnValue: { environment: IEnvironmentDetails }) {
				return baseQueryReturnValue.environment;
			}
		}),
		createEnv: build.mutation<IEnvironment, ICreateEnvPayload>({
			query: ({ title, description }) => ({
				url: '/envs',
				method: 'POST',
				data: { title, description }
			}),
			invalidates: [['envs']],
			transformResponse(baseQueryReturnValue: { environment: IEnvironment }) {
				return baseQueryReturnValue.environment;
			},
			optimisticUpdate: [
				{
					queryKey: ['envs'],
					mode: 'onSuccess',
					generateUpdatedData(data, previusData: IEnvironment[]) {
						return [...previusData, data];
					}
				}
			]
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
					generateUpdatedData({ envId, values }, previusData: IEnvironment[]) {
						return previusData.map((env) => (env.id === envId ? { ...env, ...values } : env));
					}
				},
				{
					queryKey: ({ envId }) => ['envs', envId],
					generateUpdatedData: ({ values }, previusData: IEnvironmentDetails) => ({
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
					generateUpdatedData(envId, previusData: IEnvironment[]) {
						return previusData.filter((env) => env.id !== envId);
					}
				}
			]
		})
	}));

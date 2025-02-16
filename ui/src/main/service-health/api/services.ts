import { apiService } from '@api/apiService';

import {
	ICreateServicePayload,
	IDeleteServicePayload,
	IEnviromentDetails,
	IService,
	IServiceDetailsPayload,
	IUpdateServicePayload,
	ServiceOutages
} from './types';

export const {
	useServiceDetailsQuery,
	useServiceOutagesQuery,
	useCreateServiceMutation,
	useDeleteServiceMutation,
	useUpdateServiceMutation
} = apiService.buildEndpoints((build) => ({
	serviceDetails: build.query<IService, IServiceDetailsPayload>({
		queryKey: ({ serviceId }) => ['services', serviceId],
		query: ({ envId, serviceId }) => `/envs/${envId}/services/${serviceId}`,
		transformResponse(baseQueryReturnValue: { service: IService }) {
			return baseQueryReturnValue.service;
		}
	}),
	serviceOutages: build.query<ServiceOutages, IServiceDetailsPayload>({
		queryKey: ({ serviceId }) => ['serviceOutages', serviceId],
		query: ({ envId, serviceId }) => `/envs/${envId}/services/${serviceId}/outages`,
		transformResponse(baseQueryReturnValue: { outage: ServiceOutages }) {
			return baseQueryReturnValue.outage;
		}
	}),
	createService: build.mutation<void, ICreateServicePayload>({
		query: ({ envId, values }) => ({ url: `/envs/${envId}/services`, data: values, method: 'POST' }),
		invalidates: (_, { envId }) => [['envs', envId]]
	}),
	updateService: build.mutation<void, IUpdateServicePayload>({
		query: ({ envId, serviceId, values }) => ({
			url: `/envs/${envId}/services/${serviceId}`,
			data: values,
			method: 'PATCH'
		}),
		invalidates: (_, { envId, serviceId }) => [
			['envs', envId],
			['services', serviceId]
		],
		optimisticUpdate: [
			{
				queryKey: ({ envId }) => ['envs', envId],
				generateUpdatedData({ serviceId, values }, previusData: IEnviromentDetails) {
					const services = previusData.services.map((service) =>
						service.id === serviceId ? { ...service, ...values } : service
					);

					return { ...previusData, services };
				}
			},
			{
				queryKey: ({ serviceId }) => ['services', serviceId],
				generateUpdatedData({ values }, previusData: IService) {
					return { ...previusData, ...values };
				}
			}
		]
	}),
	deleteService: build.mutation<void, IDeleteServicePayload>({
		query: ({ envId, serviceId }) => ({
			url: `/envs/${envId}/services/${serviceId}`,
			method: 'DELETE'
		}),
		invalidates: (_, { envId, serviceId }) => [
			['envs', envId],
			['services', serviceId]
		],
		optimisticUpdate: [
			{
				queryKey: ({ envId }) => ['envs', envId],
				generateUpdatedData({ serviceId }, previusData: IEnviromentDetails) {
					const services = previusData.services.filter((service) => service.id !== serviceId);

					return { ...previusData, services };
				}
			}
		]
	})
}));

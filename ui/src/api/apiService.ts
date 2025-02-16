import { handleExceptions } from '@exception';
import i18n from '@i18n';
import { BaseQueryFn, createApi } from '@remate/core';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const axiosBaseQuery =
	(): BaseQueryFn<string | AxiosRequestConfig, unknown, AxiosError> =>
	async (args, { signal }) => {
		try {
			const result = await axios({ signal, ...(typeof args === 'string' ? { url: args } : args) });

			return { data: result.data };
		} catch (axiosError) {
			const error = axiosError as AxiosError;

			return {
				error
			};
		}
	};

export const apiService = createApi({
	baseQuery: axiosBaseQuery(),
	defaultOptions: {
		query: {
			throwOnError: true
		},
		mutation: {
			errorNotification: (error) => {
				if (axios.isCancel(error)) {
					return false;
				}

				const exception = handleExceptions(error);

				return i18n.t(exception.message, {
					ns: 'exceptions'
				});
			},
			successNotification: () => 'عملیات با موفقیت انجام شد!',
			cancelOnUnmount: false
		},
		infiniteQuery: {
			throwOnError: true
		}
	}
});

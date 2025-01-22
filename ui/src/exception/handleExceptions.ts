import { isAxiosError } from 'axios';

import Exception from './Exception';
import {
	NetworkConnectionException,
	ServerUnexpectedException,
	TimeoutException,
	UnexpectedException
} from './exceptions';

export default function handleExceptions(error: any): Exception {
	if (error instanceof Exception) {
		return error;
	}

	if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
		return new NetworkConnectionException();
	}

	if (error.code === 'ECONNABORTED') {
		return new TimeoutException();
	}

	if (isAxiosError(error)) {
		if (Array.isArray(error?.response?.data)) {
			return new Exception({
				message: error?.response?.data[0]
			});
		}

		return new ServerUnexpectedException();
	}

	return new UnexpectedException();
}

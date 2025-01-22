/* eslint-disable max-classes-per-file */
import Exception from './Exception';

export class UnexpectedException extends Exception {
	constructor() {
		super({
			message: 'UNEXPECTED_ERROR_TITLE',
			desc: 'UNEXPECTED_ERROR_SUBTITLE'
		});
	}
}

export class NetworkConnectionException extends Exception {
	constructor() {
		super({
			message: 'NETWORK_CONNECTION_ERROR_TITLE',
			desc: 'NETWORK_CONNECTION_ERROR_SUBTITLE'
		});
	}
}

export class TimeoutException extends Exception {
	constructor() {
		super({
			message: 'TIMEOUT_ERROR_TITLE',
			desc: 'TIMEOUT_ERROR_SUBTITLE'
		});
	}
}

export class UnsupportedFeatureException extends Exception {
	constructor() {
		super({
			message: 'UNSUPPORTED_FEATURE_ERROR_TITLE',
			desc: 'UNSUPPORTED_FEATURE_ERROR_SUBTITLE'
		});
	}
}

export class ServerUnexpectedException extends Exception {
	constructor() {
		super({
			message: 'SERVER_UNEXPECTED_ERROR_TITLE',
			desc: 'SERVER_UNEXPECTED_ERROR_SUBTITLE'
		});
	}
}

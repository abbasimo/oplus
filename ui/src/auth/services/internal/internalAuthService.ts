import { SecureLocalStorage } from '@remate/core';
import axios, { isAxiosError } from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { PartialDeep } from 'type-fest';

import { User } from '../../user';

import internalAuthConfig from './internalAuthConfig';

export type SignInPayload = {
	email: string;
	password: string;
};

export type SignUpPayload = {
	displayName: string;
	password: string;
	email: string;
};

export type InternalAuthConfig = {
	signInUrl: string;
	signUpUrl: string;
	getUserUrl: string;
	updateUserUrl: string;
};

/**
 * Sets the session by storing the access token in the local storage and setting the default authorization header.
 */
function setSession(access_token: string | null) {
	if (access_token) {
		setAccessToken(access_token);
		axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
	} else {
		removeAccessToken();
		delete axios.defaults.headers.common.Authorization;
	}
}

/**
 * Checks if the access token is valid.
 */
function isAuthTokenValid(access_token: string | null) {
	if (!access_token) {
		return false;
	}

	try {
		const decoded = jwtDecode<JwtPayload>(access_token);

		const currentTime = Date.now() / 1000;

		if (decoded.exp! < currentTime) {
			// eslint-disable-next-line no-console
			console.warn('access token expired');
			return false;
		}

		return true;
	} catch {
		return false;
	}
}

/**
 * Gets the access token from the local storage.
 */
function getAccessToken() {
	return SecureLocalStorage.getItem<string>('access_token');
}

/**
 * Sets the access token in the local storage.
 */
function setAccessToken(access_token: string) {
	return SecureLocalStorage.setItem('access_token', access_token);
}

let interceptorId: number;

/**
 * Removes the access token from the local storage.
 */
function removeAccessToken() {
	return SecureLocalStorage.removeItem('access_token');
}

export default {
	async signIn(credentials: SignInPayload) {
		const {
			data: { user, access_token }
		} = await axios.post<{ user: User; access_token: string }>(internalAuthConfig.signInUrl, credentials);

		setSession(access_token);
		return user;
	},
	async signUp(data: SignUpPayload) {
		const {
			data: { user, access_token }
		} = await axios.post<{ user: User; access_token: string }>(internalAuthConfig.signUpUrl, data);

		setSession(access_token);
		return user;
	},
	signOut() {
		setSession(null);
	},
	checkAuth() {
		const accessToken = getAccessToken();

		const isAuthenticated = isAuthTokenValid(accessToken);

		if (isAuthenticated) {
			setSession(accessToken);
		} else {
			setSession(null);
		}

		return isAuthenticated;
	},
	async getUser() {
		const accessToken = getAccessToken();

		const { data: userData } = await axios.get<User>(internalAuthConfig.getUserUrl, {
			headers: { Authorization: `Bearer ${accessToken}` }
		});

		return userData;
	},
	async updateUser(userData: PartialDeep<User>) {
		const { data: updatedUserData } = await axios.put<User>(internalAuthConfig.updateUserUrl, userData);

		return updatedUserData;
	},
	resetSession() {
		setSession(null);
	},
	addInterceptors(resetAuth: () => void) {
		interceptorId = axios.interceptors.response.use(
			(response) => response,
			async (error) => {
				if (isAxiosError(error) && error.response?.status === 401) {
					resetAuth();
				}

				return Promise.reject(error);
			}
		);
	},
	ejectInterceptors() {
		if (interceptorId) {
			axios.interceptors.response.eject(interceptorId);
		}
	}
};

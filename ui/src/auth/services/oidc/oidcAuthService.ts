import axios, { isAxiosError } from 'axios';
import { UserManager } from 'oidc-client-ts';
import { PartialDeep } from 'type-fest';

import authPrivileges from '../../authPrivileges';
import { User, UserModel } from '../../user';

import oidcAuthConfig from './oidcAuthConfig';

const userManager = new UserManager(oidcAuthConfig);

function setSession(access_token: string | null) {
	if (access_token) {
		axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
	} else {
		delete axios.defaults.headers.common.Authorization;
	}
}

let interceptorId: number;

export default {
	signInRedirect() {
		return userManager.signinRedirect({ login_hint: 'honeydi.mh@gmail.com' });
	},
	async signInCallback() {
		const user = await userManager.signinCallback();

		setSession(user!.access_token);

		return UserModel({
			role: authPrivileges.admin,
			data: user!.profile
		});
	},
	signOutRedirect() {
		return userManager.signoutRedirect();
	},
	async signOutCallback() {
		await userManager.signoutCallback();
	},
	async checkAuth() {
		try {
			const user = await userManager.getUser();
			const authenticated = !!user && !user.expired;

			if (authenticated) {
				setSession(user.access_token);
			} else {
				userManager.clearStaleState();
				await userManager.removeUser();
				setSession(null);
			}

			return {
				authenticated,
				user: UserModel({
					role: authPrivileges.admin,
					data: user!.profile
				})
			};
		} catch {
			return {
				authenticated: false
			};
		}
	},
	async getUser() {
		const user = await userManager.getUser();

		return UserModel({
			role: authPrivileges.admin,
			data: user!.profile
		});
	},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async updateUser(userData: PartialDeep<User>) {
		throw new Error('not implemented!');
	},
	async resetSession() {
		userManager.clearStaleState();
		setSession(null);
		await userManager.removeUser();
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

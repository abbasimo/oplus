import { IAuthProviderAdapter } from '@remate/core';

import { User } from '../../user';

import oidcAuthService from './oidcAuthService';

const oidcAuthProvider: IAuthProviderAdapter<User, User['role']> = {
	methodName: 'sso',
	signIn: async () => {
		const user = await oidcAuthService.signInCallback();

		return {
			user
		};
	},
	getUserPrivileges: (user) => user.role,
	check: async () => {
		const { authenticated, user } = await oidcAuthService.checkAuth();

		return {
			authenticated,
			user
		};
	},
	getUser: () => oidcAuthService.getUser(),
	signOut: async () => {
		await oidcAuthService.signOutRedirect();
		return { logout: true };
	},
	updateUser: (userData) => oidcAuthService.updateUser(userData),

	onAuthenticated: (resetAuth) => {
		oidcAuthService.addInterceptors(resetAuth);
	},
	onUnAuthenticated: async () => {
		await oidcAuthService.resetSession();
		oidcAuthService.ejectInterceptors();
	}
};

export default oidcAuthProvider;

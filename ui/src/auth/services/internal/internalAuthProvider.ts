import { IAuthProviderAdapter } from '@remate/core';

import { User } from '../../user';

import internalAuthService, { SignInPayload, SignUpPayload } from './internalAuthService';

const internalAuthProvider: IAuthProviderAdapter<User, User['role']> = {
	methodName: 'internal',
	signIn: async (credentials: SignInPayload) => {
		const user = await internalAuthService.signIn(credentials);

		return { user };
	},
	signUp: async (data: SignUpPayload) => {
		const user = await internalAuthService.signUp(data);

		return { user };
	},
	check: async () => {
		const authenticated = internalAuthService.checkAuth();

		return { authenticated };
	},
	getUser: () => internalAuthService.getUser(),
	signOut: () => {
		internalAuthService.signOut();

		return { logout: true };
	},
	updateUser: (userData) => internalAuthService.updateUser(userData),
	getUserPrivileges: (user) => user.role,

	onAuthenticated: (resetAuth) => {
		internalAuthService.addInterceptors(resetAuth);
	},
	onUnAuthenticated: () => {
		internalAuthService.resetSession();
		internalAuthService.ejectInterceptors();
	}
};

export default internalAuthProvider;

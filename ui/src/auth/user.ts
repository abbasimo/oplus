import _ from 'lodash';
import { PartialDeep } from 'type-fest';

export type User = {
	uid: string;
	role: string[] | string | null;
	data: {
		displayName: string;
		photoURL?: string;
		email?: string;
		shortcuts?: string[];
		loginRedirectUrl?: string; // The URL to redirect to after login.
	};
};

export function UserModel(data: PartialDeep<User>): User {
	data = data || {};

	return _.defaults(data, {
		uid: '',
		role: null, // guest
		data: {
			displayName: 'Guest User',
			photoURL: '',
			email: '',
			shortcuts: []
		}
	});
}

export const initialUserState = UserModel({});

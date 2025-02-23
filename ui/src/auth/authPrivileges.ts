/**
 * The authPrivileges(Roles/Claims) object defines the authorization privileges for the Remate application.
 */
const authPrivileges = {
	/**
	 * The admin role grants access to users with the 'admin' role.
	 */
	admin: ['admin'],

	/**
	 * The staff role grants access to users with the 'admin' or 'staff' role.
	 */
	staff: ['admin', 'staff'],

	/**
	 * The user role grants access to users with the 'admin', 'staff', or 'user' role.
	 */
	user: ['admin', 'staff', 'user'],

	/**
	 * The onlyGuest privilege grants access to unauthenticated users.
	 */
	onlyGuest: []
};

export default authPrivileges;

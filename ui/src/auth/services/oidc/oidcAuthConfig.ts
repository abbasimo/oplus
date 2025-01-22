import appSetting from '@configs/appSetting';
import { UserManagerSettings, WebStorageStateStore } from 'oidc-client-ts';

const oidcAuthConfig: UserManagerSettings = {
	authority: appSetting.oidc.authority,
	redirect_uri: `${window.location.origin}/sign-in/cb`,
	post_logout_redirect_uri: `${window.location.origin}/sign-in`,
	client_id: appSetting.oidc.clientId,
	response_type: 'code',
	scope: 'profile openid',
	client_secret: 'secret',
	userStore: new WebStorageStateStore({ store: window.localStorage })
};

export default oidcAuthConfig;

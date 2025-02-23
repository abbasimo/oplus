const appSetting = {
	mode: import.meta.env.MODE as 'production' | 'development' | 'staging',
	apiBaseURL: import.meta.env.VITE_API_BASEURL,
	oidc: {
		authority: import.meta.env.VITE_OIDC_AUTHORITY,
		clientId: import.meta.env.VITE_OIDC_CLIENT_ID
	}
};

export default appSetting;

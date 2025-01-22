/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_BASEURL: string;
	readonly VITE_OIDC_AUTHORITY: string;
	readonly VITE_OIDC_CLIENT_ID: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
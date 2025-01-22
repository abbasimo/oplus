import internalAuthProvider from './services/internal/internalAuthProvider';
import oidcAuthProvider from './services/oidc/oidcAuthProvider';

const authProviders = [internalAuthProvider, oidcAuthProvider];

export default authProviders;

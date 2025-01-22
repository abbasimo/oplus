import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { authProviders } from '@auth';
import { initialUserState } from '@auth/user';
import DocumentTitleHandler from '@components/DocumentTitleHandler';
import GlobalOverlays from '@components/GlobalOverlays';
import SplashScreen from '@components/SplashScreen';
import { notificationProvider, ToastNotification } from '@components/toastNotification';
import appSetting from '@configs/appSetting';
import routes from '@configs/routesConfig';
import { RemateComponentsLocalizationProvider } from '@contexts/localization';
import MockAdapterProvider from '@contexts/mock-api';
import ThemeProvider from '@contexts/ThemeProvider';
import { GlobalErrorBoundary } from '@exception/components';
import themeLayouts from '@layouts/themeLayouts';
import { CssBaseline } from '@mui/material';
import { Remate, SecureLocalStorage } from '@remate/core';
import store from '@store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';

/**
 * Axios HTTP Request defaults
 */
axios.defaults.baseURL = appSetting.apiBaseURL;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

/**
 * SecureLocalStorage config
 */
SecureLocalStorage.config.encrypt = appSetting.mode === 'production';

/**
 * ReactQuery config
 */
const queryClient = new QueryClient();

/**
 * The main App component.
 */
function App() {
	return (
		<GlobalErrorBoundary>
			<BrowserRouter>
				<Provider store={store}>
					<QueryClientProvider client={queryClient}>
						<MockAdapterProvider>
							<ThemeProvider>
								<RemateComponentsLocalizationProvider>
									<Remate
										routes={routes}
										notificationProvider={notificationProvider}
										layouts={themeLayouts}
										defaultLayoutStyle="layout1"
										initialUserState={initialUserState}
										authProviders={authProviders}
										checkAuthFallback={<SplashScreen />}
										signInPageUrl="/sign-in"
										loginRedirectUrl="/"
									>
										<DocumentTitleHandler />
										<GlobalOverlays />
									</Remate>

									<CssBaseline />
									<ToastNotification />
								</RemateComponentsLocalizationProvider>
							</ThemeProvider>
						</MockAdapterProvider>
					</QueryClientProvider>
				</Provider>
			</BrowserRouter>
		</GlobalErrorBoundary>
	);
}

export default App;

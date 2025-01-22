import '@styles/app-base.css';
import '@styles/app-components.css';
import '@styles/app-utilities.css';
import './i18n';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

// import * as serviceWorker from './serviceWorker';
// import reportWebVitals from './reportWebVitals';

/**
 * The root element of the application.
 */
const container = document.getElementById('root');

if (!container) {
	throw new Error('Failed to find the root element');
}

/**
 * The root component of the application.
 */
const root = createRoot(container);

root.render(
	<StrictMode>
		<App />
	</StrictMode>
);

// reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();

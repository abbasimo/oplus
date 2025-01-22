import { useEffect, useRef, useState } from 'react';
import SplashScreen from '@components/SplashScreen';
import { useAppDispatch } from '@store/hooks';
import axios from 'axios';

import { authApiMocks } from './api/auth-api';
import ExtendedMockAdapter from './ExtendedMockAdapter';

const mockAdapterOptions = {
	delayResponse: 0
};

const baseURL = '/mock-api';

type MockAdapterProviderProps = {
	enabled?: boolean;
	children: React.ReactNode;
};

const mock = new ExtendedMockAdapter(axios, mockAdapterOptions, baseURL);

function MockAdapterProvider(props: MockAdapterProviderProps) {
	const { enabled = true, children } = props;
	const [loading, setLoading] = useState(true);
	const dispatch = useAppDispatch();
	const isInitialMount = useRef(true);
	useEffect(() => {
		const setupAllMocks = () => {
			[authApiMocks].forEach((mockSetup) => {
				mockSetup(mock);
			});
		};

		if (enabled) {
			setupAllMocks();
			mock.onAny().passThrough();
		} else {
			mock.restore();
		}

		setLoading(false);

		return () => {
			if (!enabled && mock) {
				mock.restore();
			}

			setLoading(false);
		};
	}, [enabled]);

	useEffect(() => {
		if (import.meta.hot) {
			isInitialMount.current = false;
		}
	}, [dispatch]);

	return loading ? <SplashScreen /> : children;
}

export default MockAdapterProvider;

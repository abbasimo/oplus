import { combineSlices } from '@reduxjs/toolkit';
import { i18nSlice } from '@store/slices/i18nSlice';
import { navigationSlice } from '@store/slices/navigationSlice';

import { navbarSlice } from './slices/navbarSlice';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LazyLoadedSlices {}

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
export const rootReducer = combineSlices(
	/**
	 * Static slices
	 */
	i18nSlice,
	navigationSlice,
	navbarSlice
	/**
	 * Dynamic slices
	 */
).withLazyLoadedSlices<LazyLoadedSlices>();

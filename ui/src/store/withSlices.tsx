import React from 'react';
import { Reducer, Slice } from '@reduxjs/toolkit';

import generateReducersFromSlices from './generateReducersFromSlices';
import { rootReducer } from './lazyLoadedSlices';

export type SlicesType = Slice[];

/**
 * Injects reducers grouped by common key.
 */
export const injectReducersGroupedByCommonKey = async (slices: SlicesType) => {
	const reducers = generateReducersFromSlices(slices);

	if (reducers) {
		Object.keys(reducers).forEach((key) => {
			const reducer = (reducers as any)[key] as Reducer;

			if (!key || !reducer) {
				return;
			}

			rootReducer.inject(
				{
					reducerPath: key,
					reducer
				},
				{
					overrideExisting: true
				}
			);
		});
	}

	return true;
};

/**
 * A Higher Order Component that injects reducers for the provided slices.
 */
const withSlices =
	<P extends object>(slices: SlicesType) =>
	(WrappedComponent: React.FC<P>) => {
		injectReducersGroupedByCommonKey(slices);

		return function WithInjectedReducer(props: P) {
			return <WrappedComponent {...props} />;
		};
	};

export default withSlices;

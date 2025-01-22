import { DeepPartial } from 'react-hook-form';
import { combineReducers, Reducer, ReducersMapObject } from '@reduxjs/toolkit';
import { SlicesType } from '@store/withSlices';

export const generateReducersFromSlices = <T = unknown>(slices: SlicesType): ReducersMapObject<T> => {
	const reducerGroups: DeepPartial<ReducersMapObject> = {};

	// Group reducers based on common key derived from slice name.
	slices?.forEach((slice) => {
		const [primary, secondary] = slice.name.split('/');

		if (secondary) {
			if (!reducerGroups[primary]) {
				reducerGroups[primary] = {};
			}

			(reducerGroups[primary] as any)[secondary] = slice.reducer;
		} else {
			reducerGroups[primary] = slice.reducer;
		}
	});

	const combinedReducers: any = {};

	// Combine the grouped reducers.
	Object.entries(reducerGroups).forEach(([key, reducerGroup]) => {
		if (typeof reducerGroup === 'function') {
			combinedReducers[key] = reducerGroup as Reducer;
		} else if (typeof reducerGroup === 'object') {
			combinedReducers[key] = combineReducers(reducerGroup);
		}
	});

	return combinedReducers as unknown as ReducersMapObject<T>;
};
export default generateReducersFromSlices;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store/index';
import { merge } from 'lodash';
import { PartialDeep } from 'type-fest';

interface IViewTabState {
	selectedEnv?: number;
	searchValue: string;
	selectedStatus: string;
}

interface ISettingTabState {
	selectedEnv: number | null;
	searchValue: string;
	selectedStatus: string;
}

interface serviceHealthState {
	viewTab: IViewTabState;
	settingTab: ISettingTabState;
}

const initialState: serviceHealthState = {
	viewTab: {
		searchValue: '',
		selectedStatus: 'all'
	},
	settingTab: {
		selectedEnv: null,
		searchValue: '',
		selectedStatus: 'all'
	}
};

export const serviceHealthSlice = createSlice({
	name: 'serviceHealth',
	initialState: initialState,
	reducers: {
		setServiceHealthState(state, action: PayloadAction<PartialDeep<serviceHealthState>>) {
			return merge({}, state, action.payload);
		}
	}
});

export const selectServiceHealthViewTabState = (state: RootState) => state.serviceHealth.viewTab;
export const selectServiceHealthSettingTabState = (state: RootState) => state.serviceHealth.settingTab;

export const { setServiceHealthState } = serviceHealthSlice.actions;

export default serviceHealthSlice.reducer;

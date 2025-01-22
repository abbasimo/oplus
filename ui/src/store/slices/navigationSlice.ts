import navigationConfig from '@configs/navigationConfig';
import NavItemModel from '@layouts/shared-components/navigation/models/NavItemModel';
import NavigationHelper from '@layouts/shared-components/navigation/NavigationHelper';
import { FlatNavItemType, NavItemType } from '@layouts/shared-components/navigation/types/NavItemType';
import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestedPrivileges } from '@remate/core';
import { AppThunk, RootState } from '@store';
import { selectCurrentLanguageId } from '@store/slices/i18nSlice';
import i18next from 'i18next';
import { PartialDeep } from 'type-fest';

const navigationAdapter = createEntityAdapter<FlatNavItemType>();

const emptyInitialState = navigationAdapter.getInitialState([]);

const initialState = navigationAdapter.upsertMany(
	emptyInitialState,
	NavigationHelper.flattenNavigation(navigationConfig)
);

/**
 * Redux Thunk actions related to the navigation store state
 */
/**
 * Appends a navigation item to the navigation store state.
 */
export const appendNavigationItem =
	(item: NavItemType, parentId?: string | null): AppThunk =>
	async (dispatch, getState) => {
		const AppState = getState();
		const navigation = NavigationHelper.unflattenNavigation(selectNavigationAll(AppState));

		dispatch(setNavigation(NavigationHelper.appendNavItem(navigation, NavItemModel(item), parentId)));

		return Promise.resolve();
	};

/**
 * Prepends a navigation item to the navigation store state.
 */
export const prependNavigationItem =
	(item: NavItemType, parentId?: string | null): AppThunk =>
	async (dispatch, getState) => {
		const AppState = getState();
		const navigation = NavigationHelper.unflattenNavigation(selectNavigationAll(AppState));

		dispatch(setNavigation(NavigationHelper.prependNavItem(navigation, NavItemModel(item), parentId)));

		return Promise.resolve();
	};

/**
 * Adds a navigation item to the navigation store state at the specified index.
 */
export const updateNavigationItem =
	(id: string, item: PartialDeep<NavItemType>): AppThunk =>
	async (dispatch, getState) => {
		const AppState = getState();
		const navigation = NavigationHelper.unflattenNavigation(selectNavigationAll(AppState));

		dispatch(setNavigation(NavigationHelper.updateNavItem(navigation, id, item)));

		return Promise.resolve();
	};

/**
 * Removes a navigation item from the navigation store state.
 */
export const removeNavigationItem =
	(id: string): AppThunk =>
	async (dispatch, getState) => {
		const AppState = getState();
		const navigation = NavigationHelper.unflattenNavigation(selectNavigationAll(AppState));

		dispatch(setNavigation(NavigationHelper.removeNavItem(navigation, id)));

		return Promise.resolve();
	};

export const {
	selectAll: selectNavigationAll,
	selectIds: selectNavigationIds,
	selectById: selectNavigationItemById
} = navigationAdapter.getSelectors<RootState>((state) => state.navigation);

/**
 * The navigation slice
 */
export const navigationSlice = createSlice({
	name: 'navigation',
	initialState,
	reducers: {
		setNavigation(state, action: PayloadAction<NavItemType[]>) {
			return navigationAdapter.setAll(state, NavigationHelper.flattenNavigation(action.payload));
		},
		resetNavigation: () => initialState
	}
});

export const { setNavigation, resetNavigation } = navigationSlice.actions;

export const selectNavigation = (canAccess: (requestedPrivileges: RequestedPrivileges) => boolean) =>
	createSelector([selectNavigationAll, selectCurrentLanguageId], (navigationSimple) => {
		const navigation = NavigationHelper.unflattenNavigation(navigationSimple);

		function setAdditionalData(data: NavItemType[]): NavItemType[] {
			return data?.map((item) => ({
				hasPermission: canAccess(item?.auth),
				...item,
				...(item?.title
					? {
							title: i18next.t(item.title, {
								ns: 'navigation'
							})
						}
					: {}),
				...(item?.children ? { children: setAdditionalData(item?.children) } : {})
			}));
		}

		const translatedValues = setAdditionalData(navigation);

		return translatedValues;
	});

export const selectFlatNavigation = (canAccess: (requestedPrivileges: RequestedPrivileges) => boolean) =>
	createSelector([selectNavigation(canAccess)], (navigation) => {
		return NavigationHelper.flattenNavigation(navigation);
	});

export type navigationSliceType = typeof navigationSlice;

export default navigationSlice.reducer;

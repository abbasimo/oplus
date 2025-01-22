import { createSlice } from '@reduxjs/toolkit';

/**
 * The type definition for the initial state of the navbar slice.
 */
type initialStateProps = {
	open: boolean;
	mobileOpen: boolean;
	foldedOpen: boolean;
};

/**
 * The initial state of the navbar slice.
 */
const initialState: initialStateProps = {
	open: true,
	mobileOpen: false,
	foldedOpen: false
};

/**
 * The navbar slice.
 */
export const navbarSlice = createSlice({
	name: 'navbar',
	initialState,
	reducers: {
		navbarToggleFolded: (state) => {
			state.foldedOpen = !state.foldedOpen;
		},
		navbarOpenFolded: (state) => {
			state.foldedOpen = true;
		},
		navbarCloseFolded: (state) => {
			state.foldedOpen = false;
		},
		navbarToggleMobile: (state) => {
			state.mobileOpen = !state.mobileOpen;
		},
		navbarOpenMobile: (state) => {
			state.mobileOpen = true;
		},
		navbarCloseMobile: (state) => {
			state.mobileOpen = false;
		},
		navbarClose: (state) => {
			state.open = false;
		},
		navbarOpen: (state) => {
			state.open = true;
		},
		navbarToggle: (state) => {
			state.open = !state.open;
		}
	},
	selectors: {
		selectNavbar: (navbar) => navbar
	}
});

export const {
	navbarToggleFolded,
	navbarOpenFolded,
	navbarCloseFolded,
	navbarOpen,
	navbarClose,
	navbarToggle,
	navbarOpenMobile,
	navbarCloseMobile,
	navbarToggleMobile
} = navbarSlice.actions;

export const { selectNavbar } = navbarSlice.selectors;

export type navbarSliceType = typeof navbarSlice;

export default navbarSlice.reducer;

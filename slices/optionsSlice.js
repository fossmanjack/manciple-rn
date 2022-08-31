// optionsSlice.js
// In this file we keep track of app options that are user-facing and user-editable,
// such as list sort order or back-end sync option

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	debug: 9, // 0 = none, 1 = error, 3 = warn, 5 = debug, 7 = v-debug, 9 = vv-debug
	sortOpts: [ 'name', true ],
	syncType: 'none',
	syncOpts: {
		url: null,
		path: null,
		port: null
	}
}

const optionsSlice = createSlice({
	name: 'options',
	initialState,
	reducers: {
		setDebugLevel: (optionsState, action) => { optionsState.debug = action.payload; },
		setSortOpts: (optionsState, action) => { optionsState.sortOpts = action.payload; },
		setSync: (optionsState, action) => { optionsState.sync = action.payload; },
		setSyncOpts: (optionsState, action) => {
			// action.payload is { syncInfo }
			return { ...optionsState, syncOpts: { ...action.payload }}
		}
	}
});

export const optionsReducer = optionsSlice.reducer;

export const {
	setDebugLevel,
	setSortOpts,
	setSync,
	setSyncOpts
} = optionsSlice.actions;


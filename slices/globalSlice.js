import { createSlice } from '@reduxjs/toolkit';
import uuid from 'react-native-uuid';

const initialState = {
	mode: 'list',
	lastUse: Date.now(),
	clientID: uuid.v4(),
};

const globalSlice = createSlice({
	name: 'global',
	initialState,
	reducers: {
		setMode: (globalState, action) => { globalState.mode = action.payload },
		setLastUse: (globalState, action) => { globalState.lastUse = action.payload },
		setDavURL: (globalState, action) => { globalState.dav.url = action.payload },
		setDavPath: (globalState, action) => { globalState.dav.path = action.payload }
	}
});

export const globalReducer = globalSlice.reducer;

export const {
	setMode,
	setLastUse,
} = globalSlice.actions;


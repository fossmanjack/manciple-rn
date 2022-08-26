import { createSlice } from '@reduxjs/toolkit';
import uuid from 'react-native-uuid';

const initialState = {
	mode: 'list',
	lastUse: Date.now(),
	clientID: uuid.v4(),
	dav: {
		url: 'https://cloud.sagephoenix.org/remote.php/dav',
		path: '/files/dummy/Apps/Manciple'
	}
}

const globalSlice = createSlice({
	name: 'global',
	initialState,
	reducers: {
		setMode: (globalState, action) => { globalState.mode = action.payload },
		setLastUse: (globalState, action) => { globalState.lastUse = action.payload },
		setDavURL: (globalState, action) => { globalState.dav.url = action.payload },
		setDavPath: (globalState, action) => { globalState.dav.path = action.payload }
	}
})

export const globalReducer = globalSlice.reducer;

export const {
	setMode,
	setLastUse,
	setDavURL,
	setDavPath
} = globalSlice.actions;


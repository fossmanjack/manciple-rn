import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	mode: 'list',
	lastUse: Date.now()
}

const globalSlice = createSlice({
	name: 'global',
	initialState,
	reducers: {
		setMode: (globalState, action) => { globalState.mode = action.payload },
		setLastUse: (globalState, action) => { globalState.lastUse = action.payload }
	}
})

export const globalReducer = globalSlice.reducer;

export const { setMode } = globalSlice.actions;
export const { setLastUse } = globalSlice.actions;

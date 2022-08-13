import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	mode: 'list'
}

const globalSlice = createSlice({
	name: 'global',
	initialState,
	reducers: {
		setMode: (globalState, action) => { globalState.mode = action.payload }
	}
})

export const globalReducer = globalSlice.reducer;

export const { setMode } = globalSlice.actions;

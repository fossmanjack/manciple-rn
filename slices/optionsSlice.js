import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	debug: 9, // 0 = none, 1 = error, 3 = warn, 5 = debug, 7 = v-debug, 9 = vv-debug
}

const optionsSlice = createSlice({
	name: 'options',
	initialState,
	reducers: {
		setDebugLevel: (optionsState, action) => { optionsState.debug = action.payload; }
	}
});

export const optionsReducer = optionsSlice.reducer;


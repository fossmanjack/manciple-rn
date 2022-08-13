import { configureStore } from '@reduxjs/toolkit';
import { pantriesReducer } from '../slices/pantriesSlice';
import { optionsReducer } from '../slices/optionsSlice';
import { globalReducer } from '../slices/globalSlice';

export const _Store = configureStore({
	reducer: {
		global: globalReducer,
		options: optionsReducer,
		pantries: pantriesReducer
	}
});

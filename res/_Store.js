import { configureStore } from '@reduxjs/toolkit';
import { inventoryReducer } from '../slices/inventorySlice';
import { pantriesReducer } from '../slices/pantriesSlice';
import { optionsReducer } from '../slices/optionsSlice';
import { globalReducer } from '../slices/globalSlice';
import { userReducer } from '../slices/userSlice';

export const _Store = configureStore({
	reducer: {
		global: globalReducer,
		options: optionsReducer,
		pantries: pantriesReducer,
		user: userReducer,
		inventory: inventoryReducer
	}
});


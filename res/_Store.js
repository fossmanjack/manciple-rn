import { configureStore } from '@reduxjs/toolkit';
import { itemStoreReducer } from '../slices/itemStoreSlice';
import { listsReducer } from '../slices/listsSlice';
import { optionsReducer } from '../slices/optionsSlice';
import { globalReducer } from '../slices/globalSlice';
import { userReducer } from '../slices/userSlice';

export const _Store = configureStore({
	reducer: {
		global: globalReducer,
		options: optionsReducer,
		lists: listsReducer,
		user: userReducer,
		itemStore: itemStoreReducer
	}
});


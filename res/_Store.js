import { configureStore } from '@reduxjs/toolkit';
import {
	persistStore,
	persistCombineReducers,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pantriesReducer } from '../slices/pantriesSlice';
import { optionsReducer } from '../slices/optionsSlice';
import { globalReducer } from '../slices/globalSlice';
import { userReducer } from '../slices/userSlice';
import { loadState } from '../utils/saver.js';

const config = {
	key: 'root',
	storage: AsyncStorage,
	debug: true
}

export const _Store = configureStore({
	reducer: persistCombineReducers(config, {
		global: globalReducer,
		options: optionsReducer,
		pantries: pantriesReducer,
		user: userReducer
	}),
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					FLUSH,
					REHYDRATE,
					PAUSE,
					PERSIST,
					PURGE,
					REGISTER
				]
			}
		})
});

export const _Persist = persistStore(_Store, null, loadState(_Store));

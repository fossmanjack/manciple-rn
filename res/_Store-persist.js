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
import { listsReducer } from '../slices/listsSlice';
import { optionsReducer } from '../slices/optionsSlice';
import { globalReducer } from '../slices/globalSlice';
import { userReducer } from '../slices/userSlice';
import * as Saver from '../utils/saver.js';

const config = {
	key: 'root',
	storage: AsyncStorage,
	blacklist: ['user'],
	debug: true
}

export const _Store = configureStore({
	reducer: persistCombineReducers(config, {
		global: globalReducer,
		options: optionsReducer,
		lists: listsReducer,
		user: userReducer,
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

export const _Persist = persistStore(_Store, null, _ => Saver.login(_Store));

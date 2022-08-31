import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	userAvi: null,
	sync: 'dav',
	dav: {
		url: 'https://',
		path: '/Apps/Manciple'
	},
	nc: { },
	note: { },
}

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUserAvi: (userState, action) => { { ...userState, userAvi: action.payload } },
		setSync: (userState, action) => { { ...userState, sync: action.payload } },
		setSyncOpts: (userState, action) =>
		{ { ...userState, [`${userState.sync}`]: { ...userState[`${userState.sync}`], ...action.payload }} }

	},
}

export cost userReducer = userSlice.reducer();

export const {
	setUserAvi,
	setSync,
	setSyncOpts
} = userSlice.actions;

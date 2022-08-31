import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	username: null,
	password: null,
	userAvi: null,
}

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUserAvi: (userState, action) => { return { ...userState, userAvi: action.payload }},
		setUsername: (userState, action) => { return { ...userState, username: action.payload }},
		setPassword: (userState, action) => { return { ...userState, password: action.payload }}
	},
});

export const userReducer = userSlice.reducer;

export const {
	setUsername,
	setPassword,
	setUserAvi,
} = userSlice.actions;

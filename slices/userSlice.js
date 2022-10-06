// Handles the non-private users info -- password and token are kept in secure
// storage and loaded into Xstate
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	username: null,
	uuid: null,
	userAvi: null,
	knownUsers: {}
}

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUserAvi: (userState, action) => { return { ...userState, userAvi: action.payload }},
		setUsername: (userState, action) => { return { ...userState, username: action.payload }},
		setUUID: (uState, action) => { return { ...uState, uuid: action.payload }},
		setKnownUsers: (uState, action) => { return { ...uState, knownUsers: action.payload }},
		addKnownUser: (uState, action) => {
			return {
				...uState,
				knownUsers: {
					...uState.knownUsers,
					...action.payload
				}
			}
		}
	},
});

export const userReducer = userSlice.reducer;

export const {
	setUsername,
	setUserAvi,
	setUUID,
	setKnownUsers,
	addKnownUser
} = userSlice.actions;

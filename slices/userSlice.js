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

	},
}



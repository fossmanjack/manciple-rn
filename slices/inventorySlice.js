// inventorySlice.js
// Handles actions for adding, updating, or deleting items

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	inventory: [ ]
}

const inventorySlice = createSlice({
	name: 'inventory',
	initialState,
	reducers: {
		addItem: (state, action) => {
			if(!action.payload) return state;

			let idx = state.inventory.indexOf(state.inventory.find(item => item.id === action.payload.id));
			if(idx) {
				state.inventory.splice({ ...state.inventory[idx], ...action.payload }, idx, 1);
			} else {
				state.inventory.push(action.payload);
			}
		}
	}
});

export const inventoryReducer = inventorySlice.reducer;


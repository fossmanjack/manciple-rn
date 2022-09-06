// inventorySlice.js
// Handles actions for adding, updating, or deleting items

import { createSlice } from '@reduxjs/toolkit';
import { INVENTORY } from '../res/DEFAULT';
import * as Utils from '../utils/utils';

const initialState = {
	_Inventory: INVENTORY,
	deleted: [ ]
}

const inventorySlice = createSlice({
	name: 'inventory',
	initialState,
	reducers: {
		addItem: (iState, action) => {
			// For adding a new item to inventory, but can handle item updates as well
			// Expects a PantryItem object as payload
			if(!action.payload) return iState;
			if(action.payload.type !== 'item') return iState;

			let idx = iState._Inventory.indexOf(iState._Inventory.find(item => item.id === action.payload.id));
			if(idx !== -1) {
				// if item with matching id is already in state, update it
				iState._Inventory.splice({ ...iState._Inventory[idx], ...action.payload }, idx, 1);
			} else {
				// otherwise push item to inventory
				iState._Inventory.push(action.payload);
			}
		},
		updateItem: (iState, action) => {
			// For updating an existing item
			// expects an array [ id, { updated props } ]
			console.log('Inv: updateItem,', action);
			if(!action.payload) return iState;
			const [ id, props ] = action.payload;
			if(!id || !props) return iState;

			//props = { ...props, modifyDate: Date.now() };

			let idx = iState._Inventory.indexOf(iState._Inventory.find(item => item.id === id));
			if(idx === -1) return iState;

			return {
				...iState,
				_Inventory: [
					...iState._Inventory.slice(0, idx),
					{
						...iState._Inventory[idx],
						...props,
						modifyDate: Date.now()
					},
					...iState._Inventory.slice(idx + 1)
				]
			};

/*
			return {
				...iState,
				_Inventory: [
					...[ ...iState._Inventory ].splice({ ...iState._Inventory[idx], ...action.payload }, idx, 1)
				]
			}
*/
		},
		deleteItem: (iState, action) => {
			// For deleting an item from inventory
			// expects an item ID
			if(!action.payload) return iState;

			return {
				_Inventory: [ ...[ ...iState._Inventory ].filter(item => item.id !== action.payload) ],
				deleted: [ ...iState.deleted, action.payload ]
			};
		},
		clearDeleted: (iState, action) => {
			// once the remote delete operation has run, clear the state
			return { ...iState, deleted: [ ] };
		},
		updateInterval: (iState, action) => {
			// update the purchase interval of an item
			// expects itemID as payload
			if(!action.payload) return iState;
			const updatedItem = iState.inventory.find(item => item.id === action.payload);
			if(Utils.nullp(updatedItem)) return iState;

			const idx = iState._Inventory.indexOf(iState.inventory.find(item => item.id === updatedItem.id));
			if(idx === -1) return iState;

			updatedItem.interval = Utils.calculateInterval(updatedItem);

			return {
				...iState,
				_Inventory: [
					...iState._Inventory.slice(0, idx),
					{
						...iState._Inventory[idx],
						interval: Utils.calculateInterval(iState._Inventory[idx]),
						modifyDate: Date.now()
					},
					...iState._Inventory.slice(idx + 1)
					//...[ ...iState._Inventory ].splice(updatedItem, idx, 1)
				]
			}
		}
	}
});

export const inventoryReducer = inventorySlice.reducer;

export const {
	addItem,
	updateItem,
	deleteItem,
	clearDeleted,
	updateInterval
} = inventorySlice.actions;


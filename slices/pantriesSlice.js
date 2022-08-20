// "pantries" state (object) should look like this:
// _Pantries: [ pantry1: {...}, pantry2: {...}, ... ]
// currentPantry: pantry1
//
// Each pantry (object) is arranged like so:
// pantryID: {
// 		name: 'Pantry name',
// 		creationDate: date,
// 		modifyDate: date,
// 		inventory: [ {...item1}, {...item2}, ... ]
//
// Each item is arranged like so:
// {
// 		name: 'item name',
// 		id: camelized(item.name),
// 		listed: bool,
// 		needed: bool,
// 		staple: bool,
// 		...extra metadata we don't need to use until it's working
// }

import { createSlice } from '@reduxjs/toolkit';
import { PANTRIES } from '../res/PANTRIES';
import createPantryItem from './pantryItemSlice';
import uuid from 'react-native-uuid';
import * as Utils from '../utils/utils';

const initialState = {
	_Pantries: PANTRIES,
	currentPantry: 0 // holds pantryID
};

const pantriesSlice = createSlice({
	name: 'pantries',
	initialState,
	reducers: {
		setPantry: (pantriesState, action) => {
			// action.payload = index of selected pantry
			console.log('setPantry', action.payload);
			return { ...pantriesState, currentPantry: action.payload }
		},
		addPantry: (pantriesState, action) => {
			// action.payload = pantry name
			const newPantry = {
				name: action.payload,
				id: uuid.v4(),
				creationDate: Date.now(),
				modifyDate: Date.now(),
				inventory: []
			};
			console.log('addPantry', newPantry);

			return { ...pantriesState, _Pantries: [ ...pantriesState._Pantries, newPantry ]};
		},
		deletePantry: (pantriesState, action) => {
			// action.payload = pantry index
			pantriesState._Pantries.splice(action.payload, 1);
		},
		updatePantry: (pantriesState, action) => {
			// action.payload is updated pantry object; ID won't have changed
			const updateID = action.payload.id;
			const updateIdx = pantriesState._Pantries.indexOf(pantriesState._Pantries.find(pt => pt.id === updateID));
			console.log('updatePantry called:', action.payload);
			updateIdx !== -1
				&& pantriesState._Pantries.splice(updateIdx, 1, action.payload)
				|| pantriesState._Pantries.push(action.payload);
		},
/*
		toggleNeeded: (pantriesState, action) => {
			// updates the passed item's "needed" to the inverse of its current value
			// action -> { type: 'pantries/toggleNeeded', payload: itemID }
			//Utils.debugMsg('toggleNeeded', [ action ]);
			console.log('toggleNeeded:', action);
			const { currentPantry } = pantriesState;
			const { inventory: inv } = pantriesState._Pantries[currentPantry];
			const item = inv.find(i => i.id === action.payload);
			console.log('pre-toggle item', item);
			// spreading nested objects is a pain so I hope this just works
			item.needed = !item.needed;
			pantriesState._Pantries[currentPantry].modifyDate = Date.now();
			console.log('post-toggle item', item);
		},
		toggleListed: (pantriesState, action) => {
			// updates the passed item's "listed" to the inverse of its current value
			// action -> { type: 'pantries/toggleListed', payload: itemID
			const item = pantriesState._Pantries[pantriesState.currentPantry].inventory.find(i => i.id === action.payload);
			item.listed && !item.needed && item.history.unshift(Date.now()); // listed && !needed means it's been bought
			item.listed = !item.listed;
			pantriesState._Pantries[pantriesState.currentPantry].modifyDate = Date.now();
		},
		toggleStaple: (pantriesState, action) => {
			// updates the passed item's "staple" to its inverse
			// action -> { type: 'pantries/toggleStaple', payload: itemID }
			const item = pantriesState._Pantries[pantriesState.currentPantry].inventory.find(i => i.id === action.payload);
			item.staple = !item.staple;
			pantriesState._Pantries[pantriesState.currentPantry].modifyDate = Date.now();
		},
*/
		addItem: (pantriesState, action) => {
			// Expects a string as an action payload, which it then splits at the parentheses
			// searches the inventory for the action payload, then toggles its needed/listed states if found
			// or adds a new item if not found
			if(!action.payload) return pantriesState;
			let [ name = 'New item', qty = '1' ] = action.payload.split(',', 2);
			const idx = Utils.camelize(name);

			item = pantriesState._Pantries[pantriesState.currentPantry].inventory.find(i => i.id === idx);
			if(typeof(item) === 'object')
			{
				item.listed = true;
				item.needed = true;
				if(item.qty !== qty) item.qty = qty;
				pantriesState._Pantries[pantriesState.currentPantry].modifyDate = Date.now();
			} else {
				pantriesState._Pantries[pantriesState.currentPantry].inventory.push(createPantryItem({ name, id: idx, qty }));
				pantriesState._Pantries[pantriesState.currentPantry].modifyDate = Date.now();
			}
		},
		deleteItem: (pantriesState, action) => {
			// Expects an item ID as the action payload
			console.log('deleteItem', action);
			pantriesState._Pantries[pantriesState.currentPantry].inventory =
				pantriesState._Pantries[pantriesState.currentPantry].inventory.filter(i => i.id !== action.payload);
		},
		updateItem: (pantriesState, action) => {
			// Expects { origItemID, newItemOb } as action.payload
			const { itemID, updatedItem } = action.payload;
			//const initItem = pantriesState._Pantries[pantriesState.currentPantry].inventory.find(i => i.id === itemID);
			//const index = initItem ? pantriesState._Pantries[pantriesState.currentPantry].inventory.indexOf(initItem) : null;
			const index = pantriesState._Pantries[pantriesState.currentPantry].inventory.indexOf(
				pantriesState._Pantries[pantriesState.currentPantry].inventory.find(i => i.id === itemID));;
			console.log('updateItem called:', updatedItem, index);
			index !== -1
				&& pantriesState._Pantries[pantriesState.currentPantry].inventory.splice(index, 1, updatedItem)
				|| pantriesState._Pantries[pantriesState.currentPantry].inventory.push(updatedItem);
		},
		sortList: (pantriesState, action) => {
			// Expects [ field(string), asc(bool) ] as action payload
			const [ field, asc ] = action.payload;
		}
	}
});

export const pantriesReducer = pantriesSlice.reducer;

export const {
	setPantry,
	addPantry,
	deletePantry,
	updatePantry,
/*
	toggleNeeded,
	toggleListed,
	toggleStaple,
*/
	addItem,
	deleteItem,
	updateItem,
	sortList
} = pantriesSlice.actions;

// "lists" state (object) should look like this:
// _Lists: { pantry1id: {...}, pantry2id: {...}, ... }
// currentList: pantry1
//
// Each pantry (object) is arranged like so:
// listID: {
// 		name: 'Pantry name',
// 		creationDate: date,
// 		modifyDate: date,
// 		inventory: {
// 			item1ID: { qty, purchaseBy, inCart },
// 			item2ID: { ... },
// 			...
// 		},
// 		staples: [ item1ID, item2ID, ... ]
// 	}
// 76149.1: Updated to treat _Lists as an object

import { createSlice } from '@reduxjs/toolkit';
import { purgeStoredState } from 'redux-persist';
import { LISTS } from '../res/DEFAULT';
//import createPantryItem from './pantryItemSlice';
import uuid from 'react-native-uuid';
import * as Utils from '../utils/utils';

const initialState = {
	_Lists: LISTS,
	currentList: Object.keys(LISTS)[0] // holds pantry id
};

const listsSlice = createSlice({
	name: 'lists',
	initialState,
	reducers: {
		// pantry management
		setList: (lState, action) => {
			// action.payload = key (listID) of selected pantry
			console.log('setPantry', action.payload);
			return { ...lState, currentList: action.payload }
		},
		addList: (lState, action) => {
			// action.payload = [ listID, { pantry object }]
			// Adds listID: pantry to _Lists
			// Will not allow listID or pantry.name overwrite
			// use this ONLY when creating a new pantry from scratch
			// imports should use updatePantry
			console.log('addPantry', action.payload);
			if(!action.payload) return lState;
			let [ listID, newPantry ] = action.payload;
			if(!listID) listID = uuid.v4();
			if(!newPantry || !newPantry.name) newPantry = Utils.createPantry({
				...(newPantry || {}),
				name: 'New pantry'
			});

			return {
				...lState,
				_Lists: {
					...lState._Lists,
					[listID]: newPantry
				}
			};
		},
		deleteList: (lState, action) => {
			// action.payload = pantry ID
			if(!action.payload) return lState;

			const newPantries = { ...lState._Lists };
			delete newPantries[action.payload];

			return {
				...lState,
				_Lists: newPantries
			};
		},
		updateList: (lState, action) => {
			// update an existing pantry
			// action.payload is [ listID, { ...props } ]
			// use this when importing a pantry

			if(!action.payload) return lState;

			const [ listID, props ] = action.payload;
			if(!listID || !props) return lState;

			return {
				...lState,
				_Lists: {
					...lState._Lists,
					[listID]: {
						...(lState._Lists[listID] || {}),
						...props,
						modifyDate: Date.now()
					}
				}
			};
		},
		// pantry inventory management
		addItemToList: (lState, action) => {
			// Update an item in inventory
			// action.payload is [ itemID, { props }, listID ]
			// Note that if item is in inventory already it'll be overwritten
			console.log('addItemToPantry', lState, action);
			if(!action.payload) return lState;
			const [ itemID, props, listID ] = action.payload;
			let idx = lState.currentList;
			if(!itemID || !props) return lState;
			if(listID) idx = lState._Lists.indexOf(lState._Lists.find(list => list.id === listID));
			console.log('addItemToPantry deconstruct:', itemID, props, listID);
			console.log('addItemToPantry pantry info:\n',
				lState._Lists[lState.currentList].inventory[itemID]);

			const insert = {
				qty: '1',
				purchaseBy: 0,
				inCart: false,
				...props
			};
			if(!insert) return lState;

			console.log('addItemToPantry insert:', insert);

			const updatedList = {
				...lState._Lists[idx],
				modifyDate: Date.now(),
				inventory: {
					...lState._Lists[idx].inventory,
					[itemID]: insert
				}
			};

			console.log('addItemToPantry updatedList:', updatedList);

			return {
				...lState,
				_Lists: [
					...lState._Lists.slice(0, lState.currentList),
					updatedList,
					...lState._Lists.slice(lState.currentList + 1)
				]
			};
		},
		deleteItemFromList: (lState, action) => {
			// Delete an item from pantry inventory object
			// action payload is [ itemID, listID ]
			if(!action.payload) return lState;

			const [ itemID, listID ] = action.payload;
			const idx = listID
				? lState._Lists.indexOf(lState._Lists.find(list => list.id === listID))
				: lState.currentList;

			console.log('deleteItemFromPantry', itemID, idx);

			const ret = { ...lState._Lists[idx].inventory };
			delete ret[itemID];

			return {
				...lState,
				_Lists: [
					...lState._Lists.slice(0, idx),
					{
						...lState._Lists[idx],
						modifyDate: Date.now(),
						inventory: {
							...ret
						}
					},
					...lState._Lists.slice(idx + 1)
				]
			};
		},
		updateItemInList: (lState, action) => {
			// Update an item in inventory
			// action.payload is [ itemID, { props }, listID ]
			console.log('updateItemInPantry', lState, action);
			if(!action.payload) return lState;

			const [ itemID, props, listID ] = action.payload;
			if(!itemID || !props) return lState;
			const idx = listID
				? lState._Lists.indexOf(lState._Lists.find(list => list.id === listID))
				: lState.currentList;

			console.log('updateItemInPantry deconstruct:', itemID, props, listID);
			console.log('updateItemInPantry pantry info:\n',
				lState._Lists[idx].inventory[itemID]);

			const insert = { ...lState._Lists[idx].inventory[itemID], ...props };
			if(!insert) return lState;

			console.log('updateItemInPantry insert:', insert);

			return {
				...lState,
				_Lists: [
					...lState._Lists.slice(0, idx),
					{
						...lState._Lists[idx],
						modifyDate: Date.now(),
						inventory: {
							...lState._Lists[idx].inventory,
							[itemID]: insert
						}
					},
					...lState._Lists.slice(idx + 1)
				]
			};
		}
	}
});

export const listsReducer = listsSlice.reducer;

export const {
	setList,
	addList,
	deleteList,
	updateList,
	addItemToList,
	deleteItemFromList,
	updateItemInList
/*
	addItem,
	deleteItem,
	updateItem,
	sortList,
	resetState,
	overwriteState
*/
} = listsSlice.actions;

// "pantries" state (object) should look like this:
// _Pantries: { pantry1id: {...}, pantry2id: {...}, ... }
// currentPantry: pantry1
//
// Each pantry (object) is arranged like so:
// pantryID: {
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
// 76149.1: Updated to treat _Pantries as an object

import { createSlice } from '@reduxjs/toolkit';
import { purgeStoredState } from 'redux-persist';
import { PANTRIES } from '../res/DEFAULT';
//import createPantryItem from './pantryItemSlice';
import uuid from 'react-native-uuid';
import * as Utils from '../utils/utils';

const initialState = {
	_Pantries: PANTRIES,
	currentPantry: '' // holds pantry id
};

const pantriesSlice = createSlice({
	name: 'pantries',
	initialState,
	reducers: {
		// pantry management
		setPantry: (pState, action) => {
			// action.payload = index of selected pantry
			console.log('setPantry', action.payload);
			return { ...pState, currentPantry: action.payload }
		},
		addPantry: (pState, action) => {
			// action.payload = pantry object
			// use this ONLY when creating a new pantry from scratch
			// imports should use updatePantry
			console.log('addPantry', action.payload);
			if(!action.payload ||
				Object.values(pState._Pantries)
				.find(ob => Utils.camelize(ob.name) === Utils.camelize(action.payload.name)))
				return pState;

			return {
				...pState,
				_Pantries: {
					...pState._Pantries,
					[uuid.v4()]: Utils.createPantry(action.payload)
				}
			};
		},
		deletePantry: (pState, action) => {
			// action.payload = pantry ID
			if(!action.payload) return pState;

			const newPantries = { ...pState._Pantries };
			delete newPantries[action.payload];

			return {
				...pState,
				_Pantries: newPantries
			};
		},
		updatePantry: (pState, action) => {
			// update an existing pantry
			// action.payload is [ pantryID, { ...props } ]
			// use this when importing a pantry

			if(!action.payload) return pState;

			const [ pantryID, props ] = action.payload;
			if(!pantryID || !props) return pState;

			return {
				...pState,
				_Pantries: {
					...pState._Pantries,
					[pantryID]: {
						...(pState._Pantries[pantryID] || {}),
						...props,
						modifyDate: Date.now();
					}
				}
			};
		},
		// pantry inventory management
		addItemToPantry: (pState, action) => {
			// Update an item in inventory
			// action.payload is [ itemID, { props }, pantryID ]
			// Note that if item is in inventory already it'll be overwritten
			console.log('addItemToPantry', pState, action);
			if(!action.payload) return pState;
			const [ itemID, props, pantryID ] = action.payload;
			let idx = pState.currentPantry;
			if(!itemID || !props) return pState;
			if(pantryID) idx = pState._Pantries.indexOf(pState._Pantries.find(ptr => ptr.id === pantryID));
			console.log('addItemToPantry deconstruct:', itemID, props, pantryID);
			console.log('addItemToPantry pantry info:\n',
				pState._Pantries[pState.currentPantry].inventory[itemID]);

			const insert = {
				qty: '1',
				purchaseBy: 0,
				inCart: false,
				...props
			};
			if(!insert) return pState;

			console.log('addItemToPantry insert:', insert);

			const updatedPantry = {
				...pState._Pantries[idx],
				modifyDate: Date.now(),
				inventory: {
					...pState._Pantries[idx].inventory,
					[itemID]: insert
				}
			};

			console.log('addItemToPantry updatedPantry:', updatedPantry);

			return {
				...pState,
				_Pantries: [
					...pState._Pantries.slice(0, pState.currentPantry),
					updatedPantry,
					...pState._Pantries.slice(pState.currentPantry + 1)
				]
			};
		},
		deleteItemFromPantry: (pState, action) => {
			// Delete an item from pantry inventory object
			// action payload is [ itemID, pantryID ]
			if(!action.payload) return pState;

			const [ itemID, pantryID ] = action.payload;
			const idx = pantryID
				? pState._Pantries.indexOf(pState._Pantries.find(ptr => ptr.id === pantryID))
				: pState.currentPantry;

			console.log('deleteItemFromPantry', itemID, idx);

			const ret = { ...pState._Pantries[idx].inventory };
			delete ret[itemID];

			return {
				...pState,
				_Pantries: [
					...pState._Pantries.slice(0, idx),
					{
						...pState._Pantries[idx],
						modifyDate: Date.now(),
						inventory: {
							...ret
						}
					},
					...pState._Pantries.slice(idx + 1)
				]
			};
		},
		updateItemInPantry: (pState, action) => {
			// Update an item in inventory
			// action.payload is [ itemID, { props }, pantryID ]
			console.log('updateItemInPantry', pState, action);
			if(!action.payload) return pState;

			const [ itemID, props, pantryID ] = action.payload;
			if(!itemID || !props) return pState;
			const idx = pantryID
				? pState._Pantries.indexOf(pState._Pantries.find(ptr => ptr.id === pantryID))
				: pState.currentPantry;

			console.log('updateItemInPantry deconstruct:', itemID, props, pantryID);
			console.log('updateItemInPantry pantry info:\n',
				pState._Pantries[idx].inventory[itemID]);

			const insert = { ...pState._Pantries[idx].inventory[itemID], ...props };
			if(!insert) return pState;

			console.log('updateItemInPantry insert:', insert);

			return {
				...pState,
				_Pantries: [
					...pState._Pantries.slice(0, idx),
					{
						...pState._Pantries[idx],
						modifyDate: Date.now(),
						inventory: {
							...pState._Pantries[idx].inventory,
							[itemID]: insert
						}
					}
					...pState._Pantries.slice(idx + 1)
				]
			};
		}
	}
});

export const pantriesReducer = pantriesSlice.reducer;

export const {
	setPantry,
	addPantry,
	deletePantry,
	updatePantry,
	addItemToPantry,
	deleteItemFromPantry,
	updateItemInPantry
/*
	addItem,
	deleteItem,
	updateItem,
	sortList,
	resetState,
	overwriteState
*/
} = pantriesSlice.actions;

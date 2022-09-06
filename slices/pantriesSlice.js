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
import { purgeStoredState } from 'redux-persist';
import { PANTRIES } from '../res/DEFAULT';
//import createPantryItem from './pantryItemSlice';
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
			if(action.payload.id && pState._Pantries.find(pnt => pnt.id === action.payload.id)) return pState;
			return { ...pState, _Pantries: [ ...pState._Pantries, Utils.createPantry(action.payload) ]};
		},
		deletePantry: (pState, action) => {
			// action.payload = pantry ID
			const idx = pState._Pantries.indexOf(pState._Pantries.find(ptr => ptr.id === action.payload));
			if(idx === -1) return pState;
			return {
				...pState,
				_Pantries: [
					...pState._Pantries.slice(0, idx),
					...pState._Pantries.slice(idx + 1)
				]
			};
			//pState._Pantries.splice(action.payload, 1);
		},
		updatePantry: (pState, action) => {
			// action.payload is updated pantry object; ID won't have changed
			// use this when importing a pantry
			const updateID = action.payload.id;
			action.payload.modifyDate = Date.now();
			const updateIdx = pState._Pantries.indexOf(pState._Pantries.find(pt => pt.id === updateID));
			console.log('updatePantry called:', action.payload);
			updateIdx !== -1
				&& pState._Pantries.splice(updateIdx, 1, action.payload)
				|| pState._Pantries.push(action.payload);
		},
/*
		toggleStaple: (pState, action) => {
			if(!action.payload) return pState;
			const retArr = [ ...pState._Pantries[pState.currentPantry].staples ];
			if(retArr.find(id => id === action.payload))
				retArr = retArr.filter(id => id !== action.payload);
			else
				retArr.push(action.payload);

			const updatedPantry = {
				...pState._Pantries[pState.currentPantry],
				modifyDate: Date.now(),
				staples: retArr,
			};

			return {
				...pState,
				_Pantries: [
					...[ ...pState._Pantries ].splice(pState.currentPantry, 1, updatedPantry)
				]
			};
		},
		toggleInCart: (pState, action) => {
			// toggle the inCart flag for the passed item
			// action payload is just the itemID
			if(!action.payload) return pState;

			insert = { ...pState._Pantries[pState.currentPantry].inventory.find(item => item.id === action.payload)};
			if(Utils.nullp(insert)) return pState;

			insert.inCart = !insert.inCart;

			const updatedPantry = {
				...pState._Pantries[pState.currentPantry],
				modifyDate: Date.now(),
				inventory: {
					...pState._Pantries[pState.currentPantry].inventory,
					[insert.id]: { ...insert }
				}
			};

			return {
				...pState,
				_Pantries: [
					...[ ...pState._Pantries ].splice(pState.currentPantry, 1, updatedPantry)
				]
			};
		},
*/
		addItemToPantry: (pState, action) => {
			// Update an item in inventory
			// action.payload is [ itemID, { props }]
			// Note that if item is in inventory already it'll be overwritten
			console.log('addItemToPantry', pState, action);
			if(!action.payload) return pState;
			const [ itemID, props ] = action.payload;
			if(!itemID || !props) return pState;
			console.log('addItemToPantry deconstruct:', itemID, props);
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
				...pState._Pantries[pState.currentPantry],
				modifyDate: Date.now(),
				inventory: {
					...pState._Pantries[pState.currentPantry].inventory,
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
/*
			// Insert an item into inventory object
			// action payload is { itemID: { qty, purchaseBy, inCart }}
			if(!action.payload) return pState;

			const itemID = Object.keys(action.payload)[0];
			const insert = {
				[itemID]: {
					qty: '1',
					purchaseBy: 0,
					inCart: false,
					...action.payload[itemID]
				}
			};

			const updatedPantry = {
				...pState._Pantries[pState.currentPantry],
				modifyDate: Date.now(),
				inventory: {
					...pState._Pantries[pState.currentPantry].inventory,
					...insert
					//[insert.id]: { ...insert }
				}
			};

			return {
				...pState,
				_Pantries: [
					...pState._Pantries.slice(0, pState.currentPantry),
					updatedPantry,
					...pState._Pantries.slice(pState.currentPantry + 1)
				]
			};
*/
		},
		deleteItemFromPantry: (pState, action) => {
			// Delete an item from pantry inventory object
			// action payload is [ itemID, pantryID ]
			if(!action.payload) return pState;

			let [ itemID, pantryID ] = action.payload;
			if(Utils.nullp(pantryID)) pantryID = pState._Pantries[pState.currentPantry].id;
			console.log('deleteItemFromPantry', itemID, pantryID);

			const idx = pState._Pantries.indexOf(pState._Pantries.find(ptr => ptr.id === pantryID));

			const ret = { ...pState._Pantries[idx].inventory };
			delete ret[itemID];
/*
			const updatedPantry = {
				...pState._Pantries[idx],
				modifyDate: Date.now(),
				inventory: {
					...ret
				}
			};
*/

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
			// action.payload is [ itemID, { props }]
			console.log('updateItemInPantry', pState, action);
			if(!action.payload) return pState;
			const [ itemID, props ] = action.payload;
			if(!itemID || !props) return pState;
			console.log('updateItemInPantry deconstruct:', itemID, props);
			console.log('updateItemInPantry pantry info:\n',
				pState._Pantries[pState.currentPantry].inventory[itemID]);

			const insert = { ...pState._Pantries[pState.currentPantry].inventory[itemID], ...props };
			if(!insert) return pState;

			console.log('updateItemInPantry insert:', insert);

			const updatedPantry = {
				...pState._Pantries[pState.currentPantry],
				modifyDate: Date.now(),
				inventory: {
					...pState._Pantries[pState.currentPantry].inventory,
					[itemID]: { ...insert }
				}
			};

			console.log('updateItemInPantry updatedPantry:', updatedPantry);

			return {
				...pState,
				_Pantries: [
					...pState._Pantries.slice(0, pState.currentPantry),
					updatedPantry,
					...pState._Pantries.slice(pState.currentPantry + 1)
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

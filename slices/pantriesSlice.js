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
			// action.payload = pantry name
			const newPantry = {
				name: action.payload,
				id: uuid.v4(),
				creationDate: Date.now(),
				modifyDate: Date.now(),
				inventory: {},
				staples: []
			};
			console.log('addPantry', newPantry);

			return { ...pState, _Pantries: [ ...pState._Pantries, newPantry ]};
		},
		deletePantry: (pState, action) => {
			// action.payload = pantry index
			pState._Pantries.splice(action.payload, 1);
		},
		updatePantry: (pState, action) => {
			// action.payload is updated pantry object; ID won't have changed
			const updateID = action.payload.id;
			action.payload.modifyDate = Date.now();
			const updateIdx = pState._Pantries.indexOf(pState._Pantries.find(pt => pt.id === updateID));
			console.log('updatePantry called:', action.payload);
			updateIdx !== -1
				&& pState._Pantries.splice(updateIdx, 1, action.payload)
				|| pState._Pantries.push(action.payload);
		},
		toggleStaple: (pState, action) => {
			if(!action.payload) return pState;
			const retArr = [ ...pState._Pantries[pState.currentPantry].staples ];
			if(retArr.find(id => id === action.payload))
				retArr = retArr.filter(id => id !== action.payload);
			else
				retArr.push(action.payload);

			return {
				...pState,
				pState._Pantries[pState.currentPantry]: {
					...pState._Pantries[pState.currentPantry],
					staples: retArr,
					modifyDate: Date.now()
				}
			}
		},
		toggleInCart: (pState, action) => {
			// toggle the inCart flag for the passed item
			// action payload is just the itemID
			if(!action.payload) return pState;

			ob = pState._Pantries[pState.currentPantry].inventory.find(item => item.id === action.payload);
			if(Utils.nullp(ob)) return pState;

			return {
				...pState,
				pState._Pantries[pState.currentPantry]: {
					...pState._Pantries[pState.currentPantry],
					inventory: {
						...pState._Pantries[pState.currentPantry].inventory,
						[action.payload]: {
							...pState._Pantries[pState.currentPantry].inventory[itemID],
							inCart: !...pState._Pantries[pState.currentPantry].inventory[itemID].inCart
						}
					}
				}
			}
		},
		addItemToPantry: (pState, action) => {
			// Insert an item into inventory object
			// action payload is { itemID: { qty, purchaseBy, inCart }}
			if(!action.payload) return pState;

			const itemID = Object.keys(action.payload)[0];
			const insert = {
				itemID: {
					qty: '1',
					purchaseBy: 0,
					inCart: true,
					...action.payload[itemID]
				}
			};

			return {
				...pState,
				pState._Pantries[pState.currentPantry]: {
					...pState._Pantries[pState.currentPantry],
					inventory: {
						...pState._Pantries[pState.currentPantry].inventory,
						...insert
					},
					modifyDate: Date.now()
				}
			};
		},
		deleteItemFromPantry: (pState, action) => {
			// Delete an item from pantry inventory object
			// action payload is itemID
			if(!action.payload) return pState;

			const ret = { ...pState._Pantries[pState.currentPantry].inventory };
			delete ret[action.payload];

			return {
				...pState,
				pState._Pantries[pState.currentPantry]: {
					...pState._Pantries[pState.currentPantry],
					inventory: ret,
					modifyDate: Date.now()
				}
			}
		},
		updateItemInPantry: (pState, action) => {
			// Update an item in inventory
			// action.payload is [ itemID, { props }]
			if(!action.payload) return pState;
			const [ itemID, props ] = action.payload;
			if(!itemID || !props) return pState;

			const retItem = { ...pState._Pantries[pState.currentPantry].inventory[itemID] };
			if(!retItem) return pState;

			return {
				...pState,
				pState._Pantries[pState.currentPantry]: {
					...pState._Pantries[pState.currentPantry],
					modifyDate: Date.now(),
					inventory: {
						...pState._Pantries[pState.currentPantry].inventory,
						[itemID]: { ...retItem, ...props }
					}
				}
			};
		}
/*
		addItem: (pState, action) => {
			// Expects a string as an action payload, which it then splits at the parentheses
			// searches the inventory for the action payload, then toggles its needed/listed states if found
			// or adds a new item if not found
			if(!action.payload) return pState;
			let [ name = 'New item', qty = '1' ] = action.payload.split(',', 2);
			const idx = Utils.camelize(name);

			item = pState._Pantries[pState.currentPantry].inventory.find(i => i.id === idx);
			if(typeof(item) === 'object')
			{
				item.listed = true;
				item.needed = true;
				if(item.qty !== qty) item.qty = qty;
				pState._Pantries[pState.currentPantry].modifyDate = Date.now();
			} else {
				pState._Pantries[pState.currentPantry].inventory.push(Utils.createPantryItem({ name, id: idx, qty }));
				pState._Pantries[pState.currentPantry].modifyDate = Date.now();
			}
		},
		deleteItem: (pState, action) => {
			// Expects an item ID as the action payload
			console.log('deleteItem', action);
			pState._Pantries[pState.currentPantry].inventory =
				pState._Pantries[pState.currentPantry].inventory.filter(i => i.id !== action.payload);
		},
		updateItem: (pState, action) => {
			// Expects { origItemID, newItemOb } as action.payload
			const { itemID, updatedItem } = action.payload;
			const index = pState._Pantries[pState.currentPantry].inventory.indexOf(
				pState._Pantries[pState.currentPantry].inventory.find(i => i.id === itemID));;
			console.log('updateItem called:', updatedItem, index);
			index !== -1
				&& pState._Pantries[pState.currentPantry].inventory.splice(index, 1, updatedItem)
				|| pState._Pantries[pState.currentPantry].inventory.push(updatedItem);
		},
		sortList: (pState, action) => {
			// Expects [ field(string), asc(bool) ] as action payload
			const [ field, asc ] = action.payload;
		},
		resetState: (pState, action) => {
			// no payload
			//purgeStoredState();
			return initialState;
		},
		overwriteState: (pState, action) => {
			// action.payload is { _Pantries: [], currentPantry: int } loaded from remote store
			return action.payload;
		}
*/
	}
});

export const pantriesReducer = pantriesSlice.reducer;

export const {
	setPantry,
	addPantry,
	deletePantry,
	updatePantry,
	toggleStaple,
	toggleInCart,
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

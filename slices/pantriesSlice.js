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
			// updates currentPantry to the action payload
			Utils.debug('setPantry', [ action ]);
			return { ...pantriesState, currentPantry: action.payload }
		},
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
		addItem: (pantriesState, action) => {
			// Expects a string as an action payload, which it then splits at the parentheses
			// searches the inventory for the action payload, then toggles its needed/listed states if found
			// or adds a new item if not found
			if(!action.payload) return pantriesState;
			let [ name = 'New item', qty = '1' ] = action.payload.split(',', 2);
			const idx = Utils.camelize(name);

			item = pantriesState._Pantries[pantriesState.currentPantry].inventory.find(i => i.id === idx);
/*
			const item = typeof(action.payload) === 'string'
				? pantriesState._Pantries[pantriesState.currentPantry].inventory.find(i => i.id === action.payload)
				: typeof(action.payload) === 'object'
					? pantriesState._Pantries[pantriesState.currentPantry].inventory.find(i => i.id === action.payload.id)
					: null;
*/

			if(typeof(item) === 'object')
			{
				item.listed = true;
				item.needed = true;
				pantriesState._Pantries[pantriesState.currentPantry].modifyDate = Date.now();
			} else {
				pantriesState._Pantries[pantriesState.currentPantry].inventory.push(createPantryItem({ name, id: idx, qty }));
				pantriesState._Pantries[pantriesState.currentPantry].modifyDate = Date.now();
			}
		},
		deleteItem: (pantriesState, action) => {
			// Expects an item ID as the action payload
			console.log('deleteItem', action);
			/*
			const item = typeof(action.payload) === 'string'
				? pantriesState._Pantries[pantriesState.currentPantry].inventory.find(i => i.id === action.payload)
				: typeof(action.payload) === 'object'
					? pantriesState._Pantries[pantriesState.currentPantry].inventory.find(i => i.id === action.payload.id)
					: null;
			*/

			pantriesState._Pantries[pantriesState.currentPantry].inventory =
				pantriesState._Pantries[pantriesState.currentPantry].inventory.filter(i => i.id !== action.payload);
		},
		updateItem: (pantriesState, action) => {
			// Expects { itemID, newItemOb } as action.payload
			const { itemID, updatedItem } = action.payload;
			const initItem = pantriesState._Pantries[pantriesState.currentPantry].inventory.find(i => i.id === itemID);
			const index = initItem ? pantriesState._Pantries[pantriesState.currentPantry].inventory.indexOf(initItem) : null;
			console.log('updateItem called:', updatedItem, index);
			index !== -1
				&& pantriesState._Pantries[pantriesState.currentPantry].inventory.splice(index, 1, updatedItem)
				|| pantriesState._Pantries[pantriesState.currentPantry].inventory.push(updatedItem);
		}
	}
});

export const pantriesReducer = pantriesSlice.reducer;

export const { setPantry } = pantriesSlice.actions;
export const { toggleNeeded } = pantriesSlice.actions;
export const { toggleListed } = pantriesSlice.actions;
export const { toggleStaple } = pantriesSlice.actions;
export const { addItem } = pantriesSlice.actions;
export const { deleteItem } = pantriesSlice.actions;
export const { updateItem } = pantriesSlice.actions;

/*

				// another option might be to have the payload be the modified item instead of the ID
		// so like: payload: { ...item, listed: !item.listed }
				inv = _Pantries[currentPantry].inventory;
				item = inv.find(i => i.id === action.payload);
				return ({
					...pantriesState,
					_Pantries[currentPantry]: {
						..._Pantries[currentPantry],
						inventory: [
							...inv.filter(i => i.id !== action.payload),
							{
								...inv.find(i => i.id === action.payload),
								listed: !inv.find(i => i.id === action.payload).listed
							}
						]
					}
				})

				or

				return ({
					...pantriesState,
					_Pantries[currentPantry]: {
						..._Pantries[currentPantry],
						inventory: [
							...inv.filter(i => i.id !== action.payload.id),
							action.payload
						]
					}
				})
				// this has the side effect of messing with the inventory order,
				// but that's a problem with the original method as well
				// if we don't like that we can use splice - item - splice


			if(list.includes(([ item ]) => item === action.payload)) return {
				...pantriesState, // { _Pantries: { pantry1: {...}, pantry2: {...}, ... }, currentPantry: 'pantryID' }
				_Pantries[currentPantry]: {
					..._Pantries[currentPantry],
					shoppingList: [
						...list.filter(([ item ]) => item !== action.payload),
						[ item, !list.find(([ item ]) => item === action.payload)[1] ]
					]
				}
			}
		}
	}
*/

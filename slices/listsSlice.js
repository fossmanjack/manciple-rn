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
			if(!Object.keys(lState._Lists).includes(action.payload)) {
				Utils.debugMsg('setList: invalid listID! '+action.payload, Utils.VERBOSE);
				return lState;
			} else {
				Utils.debugMsg('setList: '+action.payload, Utils.VERBOSE);
				return { ...lState, currentList: action.payload }
			}
		},
		addList: (lState, action) => {
			// action.payload = [ listID, { list object }]
			// Adds listID: pantry to _Lists
			// Will not allow listID or pantry.name overwrite
			// use this ONLY when creating a new pantry from scratch
			// imports should use importPantry
			Utils.debugMsg('addList: '+action.payload, Utils.VERBOSE);
			if(!action.payload) return lState;
			const [
				listID = Utils.genuuid(),
				newList = Utils.createPantry()
			] = action.payload;

			// Don't allow overwrites using this function
			if(Object.keys(lState._Lists).includes(listID)) return lState;

			// Don't allow name collisions
			if(Object.keys(lState._Lists).find(key => Utils.collisionCheck(lState._Lists[key].name, newList.name)))
				return lState;

			return {
				...lState,
				_Lists: {
					...lState._Lists,
					[listID]: newList
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
			// update an existing list, mostly like staples and such
			// action.payload is [ listID, { ...props } ]
			// use this when importing a list ...  no, we'll write an importList function

			if(!action.payload) return lState;

			const [ listID, props ] = action.payload;
			if(!listID || !props) return lState;

			// Can't do anything unless the list exists
			if(!Object.keys(lState._Lists).includes(listID)) return lState;

			// Name collisions are still not ok
			if(props.name && Object.keys(lState._Lists).filter(key => key !== listID)
					.find(key => Utils.collisionCheck(lState._Lists.name, props.name)))
					props.name = props.name+' '+Utils.genuuid(6);
/*
			// Name collisions are still not ok
			// if no prop.name we can safely
			const incomingName = Object.keys(lState._Lists).includes(listID)
				? lState._Lists[listID].name
				: props.name || 'New list '+Utils.genuuid(6);
			if(Object.keys(lState._Lists).find(key => Utils.collisonCheck(lState._Lists[key].name, incomingName)))
				props.name = ''+props.name+' '+Utils.genuuid(6);
*/

			return {
				...lState,
				_Lists: {
					...lState._Lists,
					[listID]: {
						...lState._Lists[listID],
						...props,
						modifyDate: Date.now()
					}
				}
			};
		},
		importList: (lState, action) => {
			// Import an existing list
			// Will overwrite list if it exists
			// action.payload is [ listID, { list object } ]
			const [ listID = Utils.genuuid(), newList = Utils.createShoppingList() ] = action.payload;

			return {
				...lState,
				_Lists: {
					...lState._Lists,
					[listID]: {
						...newList,
						modifyDate: Date.now()
					}
				}
			}
		},

		// pantry inventory management
		addItemToList: (lState, action) => {
			// Update an item in inventory
			// action.payload is [ itemID, { props }, listID ]
			// Note that if item is in inventory already it'll be overwritten
			Utils.debugMsg('addItemToList '+JSON.stringify(lState)+' '+JSON.stringify(action), Utils.VERBOSE);
			if(!action.payload) return lState;
			const [ itemID, props, listID = lState.currentList ] = action.payload;
			if(!itemID || !props) return lState;

			return {
				...lState,
				_Lists: {
					...lState._Lists,
					[listID]: {
						...lState._Lists[listID],
						inventory: {
							...lState._Lists[listID].inventory,
							[itemID]: props
						}
					}
				}
			};
		},
		deleteItemFromList: (lState, action) => {
			// Delete an item from pantry inventory object
			// action payload is [ itemID, listID ]
			if(!action.payload) return lState;

			const [ itemID, listID = lState.currentList ] = action.payload;

			const newInv = { ...lState._Lists[listID].inventory };
			delete newInv[itemID];

			return {
				...lState,
				_Lists: {
					...lState._Lists,
					[listID]: {
						...lState._Lists[listID],
						inventory: newInv
					}
				}
			};
		},
		updateItemInList: (lState, action) => {
			// Update an item in inventory
			// action.payload is [ itemID, { props }, listID ]
			Utils.debugMsg('updateItemInPantry: '+JSON.stringify(action), Utils.VERBOSE);
			if(!action.payload) return lState;
			Utils.debugMsg('payload present');

			const [ itemID, props, listID = lState.currentList ] = action.payload;
			if(!itemID || !props) return lState;
			Utils.debugMsg('itemID: '+itemID+'\nprops: '+props+'\nlistID: '+listID);


			if(!Object.keys(lState._Lists[listID].inventory).includes(itemID)) return lState;
			Utils.debugMsg('updateItemInPantry passed short-circuits');

			return {
				...lState,
				_Lists: {
					...lState._Lists,
					[listID]: {
						...lState._Lists[listID],
						inventory: {
							...lState._Lists[listID].inventory,
							[itemID]: {
								...lState._Lists[listID].inventory[itemID],
								...props
							}
						}
					}
				}
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
	importList,
	addItemToList,
	deleteItemFromList,
	updateItemInList
} = listsSlice.actions;

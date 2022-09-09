// itemStoreSlice.js
// Handles actions for adding, updating, or deleting items
// 76149.1: updated to standardize inputs and treat _ItemStore as an object

import { createSlice } from '@reduxjs/toolkit';
import { INVENTORY } from '../res/DEFAULT';
import * as Utils from '../utils/utils';

const initialState = {
	_ItemStore: ITEMSTORE,
	_History: { },
	_Images: { },
	deleted: [ ]
}

const itemStoreSlice = createSlice({
	name: 'itemStore',
	initialState,
	reducers: {
		// all reducers should take itemID or [ itemID, { props }] as payload
		addItem: (iState, action) => {
			// For adding a new item to inventory, but can handle item updates as well
			// Expects an array [ itemID, { item }] as payload
			if(!action.payload) return iState;
			let [ itemID, props ] = action.payload;
			if(!itemID || !props || props.type !== 'item') return iState;

			// does the item already exist?  If so, treat as an update
			if(Object.keys(iState._ItemStore).includes(itemID)) {
				props = {
					...iState._ItemStore[itemID],
					...props
				};
			}

			// does the item share a camelized name with an existing item?  If so,
			// use those values instead
			if(Object.values(iState._ItemStore).find(ob => Utils.camelize(ob.name) === Utils.camelize(props.name))) {
				itemID = Object.keys(iState._ItemStore).find(key =>
					Utils.camelize(iState._ItemStore[key].name) === Utils.camelize(props.name));
				props = {
					...iState._ItemStore[itemID],
					...props
				};
			}

			// replace or insert the object associated with the itemID
			return {
				...iState,
				_ItemStore: {
					...iState._ItemStore,
					[itemID]: props
				}
			}
		},
		updateItem: (iState, action) => {
			// For updating an existing item
			// expects [ itemID, { updatedProps }] as payload
			console.log('Inv: updateItem,', action);
			if(!action.payload) return iState;
			const [ itemID, props ] = action.payload;
			if(!itemID || !props) return iState;

			//props = { ...props, modifyDate: Date.now() };
			return {
				...iState,
				_ItemStore: {
					...iState._ItemStore,
					[itemID]: {
						...iState._ItemStore[itemID],
						...props
					}
				}
			}
		},
		deleteItem: (iState, action) => {
			// For deleting an item from inventory
			// expects an item ID
			if(!action.payload) return iState;
			const newInv = { ...iState._ItemStore };
			const newHist = { ...iState._History };
			const newImg = { ...iState._Images };

			delete newInv[action.payload];
			delete newHist[action.payload];
			delete newImg[action.payload];

			return {
				...iState,
				_ItemStore: newInv,
				_History: newHist,
				_Images: newImg,
				deleted: [ ...iState.deleted, action.payload ]
			};
		},
		clearDeleted: (iState, action) => {
			// once the remote delete operation has run, clear the state
			return { ...iState, deleted: [ ] };
		},
		updateHistory: (iState, action) => {
			// update the purchase history of an item
			// expects [ itemID, newDate ] as action.payload
			if(!action.payload) return iState;

			const [ itemID, newDate ] = action.payload;
			if(!itemID || !newDate) return iState;

			const newHist = [ newDate, ...iState._History[action.payload] || [] ];

			return {
				...iState,
				_History: {
					...iState._History,
					[itemID]: newHist;
				}
			};
		},
		deleteHistory: (iState, action) => {
			// delete an item from purchase history
			// expects [ itemID, histIdx ] as payload
			if(!action.payload) return iState;

			const [ itemID, histIdx ] = action.payload;
			if(!itemID || !histIdx) return iState;

			const newHist = [
				...iState._History[action.payload].slice(0, histIdx),
				...iState._History[action.payload].slice(histIdx + 1)
			];

			return {
				...iState,
				_History: {
					...iState._History,
					[itemID]: newHist
				}
			};
		},
		clearHistory: (iState, action) => {
			// clear an item's purchase history
			// expects itemID as payload
			if(!action.payload) return iState;

			const newHist = [ ...iState._History ];
			delete newHist[action.payload];

			return {
				...iState,
				_History: newHist
			}
		},
		addImage: (iState, action) => {
			// Add an image to _Images
			// Expects [ itemID, imageData ] as payload
			if(!action.payload) return iState;

			const [ itemID, imageData ] = action.payload;
			if(!itemID || !imageData) return iState;

			const newImg = [ ...iState._Images[itemID] || [], imageData ];

			return {
				...iState,
				_Images: {
					...iState._Images,
					[itemID]: newImg
				}
			};
		},
		deleteImage: (iState, action) => {
			// Delete an image
			// Expects [ itemID, imgIndex ] as payload
			if(!action.payload) return iState;

			const [ itemID, imgIndex ] = action.payload;
			if(!itemID || !imgIndex) return iState;

			const newImg = [
				...iState._Images[itemID].slice(0, imgIndex),
				...iState._Images[itemID].slice(imgIndex + 1)
			];

			return {
				...iState,
				_Images: {
					...iState._Images,
					[itemID]: newImg
				}
			};
		},
		updateInterval: (iState, action) => {
			// update the purchase interval of an item
			// expects itemID as payload
			if(!action.payload) return iState;
			const updatedItem = { ...iState._ItemStore[action.payload] };
			if(Utils.nullp(updatedItem)) return iState;

			updatedItem.interval = Utils.calculateInterval(updatedItem);

			return {
				...iState,
				_ItemStore: {
					...iState._ItemStore,
					[itemID]: updatedItem
				}
			}
		}
	}
});

export const itemStoreReducer = itemStoreSlice.reducer;

export const {
	addItem,
	updateItem,
	deleteItem,
	clearDeleted,
	updateHistory,
	deleteHistory,
	clearHistory,
	addImage,
	deleteImage,
	updateInterval
} = itemStoreSlice.actions;


// ItemEditModal.js
// Exposes an item's props for editing, then dispatches the changes to the
// appropriate stores

// React, RN, RNE imports
import { useState, useEffect } from 'react';
import {
	Modal,
	Text,
	TextInput,
	View
} from 'react-native';
import {
	Button,
	Input
} from 'react-native-elements';
import { useSelector } from 'react-redux';

// slices
import * as Lists from '../slices/listsSlice';
import * as Istore from '../slices/itemStoreSlice';

// Xstate
import { useXstate } from '../res/Xstate';
import * as Utils from '../utils/utils';

export default function ItemEditModal() {
	const {
		itemToEdit: itemID,
		showItemEdit,
		dispatch,
		setXstate,
		parseName,
		nullp
	} = useXstate();
	const { _ItemStore, _History, _Images } = useSelector(S => S.itemStore);
	const { _Lists, currentList } = useSelector(S => S.lists);
	// updatedItem holds the props that have been changed
	// refItem populates the fields and is kept in sync with updatedItem
	const [ updatedItem, setUpdatedItem ] = useState({});
	const [ refItem, setRefItem ] = useState(
		{
			..._ItemStore[itemID],
			..._Lists[currentList].inventory[itemID],
			history: _History[itemID] ? [ ..._History[itemID] ] : [],
			images: _Images[itemID] ? [ ..._Images[itemID] ] : []
		}
	);

	// tracking this separately because it's handled separately
	// staple and purchaseBy are handled elsewhere

	Utils.debugMsg('Rendering ItemEditModal with itemID: '+itemID+
		'\n\trefItem: '+refItem, Utils.VERBOSE);

	const handleCommit = _ => {
		if(Object.keys(updatedItem).length) { // only do stuff if there are changes
			const newItem = { ...updatedItem };

			const toList = {};

			if(newItem.qty) {
				toList.qty = newItem.qty;
				delete newItem.qty;
			}
			if(newItem.inCart) {
				toList.inCart = newItem.inCart;
				delete newItem.inCart;
			}
			if(newItem.purchaseBy) {
				toList.purchaseBy = newItem.purchaseBy;
				delete newItem.purchaseBy;
			}

			if(newItem.history && newItem.history.length) {
				dispatch(Istore.updateHistory([ itemID, newItem.history ]));
				delete newItem.history;
			}

			if(newItem.images && newItem.images.length) {
				dispatch(Istore.updateImages([ itemID, newItem.images ]));
				delete newItem.images;
			}

			// Everything left should belong to _ItemStore

			if(Object.keys(newItem).length)
				dispatch(Istore.updateItem([ itemID, newItem ]));

			// Since CurrentListView is subscribed to the List inventory,
			// update that last

			if(Object.keys(toList).length)
				dispatch(Lists.updateItemInList([ itemID, toList, currentList ]));
		}
/*
		dispatch(Pantry.updateItem({
			updatedItem: { ...updatedItem, id: Utils.camelize(updatedItem.name) },
			itemID: item.id
		}));
		// In order to ensure the pantry data is ready to go before the PantryScreen
		// re-render triggers, handle the pantry data first

		// if the itemID changes then the pantry is going to contain a useless ref
		// so if it's changed we have to remove all

		if(item.id === refItem.id)
			dispatch(Pantry.updateItemInPantry([ item.id, { qty: updatedQty } ]));
		else {
			item.parents.forEach(id => {
				// first grab and hold the metadata
				const tempData = _Lists.find(ptr => ptr.id === id) ? {
					...Pantries[_Lists.indexOf(_Lists.find(ptr => ptr.id === id))].inventory[item.id]
				} : false;
				// now we can remove the stale ref
				dispatch(Pantry.deleteItemFromPantry([ item.id, id ]));
				// if there was metadata to be stored, push the metadata under the
				// new itemID
				if(tempData)
					dispatch(Pantry.addItemToPantry([ refItem.id, tempData, id ]));
			});
		}

		// now that the pantry updates have been dispatched, push the item update to
		// inventory.  The itemIDs should then match when PantryScreen registers the
		// _ItemStore update via useEffect
		dispatch(Inv.updateItem([
			item.id,
			{ ...updatedItem, id: Utils.sanitize(Utils.camelize(updatedItem.name.trim())) }
		]));
		setVisible(!visible);
*/
	}

	const handleClose = _ => setXstate({ showItemEdit: false });

	const setProp = (field, val) => setUpdatedItem({ ...updatedItem, [field]: val.trim() });
/*
		setUpdatedItem({ ...updatedIte
		console.log('setProp', field, val);
		field === 'qty' && setUpdatedQty(val);
		field === 'name' && setUpdatedItem({
			...updatedItem, id: Utils.sanitize(Utils.camelize(val.trim()))
		});
		setUpdatedItem({ ...updatedItem, [field]: val.trim() });
	}
*/

	// subscribe to updatedItem to keep it synced with refItem
	useEffect(_ => setRefItem({ ...refItem, ...updatedItem }), [ updatedItem ]);

	return (
		<Modal
			transparent={false}
			visible={showItemEdit}
			onRequestClose={handleClose}
		>
			<Text>
				Name
			</Text>
			<Input
				placeholder='Item name'
				value={refItem.name}
				onChangeText={t => setProp('name', t)}
			/>
			<View style={{
				flexDirection: 'row'
			}}>
				<Button
					title='Commit'
					onPress={handleCommit}
				/>
				<Button
					title='Cancel'
					onPress={handleClose}
				/>
			</View>
		</Modal>
	);
}

/*

			<Modal
				transparent={false}
				visible={showModal}
				onRequestClose={_ => setShowModal(!showModal)}
			>
				<Text>
					Name
				</Text>
				<Input
					placeholder='Item name'
					value={updatedName}
					onChangeText={t => setUpdatedName(t)}
				/>
				<Text>
					Quantity
				</Text>
				<Input
					placeholder='Quantity'
					value={updatedQty}
					onChangeText={t => setUpdatedQty(t)}
				/>
				<Text>
					Price
				</Text>
				<Input
					placeholder='Price'
					value={updatedPrice}
					onChangeText={t => setUpdatedPrice(t)}
				/>
				<Text>
					Location
				</Text>
				<Input
					placeholder='Location'
					value={updatedLoc}
					onChangeText={t => setUpdatedLoc(t)}
				/>
				<Text>
					URL
				</Text>
				<Input
					placeholder='URL'
					value={updatedURL}
					onChangeText={t => setUpdatedURL(t)}
				/>
				<Text>
					UPC
				</Text>
				<Input
					placeholder='UPC'
					value={updatedUPC}
					onChangeText={t => setUpdatedUPC(t)}
				/>
				<Text>
					Interval
				</Text>
				<Input
					placeholder='Purchase interval'
					value={updatedInterval}
					keyboardType='number-pad'
					onChangeText={t => setUpdatedInterval(t)}
				/>
				<Text>
					Notes
				</Text>
				<Input
					placeholder='Notes'
					value={updatedNotes}
					onChangeText={t => setUpdatedNotes(t)}
				/>
				<Button
					title='Commit'
					onPress={_ => handleEditItemCommit()}
				/>
				<Button
					title='Cancel'
					onPress={_ => resetState()}
				/>
			</Modal>


*/

// ItemEditModal.js
// Exposes an item's props for editing, then dispatches the changes to the
// appropriate stores

// React, RN, RNE imports
import { useState, useEffect } from 'react';
import {
	Modal,
	ScrollView,
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
			const newItem = {};

			// sanitize the inputs as needed
			Object.keys(updatedItem).forEach(key => {
				if(typeof updatedItem[key] === 'string')
					newItem[key] = updatedItem[key].trim();
				else newItem[key] = updatedItem[key];
			});

			const toList = {};

			setXstate({ 'showItemEdit': false });

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
			// EDIT: removing this last part entirely since changing lists messes
			// everything up, and the only list-specific setting exposed here would
			// be quantity -- staple and purchaseBy are handled with dedicated buttons
			// so let's just do that with quantity as well.
/*
			if(Object.keys(toList).length)
				dispatch(Lists.updateItemInList([ itemID, toList, currentList ]));
*/
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

	const setProp = (field, val) => setUpdatedItem({ ...updatedItem, [field]: val });
/*
		setUpdatedItem({ ...updatedIte
		console.log('setProp', field, val);
		field === 'qty' && setUpdatedQty(val);
		field === 'name' && setUpdatedItem({
			..._Lists[currentList].inventory[itemID],
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
			style={{ flex: 1 }}
		>
			<ScrollView style={{ flex: 1 }}>
			<Input
				placeholder='Item name'
				value={refItem.name}
				onChangeText={t => setProp('name', t)}
				label='Item name'
			/>
			<View style={{ flexDirection: 'row', flex: 1 }}>
				<Input
					placeholder='Default quantity'
					value={refItem.defaultQty}
					onChangeText={t => setProp('defaultQty', t)}
					label='Default quantity'
					containerStyle={{ flex: 2 }}
				/>
				<Input
					placeholder='Price'
					value={refItem.price}
					onChangeText={t => setProp('price', t)}
					label='Price'
					containerStyle={{ flex: 2 }}
				/>
			</View>
			<View style={{ flexDirection: 'row', flex: 1 }}>
				<Input
					placeholder='Location'
					value={refItem.loc}
					onChangeText={t => setProp('loc', t)}
					label='Location'
					containerStyle={{ flex: 2 }}
				/>
				<Input
					placeholder='Interval in days'
					value={refItem.interval}
					onChangeText={t => setProp('interval', t)}
					label='Interval'
					containerStyle={{ flex: 2 }}
				/>
			</View>
			<Input
				placeholder='url'
				value={refItem.url}
				onChangeText={t => setProp('url', t)}
				label='URL'
			/>
			<Input
				placeholder='UPC'
				value={refItem.upc}
				onChangeText={t => setProp('upc', t)}
				label='UPC'
			/>
			<Input
				placeholder='Notes'
				value={refItem.notes}
				onChangeText={t => setProp('notes', t)}
				label='Notes'
				multiline
				numberOfLines={3}
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
			</ScrollView>
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

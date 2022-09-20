// PantryDeleteDialog.js
// Confirms deletion of pantry and asks if you want to delete all
// associated items

// community imports
import { useState, useContext } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import Dialog from 'react-native-dialog';

// slice imports
import * as Istore from '../slices/itemStoreSlice';
import * as Lists from '../slices/listsSlice';

// utils
import * as Utils from '../utils/utils';
import { useXstate } from '../res/Xstate';

export default function ListDeleteDialog() {
	const {
		listToEdit: listID,
		setXstate,
		dispatch,
		deleteItems,
		showListDelete
	} = useXstate();
	const { _ItemStore } = useSelector(S => S.itemStore);
	const { _Lists, currentList } = useSelector(S => S.lists);

	const handleCancel = _ => {
		setXstate({ 'showListDelete': false });
	}

	const handleConfirm = _ => {
		const listToDelete = ''+listID; // make sure this doesn't change
		const keys = Object.keys(_Lists);
		// First make sure we're not deleting our only list, because that will
		// break things up real good
		if(keys.length < 2) {
			Alert.alert(
				'Cannot delete list!',
				'You must have at least one list.  If you would like to clear and '+
				'initialize your current list, press \"Clear.\"',
				[
					{
						text: 'Cancel',
						style: 'cancel'
					},
					{
						text: 'Clear',
						onPress: _ => dispatch(Lists.updateList([ keys[0], Utils.createShoppingList({}) ]))
					}
				],
				{ cancelable: true }
			);
			return;
		}

		// listToEdit will be invalid once the list is deleted so we have to
		// account for that
		const idx = keys.indexOf(listToDelete);

		// If trying to delete list 0, shift to list 1, otherwise shift down
		// one list.  We know we have at least two lists since we're past that
		// check already
		const newID = idx === 0 ? keys[1] : keys[idx - 1];

		// Need to switch to a new list before deleting the currentList
		if(currentList === listToDelete) {
			console.log('trying to delete current list!');
			dispatch(Lists.setList(newID));
		}

		setXstate({ 'listToEdit': newID, 'showListDelete': false });
		dispatch(Lists.deleteList(listToDelete));
		console.log('currentList', currentList);
		console.log(_Lists);

		// Now remove all references to the deleted listID from item store
		const itemsArr = Object.keys(_ItemStore).filter(itemID => _ItemStore[itemID].parents.includes(listToDelete));

		itemsArr.forEach(itemID => {
			// remove the deleted pantry from parents
			rents = _ItemStore[itemID].parents.filter(ptID => ptID === listToDelete);
			// if clear flag is set and no parents remain, delete the item from inventory
			if(deleteItems && !rents.length)
				dispatch(Istore.deleteItem(itemID));
			// otherwise update the item with the new, potentially empty, parents array
			else
				dispatch(Istore.updateItem([ itemID, { parents: rents } ]));
		});
	}

	return (
		<Dialog.Container visible={showListDelete}>
			<Dialog.Title>
				Delete List?
			</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to delete the list '{_Lists[listID].name || 'unknown'}'?  You
				cannot undo this action.
			</Dialog.Description>
			<Dialog.Switch
				label='Delete associated items from store'
				value={deleteItems}
				onValueChange={val => setXstate({ 'deleteItems': val })}
			/>
			<Dialog.Button label='Cancel' onPress={handleCancel} />
			<Dialog.Button label='Confirm' onPress={handleConfirm} />
		</Dialog.Container>
	);
}


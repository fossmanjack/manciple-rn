// PantryDeleteDialog.js
// Confirms deletion of pantry and asks if you want to delete all
// associated items

// community imports
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Dialog from 'react-native-dialog';

// slice imports
import * as Istore from '../slices/itemStoreSlice';
import * as Lists from '../slices/listsSlice';

// utils
import * as Utils from '../utils/utils';

export default function ListDeleteDialog({ _Xstate }) {
	const { listToEdit: listID, funs: { setXstate, dispatch } } = _Xstate;
	const { _ItemStore } = useSelector(S => S.itemStore);
	const { _Lists, currentList } = useSelector(S => S.lists);

	const handleCancel = _ => {
		setXstate({ 'showListDelete': false });
	}

	const handleConfirm = _ => {
		const keys = Object.keys(_Lists);
		if(keys.length < 2) {
			setXstate({ 'showListDelete': false });
			Alert.alert(
				'Cannot delete list!',
				'You must have at least one list.  If you would like to clear and',
				'initialize your current list, press \"Clear.\"',
				[
					{
						text: 'Cancel',
						style: 'cancel'
					},
					{
						text: 'Clear',
						onPress: _ => dispatch(Lists.updateList([ keys[0], Utils.createList() ]))
					}
				],
				{ cancelable: true }
			);
			return;
		}
		if(currentList === listID) {
			console.log('trying to delete current list!');
			const keys = Object.keys(_Lists);
			const idx = keys.indexOf(listID);
			const newID = keys[0] === listID ? keys[1] || '' : keys[0];
			dispatch(Lists.setList(newID));
		}

		console.log('currentList', currentList);
		dispatch(Lists.deleteList(listID));
		console.log(_Lists);

		// Now remove all references to the deleted listID from item store
		const itemsArr = Object.keys(_ItemStore).filter(itemID => _ItemStore[itemID].parents.includes(listID));

		itemsArr.forEach(itemID => {
			// remove the deleted pantry from parents
			rents = _ItemStore[itemID].parents.filter(ptID => ptID === listID);
			// if clear flag is set and no parents remain, delete the item from inventory
			if(_Xstate.deleteItems && !rents.length)
				dispatch(Istore.deleteItem(itemID));
			// otherwise update the item with the new, potentially empty, parents array
			else
				dispatch(Istore.updateItem([ itemID, { parents: rents } ]));
		});
	}

	return (
		<Dialog.Container visible={_Xstate.showListDelete}>
			<Dialog.Title>
				Delete List?
			</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to delete the list '{_Lists[listID].name}'?  You
				cannot undo this action.
			</Dialog.Description>
			<Dialog.Switch
				label='Delete associated items from store'
				value={_Xstate.deleteItems}
				onValueChange={val => setXstate({ 'deleteItems': val })}
			/>
			<Dialog.Button label='Cancel' onPress={handleCancel} />
			<Dialog.Button label='Confirm' onPress={handleConfirm} />
		</Dialog.Container>
	);
}


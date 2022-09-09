// PantryDeleteDialog.js
// Confirms deletion of pantry and asks if you want to delete all
// associated items

// community imports
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Dialog from 'react-native-dialog';

// slice imports
import * as Inv from '../slices/itemStoreSlice';
import * as Pantry from '../slices/listsSlice';

// utils
import * as Utils from '../utils/utils';

export default function PantryDeleteDialog(props) {
	const { _Xstate, setXstate, listID, setPantryID } = props;
	const { dispatch } = _Xstate;
	const { _ItemStore } = useSelector(S => S.inventory);
	const { _Lists, currentList } = useSelector(S => S.lists);

	const handleCancel = _ => {
		setXstate({ 'showPantryDelete': false });
	}

	const handleConfirm = _ => {
		if(currentList === listID) {
			console.log('trying to delete current pantry!');
			const keys = Object.keys(_Lists);
			const idx = keys.indexOf(key => key === listID);

			if(_Lists.length <= idx + 1) dispatch(Pantry.setPantry(keys[idx - 1]));
		}

		console.log('currentList', currentList);
		dispatch(Pantry.deletePantry(listID));
		console.log(_Lists);

		// Now remove all references to the deleted listID from item store
		const itemsArr = Object.keys(_ItemStore).filter(itemID => _ItemStore[itemID].parents.includes(listID));

		itemsArr.forEach(itemID => {
			// remove the deleted pantry from parents
			rents = _ItemStore[itemID].parents.filter(ptID => ptID === listID);
			// if clear flag is set and no parents remain, delete the item from inventory
			if(_Xstate.deleteItems && !rents.length)
				dispatch(Inv.deleteItem(itemID));
			// otherwise update the item with the new, potentially empty, parents array
			else
				dispatch(Inv.updateItem([ itemID, { parents: rents } ]));
		}
	}

	return (
		<Dialog.Container visible={_Xstate.showPantryDelete}>
			<Dialog.Title>
				Delete Pantry?
			</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to delete the pantry '{pantry.name}'?  You
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


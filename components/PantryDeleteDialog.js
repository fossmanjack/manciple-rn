// PantryDeleteDialog.js
// Confirms deletion of pantry and asks if you want to delete all
// associated items

// community imports
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Dialog from 'react-native-dialog';

// slice imports
import * as Inv from '../slices/inventorySlice';
import * as Pantry from '../slices/pantriesSlice';

// utils
import * as Utils from '../utils/utils';

export default function PantryDeleteDialog(props) {
	const { _Xstate, setXstate, pantryID, setPantryID } = props;
	const { dispatch } = _Xstate;
	const { _Inventory } = useSelector(S => S.inventory);
	const { _Pantries, currentPantry } = useSelector(S => S.pantries);

	const handleCancel = _ => {
		setXstate({ 'showPantryDelete': false });
	}

	const handleConfirm = _ => {
		if(currentPantry === pantryID) {
			console.log('trying to delete current pantry!');
			const keys = Object.keys(_Pantries);
			const idx = keys.indexOf(key => key === pantryID);

			if(_Pantries.length <= idx + 1) dispatch(Pantry.setPantry(keys[idx - 1]));
		}

		console.log('currentPantry', currentPantry);
		dispatch(Pantry.deletePantry(pantryID));
		console.log(_Pantries);

		// Now remove all references to the deleted pantryID from item store
		const itemsArr = Object.keys(_Inventory).filter(itemID => _Inventory[itemID].parents.includes(pantryID));

		itemsArr.forEach(itemID => {
			// remove the deleted pantry from parents
			rents = _Inventory[itemID].parents.filter(ptID => ptID === pantryID);
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


import { useState } from 'react';
import { Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from 'react-native-dialog';
import * as Pantry from '../slices/pantriesSlice';

export default function PantryEditDialog(props) {
	const { pantry, setPantry, visible, setVisible } = props;
	const { _Pantries, currentPantry } = useSelector(S => S.pantries);
	const [ input, setInput ] = useState(_Pantries[pantry].name);
	//const blankPantry = ({ 'name': 'Blank list', id: 'blank-list', inventory: [] });
	const dispatch = useDispatch();

	const handleEditPantry = _ => {
		const updatedPantry = {
			..._Pantries[pantry],
			name: input
		};

		setVisible(!visible);
		dispatch(Pantry.updatePantry([ pantry, updatedPantry ]));
	}

	const handleDeletePantry = _ => {
		console.log('handleDeletePantry:', pantry.id);
		setVisible(!visible);

		Alert.alert(
			'Delete pantry?',
			`Are you sure you wish to delete the pantry ${_Pantries[pantry].name}?`,
			[
				{
					text: 'Cancel',
					style: 'cancel'
				},
				{
					text: 'OK',
					onPress: _ => handleDeleteConfirm(),
				}
			]
		);
	}

// redo the flow here to chain the alerts and then handle the cleanup rather than
// doing it in two stages
	const handleDeleteConfirm = _ => {
		if(currentPantry === pantry) {
			console.log('trying to delete current pantry!');
			const keys = Object.keys(_Pantries);
			const idx = keys.indexOf(key => key === pantry);

			if(_Pantries.length <= idx + 1) dispatch(Pantry.setPantry(keys[idx - 1]));
		}

		console.log('currentPantry', currentPantry);
		dispatch(Pantry.deletePantry(pantry));
		console.log(_Pantries);
		Alert.alert(
			'Clean up inventory?',
			'Would you like to delete all items associated with this pantry from ' +
			'your persistent item store?',
			[
				{
					text: 'Yes',
					onPress={_ => handleParentCleanup(''+pantry, true)}
				},
				{
					text: 'No',
					onPress={_ => handleParentCleanup(''+pantry, false)}
				}
			],
			{
				cancelable: true
			},
			{_ => handleParentCleanup(''+pantry, false)}
		);
		setPantry(keys[0]);
	}

	const handleParentCleanup = pantryID, clear => {
		// get all itemIDs for items that have the deleted pantry as a parent
		const itemsArr = Object.keys(_Inventory).filter(itemID => _Inventory[itemID].parents.includes(pantryID));

		itemsArr.forEach(itemID => {
			// remove the deleted pantry from parents
			rents = _Inventory[itemID].parents.filter(ptID => ptID === pantryID);
			// if clear flag is set and no parents remain, delete the item from inventory
			if(clear && !rents.length)
				dispatch(Inv.deleteItem(itemID));
			// otherwise update the item with the new, potentially empty, parents array
			else
				dispatch(Inv.updateItem([ itemID, { parents: rents } ]));
		};
	}

	return (
		<Dialog.Container visible={visible}>
			<Dialog.Title>
				Edit Pantry
			</Dialog.Title>
			<Dialog.Input
				placeholder='Edit pantry name...'
				value={input}
				onChangeText={text => setInput(text)}
			/>
			<Dialog.Button label='Delete List' onPress={handleDeletePantry} />
			<Dialog.Button label='Cancel' onPress={_ => setVisible(!visible)} />
			<Dialog.Button label='OK' onPress={handleEditPantry} />
		</Dialog.Container>
	);
}

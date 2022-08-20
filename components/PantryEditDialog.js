import { useState } from 'react';
import { Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from 'react-native-dialog';
import * as Pantry from '../slices/pantriesSlice';

export default function PantryEditDialog(props) {
	const { pantry, setPantry, visible, setVisible } = props;
	const { _Pantries, currentPantry } = useSelector(S => S.pantries);
	const [ input, setInput ] = useState(pantry.name);
	const blankPantry = ({ 'name': 'Blank list', id: 'blank-list', inventory: [] });
	const dispatch = useDispatch();

	const handleEditPantry = _ => {
		const updatedPantry = {
			...pantry,
			name: input
		};

		setVisible(!visible);
		dispatch(Pantry.updatePantry(updatedPantry));
	}

	const handleDeletePantry = _ => {
		console.log('handleDeletePantry:', pantry.id);
		setVisible(!visible);

		Alert.alert(
			'Delete pantry?',
			`Are you sure you wish to delete the pantry ${pantry.name}?  All of your item and purchase history will be lost!`,
			[
				{
					text: 'Cancel',
					onPress: _ => handlePantryDeleteCancel(),
					style: 'cancel'
				},
				{
					text: 'OK',
					onPress: _ => handleDeleteConfirm(),
				}
			],
			{
				cancelable: true,
				onDismiss: _ => handlePantryDeleteCancel()
			}
		);
	}

	const handleDeleteConfirm = _ => {
		const idx = _Pantries.indexOf(pantry);

		console.log('handlePantryDeleteConfirm', idx, currentPantry);
		if(idx === currentPantry) {
			console.log('trying to delete current pantry!');
			if(_Pantries.length <= idx + 1) dispatch(Pantry.setPantry(currentPantry - 1));
		}

		setPantry(blankPantry);
		console.log('currentPantry:', currentPantry);
		dispatch(Pantry.deletePantry(idx));
		console.log(_Pantries);
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

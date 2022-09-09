import { useState } from 'react';
import { Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from 'react-native-dialog';
import * as Pantry from '../slices/listsSlice';

export default function PantryEditDialog(props) {
	const { _Xstate, setXstate, listID, setPantryID } = props;
	const { dispatch } = _Xstate;
	const { _Lists, currentList } = useSelector(S => S.lists);
	const [ input, setInput ] = useState(_Lists[listID].name);

	const handleEditPantry = _ => {
		const updatedPantry = {
			..._Lists[listID],
			name: input
		};

		setXstate({ 'showPantryEdit', false });
		dispatch(Pantry.updatePantry([ listID, updatedPantry ]));
	}

	const handleDeletePantry = _ => {
		// Offloading pantry deletion to its own component to use the Dialog
		// options
		console.log('handleDeletePantry:', listID);
		setXstate({
			'showPantryEdit': false,
			'showPantryDelete': true
		});
	}

	return (
		<Dialog.Container visible={_Xstate.showPantryEdit}>
			<Dialog.Title>
				Edit Pantry
			</Dialog.Title>
			<Dialog.Input
				placeholder='Edit pantry name...'
				value={input}
				onChangeText={text => setInput(text)}
			/>
			<Dialog.Button label='Delete List' onPress={handleDeletePantry} />
			<Dialog.Button label='Cancel' onPress={_ => setXstate({ 'showPantryEdit': false })} />
			<Dialog.Button label='OK' onPress={handleEditPantry} />
		</Dialog.Container>
	);
}

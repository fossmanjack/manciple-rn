import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from 'react-native-dialog';
import * as Pantry from '../slices/pantriesSlice';

export default function NewPantryDialog(props) {
	const { visible, setVisible } = props;
	const [ input, setInput ] = useState('');
	const { _Pantries, currentPantry } = useSelector(S => S.pantries);
	const dispatch = useDispatch();

	const handleNewPantry = _ => {
		const pantryID = uuid.v4();

		dispatch(Pantry.addPantry([ pantryID, { name: input }]));
		dispatch(Pantry.setPantry(pantryID));

		setInput('');
		setVisible(false);
	}

	return (
		<Dialog.Container visible={visible}>
			<Dialog.Title>
				Create New Pantry
			</Dialog.Title>
			<Dialog.Input
				placeholder='New pantry name...'
				value={input}
				onChangeText={t => setInput(t)}
			/>
			<Dialog.Button
				label='Cancel'
				onPress={_ => {
					setInput('');
					setVisible(false);
				}}
			/>
			<Dialog.Button label='Create' onPress={handleNewPantry} disabled={!input} />
		</Dialog.Container>
	);
}

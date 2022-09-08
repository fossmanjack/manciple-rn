import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from 'react-native-dialog';
import * as Pantry from '../slices/pantriesSlice';

export default function PantryCreateDialog(props) {
	const { _Xstate, setXstate } = props;
	const { dispatch } = _Xstate;
	const [ input, setInput ] = useState('');
	const { _Pantries, currentPantry } = useSelector(S => S.pantries);

	const handleCreatePantry = _ => {
		const pantryID = uuid.v4();

		dispatch(Pantry.addPantry([ pantryID, { name: input }]));
		dispatch(Pantry.setPantry(pantryID));

		setInput('');
		setXstate({ 'showPantryCreate': false });
	}

	return (
		<Dialog.Container visible={_Xstate.showPantryCreate}>
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
					setXstate({ 'showPantryCreate': false });
				}}
			/>
			<Dialog.Button label='Create' onPress={handleCreatePantry} disabled={!input} />
		</Dialog.Container>
	);
}

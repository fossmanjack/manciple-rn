import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from 'react-native-dialog';
import * as Pantry from '../slices/listsSlice';

export default function PantryCreateDialog({ _Xstate }) {
	const { dispatch, setXstate } = _Xstate.funs;
	const [ input, setInput ] = useState('');
	const { _Lists, currentList } = useSelector(S => S.lists);

	const handleCreatePantry = _ => {
		const listID = uuid.v4();

		dispatch(Pantry.addPantry([ listID, { name: input }]));
		dispatch(Pantry.setPantry(listID));

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

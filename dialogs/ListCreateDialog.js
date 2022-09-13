// ListCreateDialog.js
// Dialog for what it says

// React, RN, RNE, redux
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Community
import Dialog from 'react-native-dialog';

// Slices
import * as Lists from '../slices/listsSlice';

export default function ListCreateDialog({ _Xstate }) {
	const { dispatch, setXstate, sanitize } = _Xstate.funs;

	const [ input, setInput ] = useState('');
	const { _Lists, currentList } = useSelector(S => S.lists);

	const handleCreateList = _ => {
		const listID = uuid.v4();

		dispatch(Lists.addList([ listID, { name: sanitize(input.trim()) }]));
		dispatch(Lists.setList(listID));

		setInput('');
		setXstate({ 'showListCreate': false });
	}

	return (
		<Dialog.Container visible={_Xstate.showListCreate}>
			<Dialog.Title>
				Create New List
			</Dialog.Title>
			<Dialog.Input
				placeholder='New list name...'
				value={input}
				onChangeText={t => setInput(t)}
			/>
			<Dialog.Button
				label='Cancel'
				onPress={_ => {
					setInput('');
					setXstate({ 'showListCreate': false });
				}}
			/>
			<Dialog.Button label='Create' onPress={handleCreateList} disabled={!input} />
		</Dialog.Container>
	);
}

// ListCreateDialog.js
// Dialog for what it says

// React, RN, RNE, redux
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Community
import Dialog from 'react-native-dialog';

// Slices
import * as Lists from '../slices/listsSlice';

// Xstate
import { useXstate } from '../res/Xstate';

// Utils
import * as Utils from '../utils/utils';

export default function ListCreateDialog() {
	const { dispatch, setXstate, sanitize, showListCreate, genuuid } = useXstate();

	const [ input, setInput ] = useState('');
	const { _Lists, currentList } = useSelector(S => S.lists);

	const handleCreateList = _ => {
		const listID = genuuid();

		dispatch(Lists.addList([
			listID,
			Utils.createShoppingList({
				name: sanitize(input.trim())
			})
		]));
		dispatch(Lists.setList(listID));

		setInput('');
		setXstate({ 'showListCreate': false, 'listData': [] });
	}

	return (
		<Dialog.Container visible={showListCreate}>
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

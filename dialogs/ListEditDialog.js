// ListEditDialog.js
// Provides the ability to edit the list name

// React, RN, RNE, Redux
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

// Community
import Dialog from 'react-native-dialog';

// Slices
import * as Lists from '../slices/listsSlice';

export default function ListEditDialog({ _Xstate }) {
	const { listToEdit: listID, funs: { dispatch, setXstate, parseName } } = _Xstate;
	const { _Lists, currentList } = useSelector(S => S.lists);

	const [ refList, setRefList ] = useState({ ..._Lists[listID] });
	const [ updatedList, setUpdatedList ] = useState({});

	const handleSubmit = _ => {
		setXstate({ 'showListEdit': false });
		dispatch(Lists.updateList([
			listID,
			updatedList
		]));
		setUpdatedList({});
	}

	const setProp = (field, val) => setUpdatedItem({ ...updatedItem, [field]: parseName(val) });

	const handleDeleteList = _ => {
		// Offloading pantry deletion to its own component to use the Dialog
		// options
		console.log('handleDeleteList:', listID);
		setXstate({
			'showListEdit': false,
			'showListDelete': true
		});
	}

	useEffect(_ => setRefList({ ...refList, ...updatedList }), [ updatedList ]);

	return (
		<Dialog.Container visible={_Xstate.showListEdit}>
			<Dialog.Title>
				Edit List
			</Dialog.Title>
			<Dialog.Input
				placeholder='Edit list name...'
				value={refList.name}
				onChangeText={text => setProp(name, text)}
			/>
			<Dialog.Button label='Delete List' onPress={handleDeleteList} />
			<Dialog.Button label='Cancel' onPress={_ => setXstate({ 'showListEdit': false })} />
			<Dialog.Button label='OK' onPress={handleSubmit} />
		</Dialog.Container>
	);
}

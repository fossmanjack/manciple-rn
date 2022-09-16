// ListEditDialog.js
// Provides the ability to edit the list name

// React, RN, RNE, Redux
import { useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

// Community
import Dialog from 'react-native-dialog';

// Slices
import * as Lists from '../slices/listsSlice';

// Xstate
import { useXstate } from '../res/Xstate';

export default function ListEditDialog() {
	const {
		listToEdit: listID,
		dispatch,
		setXstate,
		parseName,
		showListEdit
	} = useXstate();
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
		<Dialog.Container visible={showListEdit}>
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

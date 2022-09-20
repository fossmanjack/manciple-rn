// TagEditDialog.js
// Add and remove new or existing tags from an item

// React, RN, RNE, Redux
import { useState, useEffect, useContext } from 'react';
import { View } from 'react-native';
import { Chip } from 'react-native-elements';
import { useSelector } from 'react-redux';

// Community
import Dialog from 'react-native-dialog';

// Slices
import * as Istore from '../slices/itemStoreSlice';

// Xstate
import { useXstate } from '../res/Xstate';

export default function TagEditDialog() {
	const {
		itemToEdit: itemID,
		dispatch,
		setXstate,
		parseName,
		debugMsg,
		showTagEdit,
		windowX
	} = useXstate();
	const { _ItemStore } = useSelector(S => S.itemStore);

	const [ tagsStore, setTagsStore ] = useState([]);
	const [ newTagName, setNewTagName ] = useState('');

	const sortTags = tags => tags.sort((a, b) => a > b ? 1 : a < b ? -1 : 0);

	const getAllTags = _ => {
		const tagsAcc = new Set;
		_ItemStore.forEach(item => item.tags.forEach(tag => tagsAcc.add(tag)));

		setTagsStore(sortTags([ ...tagsAcc ]));
	}

/*
	// keep local stateful vars in sync
	useEffect(_ => {
		const tagsAcc = new Set;
		_ItemStore.forEach(item => item.tags.forEach(tag => tagsAcc.add(tag)));

		const tagsStore = [ ...tagsAcc ].sort((a, b) => a > b ? 1 : a < b ? -1 : 0);

		setCurrentTags(_ItemStore[itemID].tags.sort((a, b) => a > b ? 1 : a < b ? -1 : 0));
		setOtherTags(tagsStore.filter(tag => !_ItemStore[itemID].tags.includes(tag)));
	}, [ _ItemStore[itemID] ]);
*/

	const addTagToItem = tag => dispatch(Istore.updateItem([ itemID, { tags: sortTags([ ..._ItemStore[itemID].tags, tag ])} ]));

	const removeTagFromItem = tarTag => dispatch(Istore.updateItem([ itemID, { tags: sortTags(_ItemStore[itemID].tags.filter(tag => tag !== tarTag)) } ]));

	const handleAddNewTag = _ => {
		if(!newTagName) return;
		if(!_ItemStore[itemID].tags.concat(tagsStore).includes(parseName(newTagName)))
			addTagToItem(parseName(newTagName));
		setNewTagName('');
	}

	const CurrentTagChip = ({ tag }) => (
		<Chip
			title={tag}
			buttonStyle={{
				backgroundColor: 'goldenrod',
				marginVertical: 5,
				marginRight: 5
			}}
			onPress={_ => removeTagFromItem(tag)}
			key={`${itemID}-${tag}`}
		/>
	);

	const OtherTagChip = ({ tag }) => (
		<Chip
			title={tag}
			buttonStyle={{
				backgroundColor: 'gray',
				marginVertical: 5,
				marginRight: 5
			}}
			onPress={_ => addTagToItem(tag)}
			key={`${itemID}-${tag}`}
		/>
	);

/*
	const TagMap = _ => {
		const otherTags = tagsStore.filter(tag => !_ItemStore[itemID].tags.includes(tag));

		return _ItemStore[itemID].tags.map(tag => <CurrentTagChip tag={tag} />)
			.concat(otherTags.map(tag => <OtherTagChip tag={tag} />));
	}
*/


	// subscribe to itemID changes
	useEffect(_ => {
		const tagsAcc = new Set;
		Object.keys(_ItemStore).forEach(id => _ItemStore[id].tags.forEach(tag => tagsAcc.add(tag)));

		setTagsStore(sortTags([ ...tagsAcc ].filter(tag => !_ItemStore[itemID].tags.includes(tag))));
	}, [ _ItemStore[itemID] ]);

	return (
		<Dialog.Container
			visible={showTagEdit}
			style={{ flex: 1 }}
		>
			<Dialog.Title>
				Edit Tags
			</Dialog.Title>
			<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
				{
					_ItemStore[itemID].tags.map(tag => {
						console.log('TED render tag:', tag);
						return (
							<CurrentTagChip
								tag={tag}
								key={`${itemID}-${tag}`}
							/>
						);
					})
				}
				{
					tagsStore.map(tag => {
						console.log('TED render other tag:', tag);
						return (<OtherTagChip
							tag={tag}
							key={`${itemID}-${tag}`}
						/>);
					})
				}
			</View>
			<Dialog.Input
				placeholder='Add new tag...'
				value={newTagName}
				onChangeText={text => setNewTagName(text)}
			/>
			<Dialog.Button label='Add' onPress={handleAddNewTag} />
			<Dialog.Button label='Done' onPress={_ => setXstate({ 'showTagEdit': false })} />
		</Dialog.Container>
	);
}

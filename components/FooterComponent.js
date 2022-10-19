// FooterComponent.js
// Provides item add and control buttons

// React, RN, RNE, Redux
import { useState } from 'react';
import {
	Pressable,
	SafeAreaView,
	Text,
	TextInput,
	View
} from 'react-native';
import { useSelector } from 'react-redux';
import { Icon } from 'react-native-elements';


// Slices
import * as Lists from '../slices/listsSlice';
import * as Istore from '../slices/itemStoreSlice';

// Utils
import { _Store } from '../res/_Store';
import { useXstate } from '../res/Xstate';
import * as Utils from '../utils/utils';
import { _Styles } from '../res/_Styles';

export default function Footer() {
	const {
		dispatch,
		dumpXstate,
		parseName,
		checkCollision,
		listData,
		inputText,
		setXstate
	} = useXstate();
	//const { funs: { dispatch, parseName, checkCollision } } = _Xstate;
	//const [ inputText, setInputText ] = useState('');
	const { _Lists, currentList } = useSelector(S => S.lists);
	const { _ItemStore } = useSelector(S => S.itemStore);
	const { uuid } = useSelector(S => S.user);

	const handleSubmit = _ => {
		Utils.debugMsg('handleSubmit: new item '+inputText+' to list '+currentList, Utils.VERBOSE);

		if(inputText) { // if there's text, parse it and add an item to the list
			// parse inputText
			let [ name = 'New item', qty, ...preTags ] = inputText.split(',');
			if(qty) qty = qty.trim();
			const tags = preTags.length ? preTags.map(t => parseName(t)) : [ ];

			Utils.debugMsg('inputText data:'+
				'\n\tname: '+name+
				'\n\tqty: '+qty+
				'\n\ttags: '+JSON.stringify(tags), Utils.VERBOSE);
			// inputText parsing complete

			// does an item with the same parsed name already exist?  If so, use
			// that, otherwise roll a new item
			let itemID = Object.keys(_ItemStore).find(key =>
				Utils.collisionCheck(_ItemStore[key].name, name));
			let refItem, newItem;

			if(itemID) {
				// Fail if there's a matching item already listed
				if(Object.keys(_Lists[currentList].inventory).includes(itemID)) {
					Utils.debugMsg('handleSubmit: item '+itemID+' already listed!');
					return false;
				}

				newItem = {
					parents: [ ...new Set([ ..._ItemStore[itemID].parents, currentList ]) ],
					tags: [ ...new Set([ ..._ItemStore[itemID].tags, ...tags ]) ]
						.sort((a, b) => a > b ? 1 : a < b ? -1 : 0)
				};

				dispatch(Istore.updateItem([ itemID, newItem ]));
			} else {
				itemID = Utils.genuuid();
				newItem = Utils.createListItem({
					name,
					tags,
					parents: [ currentList ],
					defaultQty: qty || ''
				});

				dispatch(Istore.addItem([ itemID, newItem ]));
			}

			Utils.debugMsg('handleSubmit itemID: '+itemID+'\nnewItem: '+JSON.stringify(newItem));

			let purchaseBy = 0;
			if(newItem.interval) {
				let lastBuy = _History[itemID] && _History[itemID][0] ? _History[itemID][0] : Date.now();
				purchaseBy = lastBuy + (refItem.interval * 86400000);
			}

			dispatch(Lists.addItemToList([
				itemID,
				{
					inCart: false,
					qty: qty || newItem.defaultQty || '1',
					addedBy: uuid,
					purchaseBy
				},
				currentList
			]));


/*
export const getAllTags = _ => {
	const tagsAcc = [];

	_ItemStore.forEach(item => tagsAcc.concat(item.tags));

	return [ ...new Set(tagsAcc) ].sort((a, b) =>
		a > b ? 1 : a < b ? -1 : 0);
}

			if(!itemID) {
				// if item doesn't exist, push it to _ItemStore
				itemID = Utils.genuuid();
				const newItem = Utils.createListItem({
					name,
					tags,
					parents: [ currentList ],
					defaultQty: qty || ''
				});
				dispatch(Istore.addItem([ itemID, newItem ]));
			}
			else {
				// otherwise check if the existing item has the current list as
				// a parent, and update it if not
				invItem = { ..._ItemStore[itemID] };
				if(!invItem.parents.includes(currentList))
					dispatch(Istore.updateItem([ itemID, {
						parents: [
							...invItem.parents,
							currentList
						]
					}]));
			}
			// add the item to the list
			dispatch(Lists.addItemToList([ itemID,
				{
					inCart: false,
					qty: qty || invItem.defaultQty || '1',
					purchaseBy: invItem.interval && invItem.history[0]
						? invItem.history[0] + (invItem.interval * 86400000)
						: 0,
				}
			]));
*/

		} else { // if no text, add all staples
			Utils.debugMsg('handleSubmit all: '+JSON.stringify(_Lists[currentList].staples), Utils.VERBOSE);
			_Lists[currentList].staples.forEach(itemID => {
				Utils.debugMsg('processing staple: '+itemID, Utils.VERBOSE);
				// If the item is already listed, continue
				if(Object.keys(_Lists[currentList].inventory).includes(itemID)) return;

				if(!Object.keys(_ItemStore).includes(itemID)) { // if the ID isn't in inventory, toss it
					Utils.debugMsg('handleSubmit all -- bad ID: '+itemID, Utils.WARN);
					dispatch(Lists.updateList([ currentList,
						{
							staples: _Lists[currentList].staples.filter(i => i.id === itemID)
						}
					]));
				} else { // otherwise add it to the list
					console.log('adding item', itemID);
					dispatch(Lists.addItemToList([ itemID,
						{
							inCart: false,
							qty: _ItemStore[itemID].defaultQty || '1',
							purchaseBy: _ItemStore[itemID].interval && _History[itemID][0]
								? _History[itemID][0] + (invItem.interval * 86400000)
								: 0,
						}
					]));
				}
			});
			Utils.debugMsg('handleSubmit all -- done', Utils.VERBOSE);
		}
		Utils.debugMsg('handleSubmit complete', Utils.VERBOSE);
		setInputText('');

	}

	const setInputText = text => setXstate({ inputText: text });

	const handleSweepAll = _ => {

		listData.filter(item => item.inCart).forEach(item => {
			dispatch(Istore.updateHistory([ item.id, Date.now() ]));
			dispatch(Lists.deleteItemFromList([ item.id ]));
		});
	}
/*
	const dumpState = _ => {
		//const state = _Store.getState();
		//console.log(state);
		Utils.debugMsg('Dumping _Xstate ------->', Utils.VERBOSE);
		const dump = { ..._Xstate };
		delete dump.drawer;

		console.log(dump);

	}
*/

	const dumpListData = _ => {
		console.log('Current list data:\n');
		console.log(listData);
	}

	return (
		<SafeAreaView style={{ flexDirection: 'row', alignItems: 'center' }}>
			<TextInput
				style={_Styles.footerTextBox}
				onChangeText={setInputText}
				value={inputText}
				placeholder='Add an item ...'
			/>
			<Icon
				style={_Styles.footerIcon}
				name='plus'
				type='font-awesome'
				color='royalblue'
				reverse
				onPress={handleSubmit}
				disabled={currentList === -1}
			/>
			<Icon
				style={_Styles.footerIcon}
				name='broom'
				type='font-awesome-5'
				color='royalblue'
				reverse
				onPress={handleSweepAll}
			/>
			<Pressable
				onPress={dumpListData}
				onLongPress={dumpXstate}
			>
					<Icon
						style={_Styles.footerIcon}
						name='dump-truck'
						type='material-community'
						color='royalblue'
						reverse
					/>
			</Pressable>
		</SafeAreaView>
	);
}

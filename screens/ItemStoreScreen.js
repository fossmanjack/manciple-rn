// CurrentListScreen.js
// Handles the bulk of the application logic, displays items stored in
// _Lists[currentList].inventory in a third-party SwipeListView, handles
// selection buttons, etc

// react, RN, community imports
import { useState, useEffect } from 'react';
import { Alert, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon } from 'react-native-elements';

// third-party imports
import { SwipeListView } from 'react-native-swipe-list-view';

// custom component imports
import ItemEditModal from '../dialogs/ItemEditModal';
import Header from '../components/HeaderComponent';
import Footer from '../components/FooterComponent';
import ItemDisplay from '../components/ItemDisplayComponent';

// slice imports
import * as Lists from '../slices/listsSlice';
import * as Istore from '../slices/itemStoreSlice';

// utility imports
import { _Styles } from '../res/_Styles';
import * as Utils from '../utils/utils';
import { useXstate } from '../res/Xstate';

export default function ItemStoreScreen() {
	const {
		itemToEdit,
		showItemEdit,
		inputText,
		drawerCtl,
		dispatch,
		setXstate,
		timestamp,
		listData,
		debugMsg,
		parseName
	} = useXstate();
	const { _Lists, currentList } = useSelector(S => S.lists);
	const { _ItemStore, _History, _Images } = useSelector(S => S.itemStore);
	const { sortOpts } = useSelector(S => S.options);

	debugMsg('CurrentListScreen rendered with Xstate: '+useXstate(), Utils.VERBOSE);

	const generateListData = _ => {
		// Data for each listed item is stored in two places: Inventory has the
		// largely-immutable stuff and Lists has the daily changes.  The props
		// don't share names so we can just merge them to build our item data set.
		let keys, retOb;

		if(inputText) {
			const rx = new RegExp(parseName(inputText));
			const srx = new RegExp('^'+parseName(inputText));

			return Object.keys(_ItemStore)
				.filter(itemID => rx.test(parseName(_ItemStore[itemID].name)))
				.map(itemID => {
					retOb = {
						id: itemID,
						..._ItemStore[itemID],
						images: [ ..._Images[itemID] || []],
						history: [ ..._History[itemID] || []],
						staple: _Lists[currentList].staples.includes(itemID)
					};

					if(Object.keys(_Lists[currentList].inventory).includes(itemID))
						retOb = { ...retOb, ..._Lists[currentList].inventory[itemID] };

					return retOb;
				})
				.sort((a, b) => {
					let x = parseName(a.name);
					let y = parseName(b.name);

					if(srx.test(x)) return -1;
					if(srx.test(y)) return 1;

					return x > y ? 1 : x < y ? -1 : 0;
				});
		} else {
			return Utils.sortList(
				Object.keys(_ItemStore)
					.map(itemID => {
					Utils.debugMsg('Mapping refList.inventory: '+itemID, Utils.VERBOSE);

					let retOb = {
						id: itemID,
						..._ItemStore[itemID],
						images: [ ..._Images[itemID] || []],
						history: [ ..._History[itemID] || []],
						staple: _Lists[currentList].staples.includes(itemID)
					};

					// append list metadata if the item is in the current list
					// Is this really necessary?
					if(Object.keys(_Lists[currentList].inventory).includes(itemID)) {
						retOb = {
							...retOb,
							..._Lists[currentList].inventory[itemID],
						}
					};

					return retOb;
				}
			), sortOpts);
		}
	}

	const handleSweep = (itemID, rowMap) => {
		// in this view, sweep deletes the item from the itemstore
		// Pop up an alert to confirm, and on confirmation trigger delete function
		rowMap[itemID].closeRow();

		Alert.alert(
			'Delete item',
			`Are you sure you wish to delete ${_ItemStore[itemID].name} from your `+
			`item store?  The item will be removed from all lists and all `+
			`item history will be lost!`,
			[
				{
					text: 'Cancel',
					style: 'cancel'
				},
				{
					text: 'Confirm',
					onPress: _ => handleDeleteItem(itemID)
				}
			],
			{ cancelable: true }
		);
	}

	const handleDeleteItem = itemID => {
		Object.keys(_Lists).forEach(listID => {
			if(Object.keys(_Lists[listID].inventory).includes(itemID))
				dispatch(Lists.deleteItemFromList([ itemID, listID ]));
		});

		dispatch(Istore.deleteItem(itemID));
	}

	const handleToggleStaple = itemID => {
		Utils.debugMsg('handleToggleStaple: '+itemID, Utils.VERBOSE);

		const staples = [ ..._Lists[currentList].staples ];

		if(staples.includes(itemID)) // remove itemID from array
			dispatch(Lists.updateList([
				currentList,
				{
					staples: staples.filter(i => i !== itemID)
				}
			]));
		else // add itemID to array
			dispatch(Lists.updateList([
				currentList,
				{
					staples: [ ...staples, itemID ]
				}
			]));
	};

	const editItem = (itemID, rowMap) => {
		debugMsg('editItem:\n\titemID: '+JSON.stringify(itemID)+'\n\trowMap: '+rowMap);
		rowMap[itemID].closeRow();

		setXstate({
			'itemToEdit': itemID,
			'showItemEdit': true
		});
	}

	const renderItem = (data, rowMap) => {
		const { item } = data;
		Utils.debugMsg('renderItem: '+JSON.stringify(item, null, 2), Utils.VERBOSE);
		return (
			<ItemDisplay
				item={item}
			/>
		)
	}

	const renderHiddenItem = (data, rowMap) => {
		const { item } = data;
		return (
			<View style={{
				alignItems: 'flex-end',
				justifyContent: 'center',
				borderWidth: 1,
				borderColor: 'purple',
			}}>
				<Button
					onPress={_ => {
							editItem(item.id, rowMap);
						}
					}
					icon={
						<Icon
							name='pencil'
							type='font-awesome'
							color='white'
							style={{ marginRight: 5 }}
						/>
					}
					title='Edit'
					style={{ width: 100 }}
				/>
				<Button
					onPress={_ => handleToggleStaple(item.id)}
					icon={
						<Icon
							name={_Lists[currentList].staples.includes(item.id) ? 'toggle-on' : 'toggle-off'}
							type='font-awesome'
							color='black'
							style={{ marginRight: 5 }}
						/>
					}
					title='Staple'
					type='outline'
				/>
			</View>
		)
	}

	// now that everything is defined, set up the list data subscription
	// We want the list to refresh every time the contents change and
	// since state changes asynchronously we need to check against the state
	// value rather than calling the update method after dispatching a state change

	useEffect(_ => {
		Utils.debugMsg('Subbing to listData: '+currentList, Utils.VERBOSE);
		const newData = generateListData();
		Utils.debugMsg('newData generated with '+newData.length+' items', Utils.VERBOSE);
		//setListData(newData);
		setXstate({ "listData": newData });
	}, [ currentList, _Lists[currentList].inventory, _ItemStore, _History, _Images, inputText ]);

	useEffect(_ => console.log(timestamp(), 'itemToEdit changed!', itemToEdit), [ itemToEdit ]);

	return (
		<>
			<SwipeListView
				data={listData}
				key={listData}
				renderItem={renderItem}
				renderHiddenItem={renderHiddenItem}
				keyExtractor={item => {
					Utils.debugMsg('SwipeListView key extracted: '+item.id, Utils.VERBOSE);
					return item.id;
				}}
				rightOpenValue={-100}
				leftActivationValue={75}
				leftActionValue={500}
				onLeftAction={handleSweep}
				bottomDivider
				closeOnRowPress
				closeOnRowBeginSwipe
				closeOnRowOpen
				closeOnScroll
			/>
			<Footer />
		</>
	);
}

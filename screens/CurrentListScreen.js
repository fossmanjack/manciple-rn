// CurrentListScreen.js
// Handles the bulk of the application logic, displays items stored in
// _Lists[currentList].inventory in a third-party SwipeListView, handles
// selection buttons, etc

// react, RN, community imports
import { useState, useEffect } from 'react';
import { View } from 'react-native';
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

export default function CurrentListScreen({ _Xstate }) {
	const { itemToEdit, showItemEdit, funs: { drawerCtl, dispatch, setXstate, timestamp } } = _Xstate;
	const { _Lists, currentList } = useSelector(S => S.lists);
	const { _ItemStore, _History, _Images } = useSelector(S => S.itemStore);
	const { sortOpts } = useSelector(S => S.options);
	const [ listData, setListData ] = useState(_Xstate.listData || []);

	console.log(timestamp(), 'CurrentListScreen', _Xstate);

	const generateListData = _ => {
		const refList = _Lists[currentList] || Utils.blankList;
		Utils.debugMsg('refreshListData: '+refList.name, Utils.VERBOSE);

		// Data for each listed item is stored in two places: Inventory has the
		// largely-immutable stuff and Lists has the daily changes.  The props
		// don't share names so we can just merge them to build our item data set.
		return Utils.sortList(
			Object.keys(refList.inventory).map(itemID => {
				Utils.debugMsg('Mapping refList.inventory: '+itemID, Utils.VERBOSE);
				return {
					id: itemID,
					..._ItemStore[itemID],
					..._Images[itemID],
					..._History[itemID],
					...refList.inventory[itemID]
				}
			}), sortOpts);
	}

/*
	const dumpListData = _ => {
		console.log('Current list data:\n');
		console.log(listData);
	}
*/


	const handleSweep = (itemID, rowMap) => {
		// remove item from list, conditionally update item history,
		// close row, regenerating list data should happen automatically
		// Lists.deleteItemFromList(itemID)
		// Inv.updateItem(itemID, { updated props })
		rowMap[itemID].closeRow();

		if(rowMap[itemID].props.item.inCart)
			dispatch(Istore.updateHistory([ itemID, Date.now() ]));

		dispatch(Lists.deleteItemFromList([ itemID ]));
	}
/*
	const handleSweepAll = _ => {

		listData.filter(item => item.inCart).forEach(item => {
			dispatch(Istore.updateHistory([ item.id, Date.now() ]));
			dispatch(Lists.deleteItemFromList([ item.id ]));
		});
	}
*/

	const handleToggleStaple = itemID => {
		Utils.debugMsg('handleToggleStaple: '+itemID, Utils.VERBOSE);

		const staples = [ ..._Lists[currentList].staples ];

		if(staples.includes(itemID)) // remove itemID from array
			dispatch(Lists.updateList({
				..._Lists[currentList],
				staples: staples.filter(i => i !== itemID)
			}));
		else // add itemID to array
			dispatch(Lists.updateList({
				..._Lists[currentList],
				staples: [ ...staples, itemID ]
			}));
	};

	const editItem = item => {
		setXstate({
			'itemToEdit': item.id,
			'showItemEdit': true
		});
	}

	const renderItem = (data, rowMap) => {
		const { item } = data;
		Utils.debugMsg('renderItem: '+item.name, Utils.VERBOSE);
		return (
			<ItemDisplay
				item={item}
				_Xstate={_Xstate}
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
							editItem(item);
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
		setListData(newData);
		setXstate({ "listData": newData });
	}, [ _Lists[currentList].inventory ]);

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
			<Footer
				_Xstate={_Xstate}
			/>
		</>
	);
}

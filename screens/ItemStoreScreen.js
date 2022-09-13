// ItemStoreScreen.js
// For managing the item store directly.  Displays items stored in
// _ItemStore with SwipeListView.

// react, RN, community imports
import { useState, useEffect } from 'react';
import { Alert, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon } from 'react-native-elements';

// third-party imports
import { SwipeListView } from 'react-native-swipe-list-view';

// custom component imports
import Header from '../components/HeaderComponent';
import Footer from '../components/FooterComponent';
import ItemDisplay from '../components/ItemDisplayComponent';

// slice imports
import * as Lists from '../slices/listsSlice';
import * as Istore from '../slices/itemStoreSlice';

// utility imports
import { _Styles } from '../res/_Styles';
import * as Utils from '../utils/utils';

export default function ItemStoreScreen({ _Xstate }) {
	const {
		listData,
		itemToEdit,
		showItemEdit,
		funs: { drawerCtl, dispatch, setXstate }
	} = _Xstate;


	const { _Lists, currentList } = useSelector(S => S.lists);
	const { _ItemStore, _History, _Images } = useSelector(S => S.itemStore);
	const { sortOpts } = useSelector(S => S.options);

/*
	const [ showEditItemModal, setShowEditItemModal ] = useState(false);
	const [ itemToEdit, setItemToEdit ] = useState(Object.keys(_ItemStore)[0]);
	const [ showDeleteDialog, setShowDeleteDialog ] = useState(false);
	const [ itemToDelete, setItemToDelete ] = useState('');
	const [ listData, setListData ] = useState([]);
*/

	const toggleItemEditModal = _ => {
		console.log('toggleItemEditModal called');
		setXstate({ 'showItemEdit': !_Xstate.showItemEdit });
	}

	const generateListData = _ => {
		console.log('Istore: generateListData');
		return Utils.sortList(Object.keys(_ItemStore).map(itemID => {
			return {
				id: itemID,
				..._ItemStore[itemID],
				history: [ ..._History[itemID] ],
				images: [ ..._Images[itemID] ]
			}
		}), sortOpts);
	}

	const handleCheckBox = itemID => {
		// Add or remove item from current list
		if(Object.keys(_Lists[currentList].inventory).includes(itemID)) {
			// if it's in the list, remove it
			dispatch(Lists.deleteItemFromList([ itemID, currentList ]));
		} else {
			// if it's not in the list, add it
			const itemRef = _ItemStore[itemID];
			dispatch(Lists.addItemToList([ itemID,
				{
					inCart: false,
					purchaseBy: itemRef.interval && _History[itemID] && _History[itemID].length
						? _History[itemID][0] + (itemRef.interval * 86400000)
						: 0,
					qty: itemRef.defaultQty || '1'
				},
				currentList
			]));
			if(!itemRef.parents.includes(currentList))
				dispatch(Istore.updateItem([ itemID,
					{
						parents: [
							...itemRef.parents,
							currentList
						]
					}
				]));
		}
	}

	const handleSweep = (itemID, rowMap) => {
		const { props: { item }} = rowMap[itemID];

		// swipe item to bring up delete item alert
		Alert.alert(
			'Delete item?',
			`Are you sure you want to delete ${item.name} from ` +
			`the item store?  This will erase all detail and purchase history!`,
			[
				{
					text: 'Cancel',
					style: 'cancel'
				},
				{
					text: 'Confirm',
					onPress: _ => deleteItem(itemID)
				}
			]
		);
	}

	const deleteItem = itemID => {
		dispatch(Istore.deleteItem(itemID));

		Object.keys(_Lists).forEach(listID => {
			if(Object.keys(_Lists[listID].inventory).includes(itemID))
				dispatch(Lists.deleteItemFromList([ itemID, listID ]));
		});
	}

	const handleSweepAll = _ => {
		// this does the same thing as CurrentListScreen
		listData.filter(item => item.inCart).forEach(item => {
			dispatch(Istore.updateItem(
				item.id,
				{
					history: [ Date.now(), ...item.history ],
				}
			));
			dispatch(Lists.deleteItemFromList(item.id));
		});
	}

	const handleToggleStaple = itemID => {
		console.log('handleToggleStaple called with item', itemID);

		const staples = [ ..._Lists[currentList].staples ];

		if(staples.includes(itemID)) // remove itemID from array
			dispatch(Lists.updateList([ currentList,
				{
					staples: staples.filter(i => i !== itemID)
				}
			]));
		else // add itemID to array
			dispatch(Lists.updateList([ currentList,
				{
					staples: [ ...staples, itemID ]
				}
			]));
	};

	const editItem = itemID => {
		setItemToEdit({ itemID });

		setShowEditItemModal(!showEditItemModal);
	}

	const handleDateChange = (item, date) => {
		console.log('handleDateChange called with\n\titem:', item, '\n\tdate:', date);

		dispatch(Lists.updateItemInList(
			[
				item.id,
				{
					..._Lists[currentList].inventory[item.id],
					purchaseBy: date.getTime()
				},
				currentList
			]
		));
	}

	const renderItem = (data, rowMap) => {
		// this needs to be redone since it isn't going to have the list
		// data with it
		const { item } = data;
		return (
			<ItemDisplay
				_Xstate={_Xstate}
				item={item}
				exports={{
					handleCheckBox,
					handleDateChange
				}}
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
							editItem(item.id);
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

	//useEffect(_ => setListData(generateListData()), [ _ItemStore ]);
	useEffect(_ => setXstate({ 'listData': generateListData() }), [ _ItemStore ]);

	return (
		<>
			<SwipeListView
				data={listData}
				renderItem={renderItem}
				renderHiddenItem={renderHiddenItem}
				keyExtractor={item => item.id}
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

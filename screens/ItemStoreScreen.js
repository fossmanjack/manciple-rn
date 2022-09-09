// PantryScreen.js
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
import Header from '../components/HeaderComponent';
import Footer from '../components/FooterComponent';
import InventoryItem from '../components/InventoryItem';

// slice imports
import * as Pantry from '../slices/listsSlice';
import * as Inv from '../slices/itemStoreSlice';

// utility imports
import { _Styles } from '../res/_Styles';
import * as Utils from '../utils/utils';

export default function ItemStoreScreen(props) {
	const { _Xstate, setXstate } = props;
	const {
		listData,
		itemToEdit,
		showItemEdit,
		funs: { drawerCtl, dispatch }
	} = _Xstate;


	const { _Lists, currentList } = useSelector(S => S.lists);
	const { _ItemStore } = useSelector(S => S.inventory);
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
		console.log('Inv: generateListData');

		return Utils.sortPantry(_ItemStore, sortOpts);
	}

	const handleCheckBox = itemID => {
		// Add or remove item from current pantry
		if(Object.keys(_Lists[currentList].inventory).includes(itemID)) {
			// if it's in the pantry, remove it
			dispatch(Pantry.deleteItemFromPantry([ itemID, currentList ]));
		} else {
			// if it's not in the pantry, add it
			const itemRef = _ItemStore[itemID];
			dispatch(Pantry.addItemToPantry([ itemID,
				{
					inCart: false,
					purchaseBy: itemRef.interval && _History[itemID] && _History[itemID].length
						? _History[itemID][0] + (itemRef.interval * 86400000)
						: 0,
					qty: itemRef.defaultQty || '1'
				},
				currentList
			]));
			if(!itemRef.parents.includes(currentList)
				dispatch(Inv.updateItem([ itemID,
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
		dispatch(Inv.deleteItem(itemID));

		_Lists.forEach(pnt => {
			if(Object.keys(pnt.inventory).includes(itemID))
				dispatch(Pantry.deleteItemFromPantry([ itemID, pnt.id ]));
		});
	}

	const handleSweepAll = _ => {
		// this does the same thing as PantryScreen
		listData.filter(item => item.inCart).forEach(item => {
			dispatch(Inv.updateItem(
				item.id,
				{
					history: [ Date.now(), ...item.history ],
				}
			));
			dispatch(Pantry.deleteItemFromPantry(item.id));
		});
	}

	const handleToggleStaple = itemID => {
		console.log('handleToggleStaple called with item', itemID);

		const staples = [ ..._Lists[currentList].staples ];

		if(staples.includes(itemID)) // remove itemID from array
			dispatch(Pantry.updatePantry([ currentList,
				{
					staples: staples.filter(i => i !== itemID)
				}
			]));
		else // add itemID to array
			dispatch(Pantry.updatePantry([ currentList,
				{
					staples: [ ...staples, itemID ]
				}
			}));
	};

	const editItem = itemID => {
		setItemToEdit({ itemID });

		setShowEditItemModal(!showEditItemModal);
	}

	const handleDateChange = (item, date) => {
		console.log('handleDateChange called with\n\titem:', item, '\n\tdate:', date);

		dispatch(Pantry.updateItemInPantry(
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
		// this needs to be redone since it isn't going to have the pantry
		// data with it
		const { item } = data;
		return (
			<InventoryItem
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
			<Footer handleSweepAll={handleSweepAll} />
		</>
	);
}

// PantryScreen.js
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
import EditItemModal from '../components/EditItemModal';
import Header from '../components/HeaderComponent';
import Footer from '../components/FooterComponent';
import PantryItem from '../components/PantryItem';

// slice imports
import * as Pantry from '../slices/listsSlice';
import * as Inv from '../slices/itemStoreSlice';

// utility imports
import { _Styles } from '../res/_Styles';
import * as Utils from '../utils/utils';

export default function CurrentListScreen({ _Xstate, setXstate }) {
	const { drawerCtl, nav, setNav } = props;
	const { _Lists, currentList } = useSelector(S => S.lists);
	const { _ItemStore } = useSelector(S => S.itemStore);
	const { sortOpts } = useSelector(S => S.options);
	const dispatch = useDispatch();
	const [ showEditItemModal, setShowEditItemModal ] = useState(false);
	const [ itemToEdit, setItemToEdit ] = useState(Object.keys(_ItemStore)[0]);
	const [ listData, setListData ] = useState([]);

	console.log('PantryScreen', props);

	const toggleEditItemVisible = _ => {
		console.log('toggleEditItemVisible called');
		setShowEditItemModal(!showEditItemModal);
	}

	const generateListData = _ => {
		console.log('refreshListData');

		// Data for each listed item is stored in two places: Inventory has the
		// largely-immutable stuff and Pantry has the daily changes.  The props
		// don't share names so we can just merge them to build our item data set.
		return Utils.sortPantry(
			Object.keys(_Lists[currentList].inventory).map(itemID => {
				return {
					id: itemID,
					..._ItemStore[itemID],
					..._Images[itemID],
					..._History[itemID],
					..._Lists[currentList].inventory[itemID]
				}
			}), sortOpts);
	}

	const dumpListData = _ => {
		console.log('Current list data:\n');
		console.log(listData);
	}

	const handleCheckBox = itemID => {
		// Toggle inCart, re-render should happen automatically
		console.log('handleCheckBox called with item', itemID);
		const newItem = { ..._Lists[currentList].inventory[itemID] };
		newItem.inCart = !newItem.inCart;

		dispatch(Pantry.updateItemInPantry([ itemID, newItem, currentList ]));

		//dispatch(Pantry.toggleInCart(itemID));
	}

	const handleSweep = (itemID, rowMap) => {
		// remove item from pantry, conditionally update item history,
		// close row, regenerating list data should happen automatically
		// Pantry.deleteItemFromPantry(itemID)
		// Inv.updateItem(itemID, { updated props })
		rowMap[itemID].closeRow();

		if(rowMap[itemID].props.item.inCart)
			dispatch(Inv.updateHistory([ itemID, Date.now() ]));

		dispatch(Pantry.deleteItemFromPantry([ itemID ]));
	}

	const handleSweepAll = _ => {

		listData.filter(item => item.inCart).forEach(item.id => {
			dispatch(Inv.updateHistory([ item.id, Date.now() ]));
			dispatch(Pantry.deleteItemFromPantry([ item.id ]));
		});
	}

	const handleToggleStaple = itemID => {
		console.log('handleToggleStaple called with item', itemID);

		const staples = [ ..._Lists[currentList].staples ];

		if(staples.includes(itemID)) // remove itemID from array
			dispatch(Pantry.updatePantry({
				..._Lists[currentList],
				staples: staples.filter(i => i !== itemID)
			}));
		else // add itemID to array
			dispatch(Pantry.updatePantry({
				..._Lists[currentList],
				staples: [ ...staples, itemID ]
			}));
	};

	const editItem = item => {
		setItemToEdit(item.id);
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
				}
			]
		));
	}

	const renderItem = (data, rowMap) => {
		const { item } = data;
		return (
			<PantryItem
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

	useEffect(_ => setListData(generateListData()), [ _Lists[currentList].inventory ]);

	useEffect(_ => console.log('itemToEdit changed!', itemToEdit), [ itemToEdit ]);

	return (
		<>
			<Header
				drawerCtl={drawerCtl}
				controls
				nav={nav}
				setNav={setNav}
				title={currentList === -1 ? 'No pantry loaded!' :
					`${_Lists[currentList].name}: Pantry view`
				}
			/>
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
				handleSweepAll={handleSweepAll}
				dumpListData={dumpListData}
			/>
			<EditItemModal
				dispatch={dispatch}
				visible={showEditItemModal}
				setVisible={setShowEditItemModal}
				item={itemToEdit}
				key={itemToEdit}
			/>
		</>
	);
}

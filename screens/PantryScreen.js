// PantryScreen.js
// Handles the bulk of the application logic, displays items stored in
// _Pantries[currentPantry].inventory in a third-party SwipeListView, handles
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
import * as Pantry from '../slices/pantriesSlice';

// utility imports
import { _Styles } from '../res/_Styles';
import * as Utils from '../utils/utils';

export default function PantryScreen(props) {
	const { drawerCtl, setNav } = props;
	const { _Pantries, currentPantry } = useSelector(S => S.pantries);
	const { sortOpts } = useSelector(S => S.options);
	const [ mode, setMode ] = useState('list');
	const dispatch = useDispatch();
	const [ showEditItemModal, setShowEditItemModal ] = useState(false);
	const [ itemToEdit, setItemToEdit ] = useState(Utils.blankItem);
	const [ listData, setListData ] = useState(
		_Pantries[currentPantry].inventory.filter(i => i.listed)
	);

	// we want the list to refresh every time the mode or contents change and
	// since state changes asynchronously we need to check against the state
	// value rather than calling the update method after dispatching a state change
	useEffect(_ => refreshListData(), [ mode, _Pantries[currentPantry].inventory ]);

	const handleModeChange = targetMode => {
		console.log('handleModeChange', mode, '->', targetMode);
		setMode(targetMode);
	}

	const toggleEditItemVisible = _ => {
		console.log('toggleEditItemVisible called');
		setShowEditItemModal(!showEditItemModal);
	}

	const refreshListData = _ => {
		console.log('refreshListData', mode);

		setListData(Utils.sortPantry(mode === 'list'
			? _Pantries[currentPantry].inventory.filter(i => i.listed)
			: _Pantries[currentPantry].inventory, sortOpts)
		);
	}

	const handleCheckBox = itemID => {
		console.log("handleCheckBox called with item", itemID);

		const updatedItem = { ..._Pantries[currentPantry].inventory.find(i => i.id === itemID) };
		mode === 'list'
			? updatedItem.needed = !updatedItem.needed
			: updatedItem.listed = !updatedItem.listed;

		dispatch(Pantry.updateItem({ itemID, updatedItem }));
	};

	const handleSweep = (itemID, rowMap) => {
		console.log('handleSweep:', itemID, rowMap[itemID]);

		const updatedItem = { ...rowMap[itemID].props.item };

		if(!updatedItem.needed) updatedItem.history = [ Date.now(), ...updatedItem.history ];
		updatedItem.listed = false;
		updatedItem.needed = true;

		// let's try removing the row from the listData state before dispatching the update
		rowMap[itemID].closeRow();
		/*
		console.log(listData);
		setListData([...listData].splice(listData.findIndex(item => item.id === itemID), 1));
		console.log(listData);
		*/

		// dispatch the updated item
		dispatch(Pantry.updateItem({
			itemID,
			updatedItem
		}));

		// refresh list data
	};

	const handleToggleStaple = item => {
		console.log('handleToggleStaple called with item', item);

		dispatch(Pantry.updateItem({
			itemID: item.id,
			updatedItem: {
				...item,
				staple: !item.staple
			}
		}));
	};

	const editItem = item => {
		console.log('setItemToEdit passed item:', item.id);
		console.log('setItemToEdit pre:', itemToEdit.id);
		setItemToEdit({ ...item });
		console.log('Items equal after set?', item === itemToEdit.current ? 'yes' : 'no', item.id, ':', itemToEdit.id);

		setShowEditItemModal(!showEditItemModal);
	}

	const handleDateChange = (item, date) => {
		console.log('handleDateChange called with\n\titem:', item, '\n\tdate:', date);
		dispatch(Pantry.updateItem({
			itemID: item.id,
			updatedItem: {
				...item,
				purchaseBy: date.getTime()
			}
		}));
	}

	const renderItem = (data, rowMap) => {
		const { item } = data;
		return (
			<PantryItem
				item={item}
				mode={mode}
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
					onPress={_ => handleToggleStaple(item)}
					icon={
						<Icon
							name={item.staple ? 'toggle-on' : 'toggle-off'}
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

	return (
		<>
			<Header
				drawerCtl={drawerCtl}
				controls
				mode={mode}
				setMode={handleModeChange}
				titleTxt={currentPantry === -1 ? 'No pantry loaded!' :
					`${_Pantries[currentPantry].name}: ${mode === 'list' ? 'List' : 'Pantry'} view`
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
			<Footer />
			<EditItemModal
				dispatch={dispatch}
				visible={showEditItemModal}
				setVisible={setShowEditItemModal}
				item={itemToEdit}
				key={itemToEdit.id}
			/>
		</>
	);
}

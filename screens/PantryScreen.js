// PantryScreen.js
// Handles the bulk of the application logic, displays items stored in
// _Pantries[currentPantry].inventory in a third-party SwipeListView, handles
// selection buttons, etc

// react, RN, community imports
import { useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon } from 'react-native-elements';

// third-party imports
import SwipeListView from 'react-native-swipe-list-view';

// custom component imports
import Header from '../components/HeaderComponent';
import Footer from '../components/FooterComponent';
import PantryItem from '../components/PantryItem';

// slice imports
import * as Pantry from '../slices/pantriesSlice';

// utility imports
import { _Styles } from '../res/_Styles';
import * as Utils from '../utils/utils';

export default function PantryScreen(props) => {
	const { exports: { drawerCtl }} = props;
	const { _Pantries, currentPantry } = useSelector(S => S.pantries);
	const [ mode, setMode ] = useState('list');
	const dispatch = useDispatch();
	const [ listData, setListData ] = useState(
		Utils.sortPantry(mode === 'list'
			? _Pantries[currentPantry].inventory.filter(i => i.listed)
			: _Pantries[currentPantry].inventory, sortOpts)
			.map(item => ({
				item,
				key: item.id,
				dispatch
			}))
	);

	const handleCheckBox = itemID => {
		console.log("handleCheckBox called with item", itemID);

		const updatedItem = { ..._Pantries[currentPantry].inventory.find(i => i.id === itemID) };
		mode === 'list'
			? updatedItem.needed = !updatedItem.needed
			: updatedItem.listed = !updatedItem.listed;

		dispatch(Pantry.updateItem({ itemID, updatedItem }));
	};

	const handleSweep = (itemID, rowMap) => {
		console.log('handleSweep:', itemID, rowMap[itemID].props.item.item);

		const updatedItem = { ...rowMap[itemID].props.item.item };

		if(!updatedItem.needed) updatedItem.history = [ Date.now(), ...updatedItem.history ];
		updatedItem.listed = false;
		updatedItem.needed = true;

		// let's try removing the row from the listData state before dispatching the update
		rowMap[itemID].closeRow();
		setListData([...listData].splice(listData.findIndex(item => item.id === itemID), 1));

		// dispatch the updated item
		dispatch(Pantry.updateItem({
			itemID,
			updatedItem
		}));
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

	const renderItem = (data, rowMap) => {
		const { item: { item }} = data;
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
		const { item: { item }} = data;
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
			<Header exports={{ mode, setMode, nav, drawerCtl }}/>
			<SwipeListView
				data={listData}
				keyExtractor={item => item.id}
				renderItem={renderItem}
				renderHiddenItem={renderHiddenItem}
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

import {
	Modal,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import { useState } from 'react';
import {
	Button,
	Icon,
	Input
} from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import { _Styles } from '../res/_Styles';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PantryItem from '../components/PantryItem';
import * as Pantry from '../slices/pantriesSlice';
import * as Global from '../slices/globalSlice';
import * as Utils from '../utils/utils';

export default function MainScreen() {
	const dispatch = useDispatch();
	const { _Pantries, currentPantry } = useSelector(S => S.pantries);
	const { debug } = useSelector(S => S.options);
	const { mode } = useSelector(S => S.global);
	const [ currentItem, setCurrentItem ] = useState({});
	const [ showModal, setShowModal ] = useState(false);
	const [ updatedName, setUpdatedName ] = useState('');
	const [ updatedQty, setUpdatedQty ] = useState('');
	const [ updatedPrice, setUpdatedPrice ] = useState('');
	const [ updatedLoc, setUpdatedLoc ] = useState('');
	const [ updatedURL, setUpdatedURL ] = useState('');
	const [ updatedUPC, setUpdatedUPC ] = useState('');
	const [ updatedInterval, setUpdatedInterval ] = useState('');
	const [ updatedNotes, setUpdatedNotes ] = useState('');
	//const [ updatedPurchaseBy, setUpdatedPurchaseBy ] = useState({});

	//dispatch(Global.setLastUse(Date.now()));

	const handleCheckBox = itemID => {
		console.log("handleCheckBox called with item", itemID);

		mode === 'list' && dispatch(Pantry.toggleNeeded(itemID)) || dispatch(Pantry.toggleListed(itemID));
	};

	const handleSweep = rowKey => {
		console.log('**************');
		console.log('handleSweep called with rowKey', rowKey);
		console.log('**************');

		dispatch(Pantry.toggleListed(rowKey));
	};

	const handleToggleStaple = itemID => {
		console.log('handleToggleStaple called with item', itemID);

		dispatch(Pantry.toggleStaple(itemID));
	};

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

	const editItem = item => {
		setCurrentItem(item);
		setUpdatedName(item.name);
		setUpdatedQty(item.qty);
		setUpdatedPrice(item.price);
		setUpdatedLoc(item.loc);
		setUpdatedURL(item.url);
		setUpdatedUPC(item.upc);
		setUpdatedInterval(item.interval.toString());
		setUpdatedNotes(item.notes);

		setShowModal(!showModal);
	}

	const handleEditItemCommit = _ => {
		setShowModal(!showModal);
		setCurrentItem({});

		const updatedItem = {
			...currentItem,
			name: updatedName,
			id: Utils.camelize(updatedName),
			qty: updatedQty,
			price: updatedPrice,
			loc: updatedLoc,
			url: updatedURL,
			upc: updatedUPC,
			interval: parseInt(updatedInterval),
			notes: updatedNotes
		};

		dispatch(Pantry.updateItem({
			itemID: currentItem.id,
			updatedItem
		}));
	}

	const resetState = _ => {
		setShowModal(false);
		setCurrentItem({});
		setUpdatedName('');
		setUpdatedQty('');
		setUpdatedPrice('');
		setUpdatedLoc('');
		setUpdatedURL('');
		setUpdatedUPC('');
		setUpdatedInterval('');
		setUpdatedNotes('');
		//setUpdatedPurchaseBy({});

		console.log('State reset');
	}

	return (
		<>
			<Header />
			<SwipeListView
				data={
					mode === 'list'
					? _Pantries[currentPantry].inventory.filter(i => i.listed).map(item => ({
						item,
						key: item.id,
						dispatch
					}))
					: _Pantries[currentPantry].inventory.map(item => ({
						item,
						key: item.id,
						dispatch
					}))
				}
				renderItem={(data, rowKey) => {
					console.log('************');
					console.log('renderItem: ');
					console.log('\tdata:', Utils.truncateString(''+data, 60));
					console.log('\trowKey:', Utils.truncateString(''+rowKey, 60));
					console.log('************');
					const { item: { item } } = data;
					return (
						<PantryItem
							item={item}
							exports={{
								handleCheckBox,
								handleDateChange
							}}
						/>
					)
				}}
				renderHiddenItem={(data, rowMap) => {
					const { item: { item }} = data;
					return (
					<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
						<Button
							onPress={_ => {
									editItem(item);
									rowMap[item.id].close();
								}
							}
							icon={
								<Icon
									name='pencil'
									type='font-awesome'
								/>
							}
						/>
						<Button
							onPress={_ => handleToggleStaple(item.id)}
							icon={
								<Icon
									name={item.staple ? 'toggle-on' : 'toggle-off'}
									type='font-awesome'
								/>
							}
						/>
					</View>
				)
				}}
				rightOpenValue={-100}
				leftActivationValue={75}
				leftActionValue={500}
				onLeftAction={handleSweep}
				bottomDivider
			/>
			<Modal
				transparent={false}
				visible={showModal}
				onRequestClose={_ => setShowModal(!showModal)}
			>
				<Text>
					Name
				</Text>
				<Input
					placeholder='Item name'
					value={updatedName}
					onChangeText={t => setUpdatedName(t)}
				/>
				<Text>
					Quantity
				</Text>
				<Input
					placeholder='Quantity'
					value={updatedQty}
					onChangeText={t => setUpdatedQty(t)}
				/>
				<Text>
					Price
				</Text>
				<Input
					placeholder='Price'
					value={updatedPrice}
					onChangeText={t => setUpdatedPrice(t)}
				/>
				<Text>
					Location
				</Text>
				<Input
					placeholder='Location'
					value={updatedLoc}
					onChangeText={t => setUpdatedLoc(t)}
				/>
				<Text>
					URL
				</Text>
				<Input
					placeholder='URL'
					value={updatedURL}
					onChangeText={t => setUpdatedURL(t)}
				/>
				<Text>
					UPC
				</Text>
				<Input
					placeholder='UPC'
					value={updatedUPC}
					onChangeText={t => setUpdatedUPC(t)}
				/>
				<Text>
					Interval
				</Text>
				<Input
					placeholder='Purchase interval'
					value={updatedInterval}
					keyboardType='number-pad'
					onChangeText={t => setUpdatedInterval(t)}
				/>
				<Text>
					Notes
				</Text>
				<Input
					placeholder='Notes'
					value={updatedNotes}
					onChangeText={t => setUpdatedNotes(t)}
				/>
				<Button
					title='Commit'
					onPress={_ => handleEditItemCommit()}
				/>
				<Button
					title='Cancel'
					onPress={_ => resetState()}
				/>
			</Modal>
			<Footer />
		</>
	);
}


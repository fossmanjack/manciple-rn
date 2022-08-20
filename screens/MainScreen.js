import {
	Alert,
	DrawerLayoutAndroid,
	FlatList,
	Modal,
	Pressable,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import {
	useEffect,
	useState,
	useRef } from 'react';
import {
	Button,
	Card,
	Icon,
	Input
} from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import Dialog from 'react-native-dialog';
import { _Styles } from '../res/_Styles';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SortOrderDialog from '../components/SortOrderDialog';
import PantryDetailDialog from '../components/PantryDetailDialog';
import PantryEditDialog from '../components/PantryEditDialog';
import EditItemModal from '../components/EditItemModal';
import EditItemComponent from '../components/EditItemComponent';
import PantryItem from '../components/PantryItem';
import createPantryItem from '../slices/pantryItemSlice';
import * as Pantry from '../slices/pantriesSlice';
import * as Global from '../slices/globalSlice';
import * as Utils from '../utils/utils';

export default function MainScreen() {
	const blankItem = (createPantryItem({ name: 'Blank item', id: 'blankItem' }));
	const blankPantry = ({ 'name': 'Blank list', id: 'blank-list', inventory: [] });
	const dispatch = useDispatch();
	const { _Pantries, currentPantry } = useSelector(S => S.pantries);
	const { debug, sortOpts } = useSelector(S => S.options);
	const { mode } = useSelector(S => S.global);
	const [ view, setView ] = useState('list');
	const [ currentItem, setCurrentItem ] = useState({});
	const [ pantryToEdit, setPantryToEdit ] = useState(blankPantry);
	const [ itemToEdit, setItemToEdit ] = useState(blankItem);



	// Modal and Dialog toggles
	const [ showEditItemModal, setShowEditItemModal ] = useState(false);
	const [ showNewPantryDialog, setShowNewPantryDialog ] = useState(false);
	const [ showPantryDetailDialog, setShowPantryDetailDialog ] = useState(false);
	const [ showPantryEditDialog, setShowPantryEditDialog ] = useState(false);

	// Input field variables
	const [ inputNewPantry, setInputNewPantry ] = useState('');

	const drawer = useRef(null);

	const LoginHandler = _ => {
		return (
			<Text>
				Login Handler
			</Text>
		);
	};

	const setDrawerOpen = _ => {
		drawer.current.openDrawer();
	};

	const setDrawerClosed = _ => {
		drawer.current.closeDrawer();
	};

	const toggleEditItemVisible = _ => {
		console.log('toggleEditItemVisible called');
		setShowEditItemModal(!showEditItemModal);
	}

	const handlePantryChange = ptID => {
		console.log('handleListChange', ptID);

		dispatch(Pantry.setPantry(_Pantries.indexOf(_Pantries.find(pt => pt.id === ptID))));
		setDrawerClosed();
	};

	const handleNPDCancel = _ => {
		setShowNewPantryDialog(!showNewPantryDialog);
		setInputNewPantry('');
	}

	const handleNPDCreate = _ => {
		console.log('handleNPDCreate', inputNewPantry);

		dispatch(Pantry.addPantry(inputNewPantry));
		_Pantries.map((pt, idx) => console.log(`_Pantries[${idx}] = ${pt.name}`));
		setShowNewPantryDialog(!showNewPantryDialog);
		setInputNewPantry('');
	}

	const handleEditPantry = updatedName => {
		const updatedPantry = {
			...pantryToEdit,
			name: updatedName
		};

		setShowPantryEditDialog(!showPantryEditDialog);
		dispatch(Pantry.updatePantry(updatedPantry));
	}

	const handleDeletePantry = _ => {
		console.log('handleDeletePantry:', pantryToEdit.id);
		setShowPantryEditDialog(!showPantryEditDialog);

		Alert.alert(
			'Delete pantry?',
			`Are you sure you wish to delete the pantry ${pantryToEdit.name}?  All of your item and purchase history will be lost!`,
			[
				{
					text: 'Cancel',
					onPress: _ => handlePantryDeleteCancel(),
					style: 'cancel'
				},
				{
					text: 'OK',
					onPress: _ => handlePantryDeleteConfirm(),
				}
			],
			{
				cancelable: true,
				onDismiss: _ => handlePantryDeleteCancel()
			}
		);
	}

	const handlePantryDeleteConfirm = _ => {
		const idx = _Pantries.indexOf(pantryToEdit);

		setShowPantryEditDialog(!showPantryEditDialog);
		console.log('handlePantryDeleteConfirm', idx, currentPantry);
		if(idx === currentPantry) {
			// We need to make sure currentPantry points to a valid pantry after
			// the delete operation.  As long as _Pantries.length is at least two more than
			// the index we're deleting we don't need to do anything, because:
			// idx = x
			// _Pantries.length = x+1
			// _Pantries.length after op = x (but _Pantries[x] is gone)
			// So that's one literal edge case
			// So if _Pantries.length > x + 1, no action
			// else setPantry(currentPantry - 1);
			// Which is fine unless currentPantry is 0
			// but even then actually, because no action will be taken unless _Pantries.length is 1
			// In which case _Pantries[0] is the only element
			// So:
			// if(_Pantries.length <= idx + 1) setPantry(currentPantry - 1);
			console.log('trying to delete current pantry!');
			if(_Pantries.length <= idx + 1) dispatch(Pantry.setPantry(currentPantry - 1));
		}

		setPantryToEdit(blankPantry);
		console.log('currentPantry:', currentPantry);
		dispatch(Pantry.deletePantry(idx));
		console.log(_Pantries);
	}

	const handlePantryDeleteCancel = _ => {
		setPantryToEdit({});
		setInputEditPantry('');
		setShowEditPantryDialog(!showEditPantryDialog);
	}

	const showPantryDetail = ptID => {
		setPantryToEdit(_Pantries.find(pt => pt.id === ptID));
		setShowPantryDetailDialog(!showPantryDetailDialog);
	}

	const renderDrawer = _ => {
		return (
			<>
				<LoginHandler />
				{ _Pantries.length > 0 &&
					<FlatList
						data={_Pantries}
						keyExtractor={item => item.id}
						renderItem={({ item: pantry }) => (
							<Pressable
								onPress={_ => handlePantryChange(pantry.id)}
								onLongPress={_ => showPantryDetail(pantry.id)}
								style={{
									borderBottomWidth: 1,
									borderBottomColor: 'lightgray',
									paddingVertical: 10,
								}}
							>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center'
									}}
								>
									<Icon
										name='list'
										type='entypo'
										size={22}
										style={{
											marginRight: 3,
											marginLeft: 10
										}}
									/>
									<Text
										style={{
											fontSize: 18
										}}
									>
										{pantry.name}
									</Text>
								</View>
							</Pressable>
						)}
					/>
				}
				<Pressable
					onPress={_ => {
						console.log('New pantry pressed');
						drawer.current.closeDrawer();
						setShowNewPantryDialog(!showNewPantryDialog);
					}}
					style={{
						borderBottomWidth: 1,
						borderBottomColor: 'lightgray',
						paddingVertical: 10,
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center'
						}}
					>
						<Icon
							name='add-to-list'
							type='entypo'
							size={22}
							style={{
								marginRight: 3,
								marginLeft: 10
							}}
						/>
						<Text
							style={{
								fontSize: 18
							}}
						>
							New Pantry...
						</Text>
					</View>
				</Pressable>
				<Pressable
					style={{
						borderBottomWidth: 1,
						borderBottomColor: 'lightgray',
						paddingVertical: 10,
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center'
						}}
					>
						<Icon
							name='settings'
							type='material'
							size={22}
							style={{
								marginRight: 3,
								marginLeft: 10
							}}
						/>
						<Text
							style={{
								fontSize: 18
							}}
						>
							Settings
						</Text>
					</View>
				</Pressable>
				<Pressable
					style={{
						borderBottomWidth: 1,
						borderBottomColor: 'lightgray',
						paddingVertical: 10,
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center'
						}}
					>
						<Icon
							name='help-circle-outline'
							type='material-community'
							size={22}
							style={{
								marginRight: 3,
								marginLeft: 10
							}}
						/>
						<Text
							style={{
								fontSize: 18
							}}
						>
							Help
						</Text>
					</View>
				</Pressable>
			</>
		);
	}

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
		console.log('setItemToEdit passed item:', item.id);
		console.log('setItemToEdit pre:', itemToEdit.id);
		setItemToEdit({ ...item });
		console.log('Items equal after set?', item === itemToEdit.current ? 'yes' : 'no', item.id, ':', itemToEdit.id);

		setShowEditItemModal(!showEditItemModal);
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

		console.log('State reset');
	}

	return (
		<DrawerLayoutAndroid
			ref={drawer}
			drawerWidth={300}
			drawerPosition='left'
			renderNavigationView={renderDrawer}
		>
			<Header
				drawerCtl={setDrawerOpen}
			/>
			{ currentPantry !== -1 &&
				<SwipeListView
					data={
						Utils.sortPantry(mode === 'list'
							? _Pantries[currentPantry].inventory.filter(i => i.listed)
							: _Pantries[currentPantry].inventory, sortOpts)
							.map(item => ({
								item,
								key: item.id,
								dispatch
							}))
					}
					renderItem={(data, rowMap) => {
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
			}
			<Dialog.Container visible={showNewPantryDialog}>
				<Dialog.Title>
					Create New Pantry
				</Dialog.Title>
				<Dialog.Input
					placeholder='New pantry name...'
					value={inputNewPantry}
					onChangeText={text => setInputNewPantry(text)}
				/>
				<Dialog.Button label='Cancel' onPress={handleNPDCancel} />
				<Dialog.Button label='Create' onPress={handleNPDCreate} disabled={!inputNewPantry} />
			</Dialog.Container>
			<EditItemModal
				dispatch={dispatch}
				visible={showEditItemModal}
				setVisible={setShowEditItemModal}
				item={itemToEdit}
				key={itemToEdit.id}
			/>
			<PantryDetailDialog
				visible={showPantryDetailDialog}
				setVisible={setShowPantryDetailDialog}
				pantry={pantryToEdit}
				handleEditPantry={_ => {
					setShowPantryDetailDialog(!showPantryDetailDialog);
					setShowPantryEditDialog(!showPantryEditDialog);
				}}
				key={pantryToEdit.id}
			/>
			<PantryEditDialog
				visible={showPantryEditDialog}
				setVisible={setShowPantryEditDialog}
				pantry={pantryToEdit}
				handleEditPantry={handleEditPantry}
				handleDeletePantry={handleDeletePantry}
				key={`${pantryToEdit.id}-ped`}
			/>
			<Footer />
		</DrawerLayoutAndroid>
	);
}

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
	useRef
} from 'react';
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
import NewPantryDialog from '../components/NewPantryDialog';
import EditItemModal from '../components/EditItemModal';
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

	const showPantryDetail = ptID => {
		setPantryToEdit(_Pantries.find(pt => pt.id === ptID));
		setShowPantryDetailDialog(true);
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

		const updatedItem = { ..._Pantries[currentPantry].inventory.find(i => i.id === itemID) };
		mode === 'list'
			? updatedItem.needed = !updatedItem.needed
			: updatedItem.listed = !updatedItem.listed;

		dispatch(Pantry.updateItem({ itemID, updatedItem }));
	};

	const handleSweep = (rowKey, listData) => {
		console.log('handleSweep:', rowKey, listData[rowKey].props.item.item);

		dispatch(Pantry.updateItem({
			itemID: rowKey,
			updatedItem: {
				...listData[rowKey].props.item.item,
				listed: false,
				needed: true
			}
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
			<EditItemModal
				dispatch={dispatch}
				visible={showEditItemModal}
				setVisible={setShowEditItemModal}
				item={itemToEdit}
				key={itemToEdit.id}
			/>
			<NewPantryDialog
				visible={showNewPantryDialog}
				setVisible={setShowNewPantryDialog}
			/>
			<PantryDetailDialog
				visible={showPantryDetailDialog}
				setVisible={setShowPantryDetailDialog}
				pantry={pantryToEdit}
				handleEditPantry={_ => {
					setShowPantryDetailDialog(false);
					setShowPantryEditDialog(true);
				}}
				key={`${pantryToEdit.id}-detail`}
			/>
			<PantryEditDialog
				visible={showPantryEditDialog}
				setVisible={setShowPantryEditDialog}
				pantry={pantryToEdit}
				setPantry={setPantryToEdit}
				key={`${pantryToEdit.id}-edit`}
			/>
			<Footer />
		</DrawerLayoutAndroid>
	);
}

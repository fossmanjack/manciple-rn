// MainComponent.js
// Handles modals, dialogs, navdrawer, header, loading from back-end

// Import React, RN, Redux native and community components
import {
	useEffect,
	useState,
	useRef
} from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import {
	Button,
	Card,
	Icon,
	Input
} from 'react-native-elements';

// import third-party components
import { SwipeListView } from 'react-native-swipe-list-view';
import Dialog from 'react-native-dialog';

// screen imports
import HelpScreen from '../screens/HelpScreen';
import OptionsScreen from '../screens/OptionsScreen';
import PantryScreen from '../screens/PantryScreen';

// Import local components
import NavDrawer from './NavDrawerComponent';
import PantryItem from './PantryItem';

// Import dialogs and modals
import EditItemModal from './EditItemModal';
import NewPantryDialog from './NewPantryDialog';
import PantryDetailDialog from './PantryDetailDialog';
import PantryEditDialog from './PantryEditDialog';
import SortOrderDialog from './SortOrderDialog';

// slice imports
import createPantryItem from '../slices/pantryItemSlice';
import * as Pantry from '../slices/pantriesSlice';
import * as Global from '../slices/globalSlice';

// utility imports
import { _Styles } from '../res/_Styles';
import * as Utils from '../utils/utils';

export default function Main() {
	const blankItem = (createPantryItem({ name: 'Blank item', id: 'blankItem' }));
	const blankPantry = ({ 'name': 'Blank list', id: 'blank-list', inventory: [] });
	const dispatch = useDispatch();
	const { _Pantries, currentPantry } = useSelector(S => S.pantries);
	const { debug, sortOpts } = useSelector(S => S.options);
	const [ pantryToEdit, setPantryToEdit ] = useState(blankPantry);
	const [ itemToEdit, setItemToEdit ] = useState(blankItem);
	const [ nav, setNav ] = useState('options');

	// Modal and Dialog toggles
	const [ showEditItemModal, setShowEditItemModal ] = useState(false);
	const [ showNewPantryDialog, setShowNewPantryDialog ] = useState(false);
	const [ showPantryDetailDialog, setShowPantryDetailDialog ] = useState(false);
	const [ showPantryEditDialog, setShowPantryEditDialog ] = useState(false);

	// Input field variables
	const [ inputNewPantry, setInputNewPantry ] = useState('');

	const drawer = useRef(null);

// drawer functions
	const setDrawerOpen = _ => {
		drawer.current.openDrawer();
	};

	const setDrawerClosed = _ => {
		drawer.current.closeDrawer();
	};

	const handlePantryChange = ptID => { console.log('handleListChange', ptID);

		dispatch(Pantry.setPantry(_Pantries.indexOf(_Pantries.find(pt => pt.id === ptID))));
		setDrawerClosed();
	};

// modal functions
	const toggleEditItemVisible = _ => {
		console.log('toggleEditItemVisible called');
		setShowEditItemModal(!showEditItemModal);
	}

	const showPantryDetail = ptID => {
		setPantryToEdit(_Pantries.find(pt => pt.id === ptID));
		setShowPantryDetailDialog(true);
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

	const editItem = item => {
		console.log('setItemToEdit passed item:', item.id);
		console.log('setItemToEdit pre:', itemToEdit.id);
		setItemToEdit({ ...item });
		console.log('Items equal after set?', item === itemToEdit.current ? 'yes' : 'no', item.id, ':', itemToEdit.id);

		setShowEditItemModal(!showEditItemModal);
	}


// render component

	return (
		<DrawerLayoutAndroid
			ref={drawer}
			drawerWidth={300}
			drawerPosition='left'
			renderNavigationView={_ =>
				<NavDrawerComponent
					exports={{
						handlePantryChange,
						setShowNewPantryDialog,
						setNav,
						showNewPantryDialog,
						showPantryDetail
					}}
				/>
			}
			key={nav}
		>
			{
				switch(nav) {
					case 'options':
						<OptionsScreen setNav={setNav} />;
						break;
					case 'pantry':
						<PantryScreen exports={{ drawerCtl: setDrawerOpen }}/>;
						break;
					case 'help':
						<HelpScreen />;
						break;
					default:
						<View></View>;
				}
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
		</DrawerLayoutAndroid>
	);
}

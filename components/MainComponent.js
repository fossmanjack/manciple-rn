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

// Import local components
import NavDrawer from './NavDrawerComponent';
import PantryItem from './PantryItem';
import Screen from './ScreenComponent';

// Import dialogs and modals
import NewPantryDialog from './NewPantryDialog';
import PantryDetailDialog from './PantryDetailDialog';
import PantryEditDialog from './PantryEditDialog';
import SortOrderDialog from './SortOrderDialog';

// slice imports
//import createPantryItem from '../slices/pantryItemSlice';
import * as Pantry from '../slices/pantriesSlice';
import * as Global from '../slices/globalSlice';

// utility imports
import { _Styles } from '../res/_Styles';
import * as Utils from '../utils/utils';

export default function Main() {
	const dispatch = useDispatch();
	const { _Pantries, currentPantry } = useSelector(S => S.pantries);
	const { debug, sortOpts } = useSelector(S => S.options);
	const [ pantryToEdit, setPantryToEdit ] = useState(Utils.blankPantry);
	const [ nav, setNav ] = useState('pantry');
	const [ drawerIsOpen, setDrawerIsOpen ] = useState(false);

	// Modal and Dialog toggles
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

	//const drawerCtl = _ => drawerIsOpen ? drawer.current.closeDrawer() : drawer.current.openDrawer();

	const drawerCtl = newState => {
		// if newState is undefined, toggle the drawer
		// Otherwise, if "true" open the drawer, if "false" close the drawer
		console.log('drawerCtl: drawerIsOpen?', drawerIsOpen, newState);

		if(typeof newState === 'undefined') drawerIsOpen ? drawer.current.closeDrawer() : drawer.current.openDrawer();
		else newState ? drawer.current.openDrawer() : drawer.current.closeDrawer();
	}

	const handlePantryChange = ptID => { console.log('handleListChange', ptID);

		dispatch(Pantry.setPantry(_Pantries.indexOf(_Pantries.find(pt => pt.id === ptID))));
		setNav('pantry');
		drawerCtl(false);
	};

// modal functions

	const showPantryDetail = ptID => {
		setPantryToEdit(_Pantries.find(pt => pt.id === ptID));
		setShowPantryDetailDialog(true);
	}




// render component

	return (
		<DrawerLayoutAndroid
			ref={drawer}
			drawerWidth={300}
			drawerPosition='left'
			renderNavigationView={_ =>
				<NavDrawer
					exports={{
						drawer: drawer.current,
						handlePantryChange,
						setShowNewPantryDialog,
						setNav,
						showNewPantryDialog,
						showPantryDetail
					}}
				/>
			}
			key={nav}
			onDrawerOpen={_ => setDrawerIsOpen(true)}
			onDrawerClose={_ => setDrawerIsOpen(false)}
			keyboardShouldPersistTaps='always'
		>
			<Screen exports={{ nav, setNav, drawerCtl }} />
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

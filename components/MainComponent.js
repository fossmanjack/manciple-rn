// MainComponent.js
// Handles modals, dialogs, navdrawer, header, loading from back-end

// Import React, RN, Redux native and community components
import {
	useState,
	useRef
} from 'react';
import {
	DrawerLayoutAndroid
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

// Import local components
import NavDrawer from '../components/NavDrawerComponent';
import Screen from '../components/ScreenComponent';
import ModalDialogComponent from '../components/ModalDialogComponent';

// slice imports
import * as Pantry from '../slices/pantriesSlice';
import * as Global from '../slices/globalSlice';

// utility imports
import { _Styles } from '../res/_Styles';
import * as Utils from '../utils/utils';

export default function Main() {
	const { _Pantries, currentPantry } = useSelector(S => S.pantries);
	const { debug, sortOpts } = useSelector(S => S.options);
	const [ drawerIsOpen, setDrawerIsOpen ] = useState(false);

	// Input field variables
	const [ inputNewPantry, setInputNewPantry ] = useState('');

	const drawer = useRef(null);

// Transient Application State (_Xstate)
	const _Xstate = {
		currentPage: 'pantry',
		drawerOpen: false,
		itemToEdit: Object.keys(_Inventory)[0],
		listData: [],
		pantryToEdit: Object.keys(_Pantries)[0],
		showPantryCreate: false,
		showPantryDelete: false,
		showPantryDetail: false,
		showPantryEdit: false,
		showItemEdit: false,
		showSortOrder: false,
		deleteItems: false,
		headerTitle: 'Manciple',
		headerControls: false,
		funs: {
			drawerCtl,
			dispatch: useDispatch(),
			handlePantryChange
		}
	};
/*
	const setXstate = (prop, val) => {
		return {
			..._Xstate,
			[prop]: val
		}
	};
*/
	const setXstate = props => {
		if(typeof props !== 'object') return _Xstate;
		return {
			..._Xstate,
			...props
		}
	}


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

	const handlePantryChange = pantryID => {
		console.log('handleListChange', pantryID);
		dispatch(Pantry.setPantry(pantryID));
		setXstate({
			'currentPage': 'pantry',
			'headerTitle': `${_Pantries[pantryID].name}: List view`,
			'headerControls': true
		});
		drawerCtl(false);

/*
		dispatch(Pantry.setPantry(_Pantries.indexOf(_Pantries.find(pt => pt.id === ptID))));
		setNav('pantry');
		drawerCtl(false);
*/
	};

//
	const showPantryDetail = pantryID => {
		setPantryToEdit(_Pantries[pantryID]);
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
					drawer={drawer.current}
					_Xstate={_Xstate}
					setXstate={setXstate}
				/>
			}
			key={_Xstate.currentPage}
			onDrawerOpen={_ => setDrawerIsOpen(true)}
			onDrawerClose={_ => setDrawerIsOpen(false)}
		>
			<Header
				_Xstate={_Xstate}
				setXstate={setXstate}
			/>
			<Screen
				_Xstate={_Xstate}
				setXstate={setXstate}
			/>
			<ModalDialogComponent
				_Xstate={_Xstate}
				setXstate={setXstate}
			/>
		</DrawerLayoutAndroid>
	);
}

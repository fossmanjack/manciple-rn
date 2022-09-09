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
import * as Lists from '../slices/listsSlice';
import * as Global from '../slices/globalSlice';

// utility imports
import { _Styles } from '../res/_Styles';
import * as Utils from '../utils/utils';

export default function Main() {
	const { _Lists, currentList } = useSelector(S => S.lists);
	const { _ItemStore } = useSelector(S => S.itemStore);
	const { debug, sortOpts } = useSelector(S => S.options);
	const [ drawerIsOpen, setDrawerIsOpen ] = useState(false);
	const drawer = useRef(null);

// Transient Application State (_Xstate)
	const _Xstate = {
		currentPage: 'currentList',
		drawerOpen: false,
		itemToEdit: Object.keys(_ItemStore)[0],
		listData: [],
		listToEdit: Object.keys(_Lists)[0],
		showListCreate: false,
		showListDelete: false,
		showListDetail: false,
		showListEdit: false,
		showItemEdit: false,
		showSortOrder: false,
		deleteItems: false,
		headerTitle: `${_Lists[currentList].name}: List view`,
		headerControls: false,
		funs: {
			drawerCtl,
			dispatch: useDispatch(),
			handlePantryChange,
			sanitize: Utils.sanitize,
			camelize: Utils.camelize,
			nullp: Utils.nullp,
			parseName: name => Utils.camelize(Utils.sanitize(name))
		}
	};

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

	const handleListChange = listID => {
		console.log('handleListChange', listID);
		dispatch(Lists.setList(listID));
		setXstate({
			'currentPage': 'currentList',
			'headerTitle': `${_Lists[listID].name}: List view`,
			'headerControls': true
		});
		drawerCtl(false);

	};

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

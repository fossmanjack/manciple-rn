// MainComponent.js
// Handles modals, dialogs, navdrawer, header, loading from back-end

// Import React, RN, Redux native and community components
import { useState, useEffect, useRef } from 'react';
import { DrawerLayoutAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

// Import local components
import NavDrawer from '../components/NavDrawerComponent';
import Screen from '../components/ScreenComponent';
import ModalDialogComponent from '../components/ModalDialogComponent';
import Header from '../components/HeaderComponent';

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
	//const [ _Xstate, updateXstate ] = useState({ });
	const drawer = useRef(null);

// Transient Application State (_Xstate) -- functions first
/* useState version
	const setXstate = payload => {
		console.log('setXstate', _Xstate, props);
		updateXstate({ ..._Xstate, ...payload });
	}
*/

	// I guess for the references (listData, etc) to work correctly we need to
	// mutate the state object instead of replacing it immutably.  This is disappointing
	// and I may revisit when I have more time.
	//const setXstate = payload => Object.keys(payload).forEach(key => _Xstate[key] = payload[key]);
	const setXstate = payload => {
		Utils.debugMsg('setXstate payload: '+JSON.stringify(payload));
		Object.keys(payload).forEach(key => {
			Utils.debugMsg('setXstate key: '+key+'\nvalue: '+JSON.stringify(payload[key]), Utils.VERBOSE);
			_Xstate[key] = payload[key];
		});
	}

	const navigate = destScreen => {
		if(destScreen) {
			setXstate({
				'screenHist': [ _Xstate.currentScreen, ..._Xstate.screenHist ],
				'currentScreen': destScreen
			});
		} else {
			newHist = [ ..._Xstate.screenHist ];
			destScreen = newHist.unshift();

			setXstate({
				'screenHist': newHist,
				'currentScreen': destScreen
			});
		}
	}


	const drawerCtl = newState => {
		// if newState is undefined, toggle the drawer
		// Otherwise, if "true" open the drawer, if "false" close the drawer
		Utils.debugMsg('drawerCtl: '+_Xstate.drawerOpen+', '+newState, Utils.VERBOSE);

		if(Utils.nullp(newState)) _Xstate.drawerOpen ? drawer.current.closeDrawer() : drawer.current.openDrawer();
		else newState ? drawer.current.openDrawer() : drawer.current.closeDrawer();
	}

	const handleListChange = listID => {
		Utils.debugMsg('handleListChange: '+listID, Utils.VERBOSE);
		dispatch(Lists.setList(listID));
		setXstate({
			'headerTitle': `${_Lists[listID].name}: List view`,
			'headerControls': true
		});
		navigate('currentList');
		drawerCtl(false);

	};


	// init Xstate

/*
	useEffect(_ => {
		setXstate({
*/
	var _Xstate = {
		currentScreen: 'currentList',
		screenHist: [],
		drawerOpen: false,
		itemToEdit: Object.keys(_ItemStore)[0] || '',
		listData: [],
		listToEdit: Object.keys(_Lists)[0] || '',
		showListCreate: false,
		showListDelete: false,
		showListDetail: false,
		showListEdit: false,
		showItemEdit: false,
		showSortOrder: false,
		deleteItems: false,
		headerTitle: `${_Lists[currentList] ? _Lists[currentList].name : ''}: List view`,
		headerControls: false,
		funs: {
			drawerCtl,
			handleListChange,
			setXstate,
			navigate,
			dispatch: useDispatch(),
			sanitize: Utils.sanitize,
			camelize: Utils.camelize,
			nullp: Utils.nullp,
			parseName: name => Utils.camelize(Utils.sanitize(name.trim())),
			timestamp: Utils.timestamp,
			checkCollision: Utils.checkCollision
		}
	}
/*
		});
	}, []);
*/


	const handleDateChange = (item, date) => {
		console.log('handleDateChange called with\n\titem:', item, '\n\tdate:', date);

	}

/*
	const setXstate = props => {
		if(typeof props !== 'object') return _Xstate;
		return {
			..._Xstate,
			...props
		}
	}
*/

// drawer functions
	const setDrawerOpen = _ => {
		drawer.current.openDrawer();
	};

	const setDrawerClosed = _ => {
		drawer.current.closeDrawer();
	};

	//const drawerCtl = _ => drawerIsOpen ? drawer.current.closeDrawer() : drawer.current.openDrawer();


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
				/>
			}
			key={_Xstate.currentScreen}
			onDrawerOpen={_ => setXstate({ drawerOpen: true })}
			onDrawerClose={_ => setXstate({ drawerOpen: false })}
		>
			<Header
				_Xstate={_Xstate}
			/>
			<Screen
				_Xstate={_Xstate}
			/>
			<ModalDialogComponent
				_Xstate={_Xstate}
			/>
		</DrawerLayoutAndroid>
	);
}

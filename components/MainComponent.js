// MainComponent.js
// Handles modals, dialogs, navdrawer, header, loading from back-end

// Import React, RN, Redux native and community components
import {
	createContext,
	useState,
	useEffect,
	useRef,
	useContext
} from 'react';
import { DrawerLayoutAndroid, useWindowDimensions } from 'react-native';
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
import { useXstate, XstateProvider } from '../res/Xstate';
import { _Styles } from '../res/_Styles';
import * as Utils from '../utils/utils';

export default function Main() {
	const { _Lists, currentList } = useSelector(S => S.lists);
	const { _ItemStore } = useSelector(S => S.itemStore);
	const { debug, sortOpts } = useSelector(S => S.options);
	const Xstate = useXstate();
	const { setXstate } = Xstate;

	//const [ _Xstate, updateXstate ] = useState({ });
	const drawer = useRef(null);
	//const { drawer, funs: { setXstate, drawerCtl, dispatch } } = _Xstate;

	Utils.debugMsg('MainComponent rendered!\n**************************************\n'+
		'\tXstate: '+JSON.stringify(Xstate));

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
/*
	const setXstate = payload => {
		Utils.debugMsg('setXstate payload: '+JSON.stringify(payload));

		//Object.keys(payload).forEach(key => {
		//	Utils.debugMsg('setXstate key: '+key+'\nvalue: '+JSON.stringify(payload[key]), Utils.VERBOSE);
		//	_Xstate[key] = payload[key];
		//});

		_Xstate = { ..._Xstate, ...payload };
		Utils.debugMsg('setXstate done: '+JSON.stringify(_Xstate));
	}
*/
/*
	useEffect(_ => {
		setXstate({
			navigate: destScreen => {
				if(destScreen) {
					setXstate({
						'screenHist': [ currentScreen, ...screenHist ],
						'currentScreen': destScreen
					});
				} else {
					newHist = [ ...screenHist ];

					setXstate({
						'currentScreen': newHist.unshift(),
						'screenHist': newHist
					});
				}
			},
			drawerCtl: newState => {
				if(nullp(newState)) drawerOpen ? drawer.current.closeDrawer() : drawer.current.openDrawer();
				else newState ? drawer.current.openDrawer() : drawer.current.closeDrawer();
			},
			handleListChange: listID => {
				dispatch(Lists.setList(listID));
				setXstate({
					'headerTitle': `${_Lists[listID].name}: List view`,
					'headerControls': true
				});
				navigate('currentList');
				drawerCtl(false);
			}
		});
	}, []);
*/
// some extra functions
// we'll try this so we don't have to export Xstate from main

	const navigate = destScreen => {
		if(destScreen) {
			setXstate({
				'screenHist': [ Xstate.currentScreen, Xstate.screenHist ],
				'currentScreen': destScreen
			});
		} else {
			newHist = [ ...Xstate.screenHist ];
			//destScreen = newHist.unshift();

			setXstate({
				'currentScreen': newHist.unshift(),
				'screenHist': newHist
			});
		}
	}

	const drawerCtl = newState => {
		// if newState is undefined, toggle the drawer
		// Otherwise, if "true" open the drawer, if "false" close the drawer
		Utils.debugMsg('drawerCtl: '+Xstate.drawerOpen+', '+newState, Utils.VERBOSE);

		if(Utils.nullp(newState)) Xstate.drawerOpen ? drawer.current.closeDrawer() : drawer.current.openDrawer();
		else newState ? drawer.current.openDrawer() : drawer.current.closeDrawer();
	}

	const handleListChange = listID => {
		Utils.debugMsg('handleListChange: '+listID, Utils.VERBOSE);
		Xstate.dispatch(Lists.setList(listID));
		setXstate({
			'headerTitle': `${_Lists[listID].name}: List view`,
			'headerControls': true
		});
		navigate('currentList');
		drawerCtl(false);

	};

	const dumpXstate = _ => {
		Utils.debugMsg('Dumping current Xstate...', Utils.VERBOSE);
		console.log(Xstate);
	};

	useEffect(_ => {
		setXstate({
			navigate,
			drawerCtl,
			dumpXstate,
			handleListChange
		});
	}, []);


/*

	// init Xstate
	//var _Xstate = {
	const Xstate = createContext({
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
		headerControls: true,
		drawerCtl,
		handleListChange,
		navigate,
		dispatch,
		sanitize: Utils.sanitize,
		camelize: Utils.camelize,
		nullp: Utils.nullp,
		parseName: Utils.parseName,
		checkCollision: Utils.checkCollision,
		setXstate: function(payload) {
			Utils.debugMsg('setXstate: '+JSON.stringify(this)+'\n'+JSON.stringify(payload));
			delete payload.setXstate; // don't allow setXstate to be overwritten
			this = { ...this, ...payload };
		},
		dumpXstate: function() {
			Utils.debugMsg('Dumping current Xstate...');
			console.log(this);
		}
	});
*/

/*
	const handleDateChange = (item, date) => {
		console.log('handleDateChange called with\n\titem:', item, '\n\tdate:', date);

	}
*/

/*
// drawer functions
// I'm not sure we need these?

	const setDrawerOpen = _ => {
		drawer.current.openDrawer();
	};

	const setDrawerClosed = _ => {
		drawer.current.closeDrawer();
	};
*/

	//const drawerCtl = _ => drawerIsOpen ? drawer.current.closeDrawer() : drawer.current.openDrawer();
// Xstate vars

//	const { setXstate, currentScreen } = useContext(Xstate);


// render component

	return (
		<DrawerLayoutAndroid
			ref={drawer}
			drawerWidth={useWindowDimensions().width * (2/3)}
			drawerPosition='left'
			renderNavigationView={_ =>
				<NavDrawer
					drawer={drawer.current}
				/>
			}
			key={Xstate.currentScreen}
			onDrawerOpen={_ => setXstate({ drawerOpen: true })}
			onDrawerClose={_ => setXstate({ drawerOpen: false })}
		>
			<Header />
			<Screen />
			<ModalDialogComponent />
		</DrawerLayoutAndroid>
	);
}

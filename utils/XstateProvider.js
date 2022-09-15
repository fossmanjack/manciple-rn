import * as Utils from '../utils/utils';
import Main from '../components/MainComponent';
import { useSelector, useDispatch } from 'react-redux';
import { useRef } from 'react';


export default function XstateProvider() {
	const { _ItemStore } = useSelector(S => S.itemStore);
	const { _Lists, currentList } = useSelector(S => S.lists);

	// Xstate functions
	const setXstate = payload => {
		Utils.debugMsg('setXstate payload: '+JSON.stringify(payload));

		_Xstate = { ..._Xstate, ...payload };
		//Utils.debugMsg('setXstate done: '+JSON.stringify(_Xstate));
	}

	const dumpXstate = _ => {
		Utils.debugMsg('Dumping current Xstate ---->');
		const dump = { ..._Xstate };
		delete dump.drawer;
		console.log(dump);
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

	const dispatch = useDispatch();

	const drawer = useRef(null);
	// init Xstate

	var _Xstate = {
		drawer,
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
		funs: {
			drawerCtl,
			handleListChange,
			setXstate,
			navigate,
			dispatch,
			dumpXstate,
			sanitize: Utils.sanitize,
			camelize: Utils.camelize,
			nullp: Utils.nullp,
			parseName: Utils.parseName,
			timestamp: Utils.timestamp,
			checkCollision: Utils.checkCollision
		}
	}

	return (
		<Main
			_Xstate={_Xstate}
			key={_Xstate}
		/>
	);
}

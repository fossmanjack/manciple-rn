import { useState, createContext } from 'react';
import { useDispatch } from 'react-redux';
import * as Utils from '../utils/utils';

export const XstateProvider(props) {
	const XstateContext = createContext({});
	const setXstate = payload => {
		Utils.debugMsg('setXstate payload: '+JSON.stringify(payload), Utils.VERBOSE);
		delete payload.setXstate; // don't ever overwrite this

		setTransientState(prevState => ({
			...prevState,
			...payload,
			lastUpdate: Date.now()
		}));
	}
	const [ transientState, setTransientState ] = useState({
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
		dispatch: useDispatch(),
		sanitize: Utils.sanitize,
		camelize: Utils.camelize,
		nullp: Utils.nullp,
		parseName: Utils.parseName,
		checkCollision: Utils.checkCollision,
		setXstate,
		dumpXstate: function() {
			Utils.debugMsg('Dumping current Xstate...');
			console.log(this);
		}
	});

	return (
		<XstateContext.Provider value={transientState}>
			{props.children}
		</XstateContext.Provider>
	);
}

export const Xstate = useContext(XstateContext);


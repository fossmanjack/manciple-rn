import { useState, useContext, createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as Utils from '../utils/utils';

const XstateContext = createContext({});

export function XstateProvider(props) {
	const { _Lists, currentList } = useSelector(S => S.lists);
	const { _ItemStore } = useSelector(S => S.itemStore);

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
		parseDate: Utils.parseDate,
		checkCollision: Utils.checkCollision,
		timestamp: Utils.timestamp,
		debugMsg: Utils.debugMsg,
		setXstate
	});
	Utils.debugMsg('XstateContext:\n\ttransientState: '+JSON.stringify(transientState)+
		'\n\tXstate Context: '+JSON.stringify(useContext(XstateContext)));

	return (
		<XstateContext.Provider value={transientState}>
			{props.children}
		</XstateContext.Provider>
	);
}

export const useXstate = _ => useContext(XstateContext);


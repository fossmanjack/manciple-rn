import { useState, useContext, createContext } from 'react';
import { useWindowDimensions } from 'react-native';
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
		windowX: useWindowDimensions().width,
		windowY: useWindowDimensions().height,
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
		showTagEdit: false,
		deleteItems: false,
		dispatch: useDispatch(),
		sanitize: Utils.sanitize,
		camelize: Utils.camelize,
		nullp: Utils.nullp,
		parseName: Utils.parseName,
		parseDate: Utils.parseDate,
		collisionCheck: Utils.collisionCheck,
		timestamp: Utils.timestamp,
		debugMsg: Utils.debugMsg,
		genuuid: Utils.genuuid,
		setXstate,
		token: '',
		password: ''
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


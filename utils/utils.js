import { useSelector } from 'react-redux';
import uuid from 'react-native-uuid';
import { _Store } from '../res/_Store';

export const camelize = str => str ? str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, c) => c.toUpperCase()) : false;
export const sanitize = str => str ? str.replace(/[~!@#$%^&*().,<>?_=+:;\'\"\/\-\[\]\{\}\\\|\`]/g, '') : false;
export const parseDate = i => new Date(i).toISOString().split("T")[0];
export const daysBetween = (i, j) => (j - i) / (86400000);
export const truncateString = (str, num) => str.length >= num ? str.slice(num)+' ...' : str;
export const nullp = val => (typeof val === 'undefined' || val === null);
export const _State = _Store.getState();
export const _Dispatch = _Store.dispatch;

export const getDebugLvl = _ => _State.options.debug;

// Writing debug message guidance: the higher the options debug level, the more
// noisy and granular the log will be.  Each debug message instance should consider
// whether the data should always be logged (low dlvl) or rarely be logged (high
// dlvl).  ERROR = 1, WARN = 3, INFO = 5, DEBUG = 7, VV_DEBUG = 9

export const debugMsg = (fun, params=[], dlvl=9) => {
	if(dlvl >= getDebugLvl()) {
		console.log("****** DEBUG ******");
		console.log(`Calling function ${fun} with:`);
		params.map(p => console.log("\t", truncateString(JSON.stringify(p), 60)));
		console.log("*******************");
	}
}

export const calculateInterval = item => {
	if(item.history.length < 2) return 0;

	let acc, i = 0;
	// history(length 3) = [
	//   [0]: ... 1-0
	//   [1]: ... 2-1
	//   [2]: ... 3*-2
	// So the last iteration has to be when i = length-2
	for(i; i <= item.history.length - 2; i++) {
		acc += daysBetween(item.history[i], item.history[i+1]);
	}

	return acc / (item.history.length - 1);
}

export const sortPantry = (inv, [ field, asc ]) => {
	// Valid fields: name, price, loc, purchaseBy, none
	// asc is a bool for "ascending"
	if(!field || field === 'none') return inv;
	console.log('sortPantry called');

	return [...inv].sort((a, b) => {
		let x = a[field].toString().toLowerCase();
		let y = b[field].toString().toLowerCase();

		return asc ? x > y ? 1 : x < y ? -1 : 0 : x > y ? -1 : x < y ? 1 : 0;
	});
}

export const createPantryItem = props => {
	const {
		name = 'New item',
		id = camelize(name || 'New item'),
		tags = [],
		history = [],
		images = [],
		price = '',
		loc = '',
		url = '',
		upc = '',
		interval = 0,
		notes = '',
		defaultQty = '',
		creationDate = Date.now(),
		modifyDate = Date.now()
	} = props;

	return ({
		name,
		id,
		type: 'item',
		version: 1,
		tags,
		history,
		images,
		price,
		loc,
		url,
		upc,
		interval,
		notes,
		defaultQty,
		creationDate,
		modifyDate
	});
}

export const blankItem = (createPantryItem({ name: 'Blank item' }));

export const createPantry = props => {
	const {
		name = 'New pantry',
		id = uuid.v4(),
		creationDate = Date.now(),
		modifyDate = Date.now(),
		inventory = { },
		staples = [ ],
		sync = false,
		type = 'pantry',
		version = '1'
	} = props;

	return ({
		name,
		id,
		creationDate,
		modifyDate,
		inventory,
		staples,
		sync,
		type,
		version
	});
}

export const blankPantry = (createPantry({
	name: 'Blank pantry',
	id: 'blank-pantry'
}));

/* debugging

debug level (dlvl) is the debug value at which the message will trigger
0 is meant to be no messages, 9 is meant to be the most verbose

So:

|dlvl v | debug> | 1 | 3 | 5 | 7 | 9 |
| 1              | x | x | x | x | x |
| 3              | - | x | x | x | x |
| 5              | - | - | x | x | x |
| 7              | - | - | - | x | x |
| 9              | - | - | - | - | x |

So:
	ERROR (always show) -> dlvl 1
	WARN (usually show) -> dlvl 3
	DEBUG (show when debug is enabled) -> dlvl 5
	DBG2 (verbose debug) -> dlvl 7
	DBG3 (vverbose debug) -> dlvl 9


*/

import { useSelector } from 'react-redux';
import RNuuid from 'react-native-uuid';
//import { _Store } from '../res/_Store';

// global constants

export const DAY = 86400000;
export const ERROR = 9; // highest priority
export const WARN = 7;
export const INFO = 5;
export const DEBUG = 3;
export const VERBOSE = 1;

// debugging
// debug is the global threshold, only debug messages with a higher priority than
// this value will be logged.

export const debug = VERBOSE; // hardcoded until I figure out how to expose it to users
export const debugMsg = (msg, dlvl = VERBOSE) => dlvl >= debug && console.log(timestamp(), msg);

// datetime management utilities
export const parseDate = i => new Date(i).toISOString().split("T")[0];
export const daysBetween = (i, j) => (j - i) / (DAY);
export const timestamp = _ => {
	const [ d, tData ] = new Date().toISOString().split('T');
	const [ h, m, sData ] = tData.split(':');
	const s = sData.slice(0, 6);

	return `[${d} ${h}${m}.${s}]`;
}

// String manipulation and comparing functions
export const truncateString = (str, num) => str.length >= num ? str.slice(0, num)+' ...' : str;
export const sanitize = str => str ? str.replace(/[~!@#$%^&*().,<>?_=+:;\'\"\/\-\[\]\{\}\\\|\`]/g, '') : false;
export const camelize = str => str ? str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, c) => c.toUpperCase()) : false;
//export const parseName = val => val && camelize(sanitize(val.trim())) || '';
export const parseName = val => {
	debugMsg('parseName: '+JSON.stringify(val), VERBOSE);
	return val ? camelize(sanitize(val.trim())) : '';
}
//export const collisionCheck = (a, b) => parseName(a) === parseName(b);
export const collisionCheck = (a, b) => {
	debugMsg('collisionCheck:'+
		'\n\ta: '+parseName(a)+
		'\n\tb: '+parseName(b), VERBOSE);
	return parseName(a) === parseName(b);
}

// Check for null or undefined objects or props
export const nullp = val => (typeof val === 'undefined' || val === null);

// Writing debug message guidance: the higher the options debug level, the more
// noisy and granular the log will be.  Each debug message instance should consider
// whether the data should always be logged (low dlvl) or rarely be logged (high
// dlvl).  ERROR = 1, WARN = 3, INFO = 5, DEBUG = 7, VV_DEBUG = 9
/*
export const debugMsg = (fun, params=[], dlvl=9) => {
	if(dlvl >= getDebugLvl()) {
		console.log("****** DEBUG ******");
		console.log(`Calling function ${fun} with:`);
		params.map(p => console.log("\t", truncateString(JSON.stringify(p), 60)));
		console.log("*******************");
	}
}
*/
// de

	// dlvl is message severity, higher value requires higher debug value set
	// default to 9


export const genuuid = len => {
	if(len) return Math.random().toString(16).slice(2, len > 13 ? 15 : 2 + len);
	else return RNuuid.v4();
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

export const sortList = (inv, [ field, asc ]) => {
	// Valid fields: name, price, loc, purchaseBy, none
	// asc is a bool for "ascending"
	if(!field || field === 'none') return inv;
	//console.log('sortList called', inv, field);

	// For now let's filter out any item that doesn't have the field
	// defined.  Which shouldn't ever happen but still.
	return [...inv.filter(ob => ob.hasOwnProperty(field))].sort((a, b) => {
		//console.log('sortList sort', a, b);
		let x = a[field].toString().toLowerCase();
		let y = b[field].toString().toLowerCase();

		return asc ? x > y ? 1 : x < y ? -1 : 0 : x > y ? -1 : x < y ? 1 : 0;
	});
}

export const createListItem = props => {
	const {
		name = 'New item',
		tags = [],
		parents = [],
		price = '',
		loc = '',
		url = '',
		upc = '',
		interval = 0,
		notes = '',
		defaultQty = '',
		creationDate = Date.now(),
		modifyDate = Date.now(),
		uuid = null
	} = props;

	return ({
		name,
		type: 'item',
		version: 1,
		tags,
		parents,
		price,
		loc,
		url,
		upc,
		interval,
		notes,
		defaultQty,
		creationDate,
		modifyDate,
		createdBy: uuid,
		access: [ uuid ],
		modifiedBy: uuid
	});
}

export const blankItem = (createListItem({ name: 'Blank item' }));

export const createShoppingList = props => {
	// takes an object, extracts pertinent props, scaffolds out the rest,
	// returns them.
	const {
		name = 'New list',
		creationDate = Date.now(),
		modifyDate = Date.now(),
		inventory = { },
		staples = [ ],
		sync = false,
		type = 'shoppingList',
		version = '1',
		uuid = null
	} = props;

	return ({
		name,
		creationDate,
		modifyDate,
		inventory,
		staples,
		sync,
		type,
		version,
		createdBy: uuid,
		modifiedBy: uuid,
		access: [ uuid ]
	});
}

export const blankShoppingList = createShoppingList({
	name: 'Blank list'
});

export const getAllTags = store => {
	const tagsAcc = [];

	store.forEach(item => tagsAcc.concat(item.tags));

	return [ ...new Set(tagsAcc) ].sort((a, b) =>
		a > b ? 1 : a < b ? -1 : 0);
}

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

import uuid from 'react-native-uuid';

export const LISTS = {
	[uuid.v4()]: {
		name: 'Groceries',
		tags: [ 'grocery', 'household', 'cleaning' ],
		type: 'shoppingList',
		version: 1,
		creationDate: Date.now(),
		modifyDate: Date.now(),
		inventory: {
			'd3bebaa4-d834-49cd-852e-a64f6638a2b4': { qty: '1 gal', purchaseBy: 1660532115847, inCart: false },
			'3b706aa4-5f33-4aff-95ee-158c0523adea': { qty: '1', purchaseBy: 0, inCart: false },
			'910f2d0e-be22-4957-9e16-a716649837bd': { qty: '1', purchaseBy: 0, inCart: true },
			'09ec4d24-5f47-48c0-9d44-5c6f297fd640': { qty: '2', purchaseBy: 0, inCart: false }
		},
		staples: [
			'd3bebaa4-d834-49cd-852e-a64f6638a2b4',
			'3b706aa4-5f33-4aff-95ee-158c0523adea',
			'f5218e83-fea6-4ba4-9254-2889e579cba7',
		],
		sync: false
	},
	[uuid.v4()]: {
		name: 'Hardware store',
		tags: [ 'hardware', 'tool' ],
		type: 'shoppingList',
		version: 1,
		creationDate: Date.now(),
		modifyDate: Date.now(),
		inventory: {
			'05e4e5a9-1d69-49dc-9166-e3b13e7b9dcb': { qty: '1', purchaseBy: 0, inCart: false },
			'b5cebc8a-1fd4-4a95-9eba-0a7dbdc97298': { qty: '1', purchaseBy: 0, inCart: false },
			'ec2851ac-af2c-4971-9c75-c2bb2b236eb0': { qty: '1', purchaseBy: 0, inCart: false },
			'd345f31d-72e3-4e00-a233-cb1796060232': { qty: '1', purchaseBy: 0, inCart: false }
		},
		staples: [

		],
		sync: false
	}
}

export const ITEMSTORE = {
	'd3bebaa4-d834-49cd-852e-a64f6638a2b4': {
		name: 'Milk',
		tags: [ 'drink', 'grocery', 'dairy' ],
		type: 'item',
		version: 1,
		price: '',
		loc: '',
		url: '',
		upc: '',
		interval: '',
		notes: '',
		parents: [ ],
		defaultQty: '',
		creationDate: Date.now(),
		modifyDate: Date.now()
	},
	'3b706aa4-5f33-4aff-95ee-158c0523adea': {
		name: 'Bread',
		tags: [ 'food', 'grocery', 'starch' ],
		type: 'item',
		version: 1,
		price: '',
		loc: '',
		url: '',
		upc: '',
		interval: '',
		notes: 'Something multi-grain',
		parents: [ ],
		defaultQty: '',
		creationDate: Date.now(),
		modifyDate: Date.now()
	},
	'f5218e83-fea6-4ba4-9254-2889e579cba7': {
		name: 'Soda',
		tags: [ 'drink', 'softDrink', 'grocery' ],
		type: 'item',
		version: 1,
		price: '',
		loc: '',
		url: '',
		upc: '',
		interval: '',
		notes: '',
		parents: [ ],
		defaultQty: '',
		creationDate: Date.now(),
		modifyDate: Date.now()
	},
	'910f2d0e-be22-4957-9e16-a716649837bd': {
		name: 'Coffee',
		tags: [ 'drink', 'breakfast', 'grocery' ],
		type: 'item',
		version: 1,
		price: '',
		loc: '',
		url: '',
		upc: '',
		interval: '',
		notes: 'Fresh-ground arabica, medium roast',
		parents: [ ],
		defaultQty: '',
		creationDate: Date.now(),
		modifyDate: Date.now()
	},
	'dc17c8aa-8cc4-4806-9cc3-032b718a9b9b': {
		name: 'Lettuce',
		tags: [ 'food', 'grocery', 'produce' ],
		type: 'item',
		version: 1,
		price: '',
		loc: '',
		url: '',
		upc: '',
		interval: '',
		notes: '',
		parents: [ ],
		defaultQty: '',
		creationDate: Date.now(),
		modifyDate: Date.now()
	},
	'05e4e5a9-1d69-49dc-9166-e3b13e7b9dcb': {
		name: 'Trash bags',
		tags: [ 'household', 'maintenance' ],
		type: 'item',
		version: 1,
		price: '',
		loc: '',
		url: '',
		upc: '',
		interval: '',
		notes: '',
		parents: [ ],
		defaultQty: '',
		creationDate: Date.now(),
		modifyDate: Date.now()
	},
	'b5cebc8a-1fd4-4a95-9eba-0a7dbdc97298': {
		name: 'AAA batteries',
		tags: [ 'hardware', 'battery', 'household' ],
		type: 'item',
		version: 1,
		price: '',
		loc: '',
		url: '',
		upc: '',
		interval: '',
		notes: '',
		parents: [ ],
		defaultQty: '',
		creationDate: Date.now(),
		modifyDate: Date.now()
	},
	'd345f31d-72e3-4e00-a233-cb1796060232': {
		name: 'Borax',
		tags: [ 'household', 'laundry', 'cleaning' ],
		type: 'item',
		version: 1,
		price: '',
		loc: '',
		url: '',
		upc: '',
		interval: '',
		notes: '',
		parents: [ ],
		defaultQty: '',
		creationDate: Date.now(),
		modifyDate: Date.now()
	},
	'ec2851ac-af2c-4971-9c75-c2bb2b236eb0': {
		name: 'Mop',
		tags: [ 'tool', 'household', 'cleaning' ],
		type: 'item',
		version: 1,
		price: '',
		loc: '',
		url: '',
		upc: '',
		interval: '',
		notes: '',
		parents: [ ],
		defaultQty: '',
		creationDate: Date.now(),
		modifyDate: Date.now()
	},
	'09ec4d24-5f47-48c0-9d44-5c6f297fd640': {
		name: 'Parchment paper',
		tags: [ 'kitchen', 'baking' ],
		type: 'item',
		version: 1,
		price: '',
		loc: '',
		url: '',
		upc: '',
		interval: '',
		notes: '',
		parents: [ ],
		defaultQty: '',
		creationDate: Date.now(),
		modifyDate: Date.now()
	}
}

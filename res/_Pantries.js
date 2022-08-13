import uuid from 'react-native-uuid';

export const PANTRIES = [
	{
		id: uuid.v4(),
		name: 'Grocery list',
		creationDate: Date.now(),
		modifyDate: Date.now(),
		inventory: [
			{
				id: 'dietPepsi',
				name: 'Diet Pepsi',
				qty: '24 pack',
				needed: true,
				listed: true,
				staple: true
			},
			{
				id: 'sourdoughPretzels',
				name: 'Sourdough pretzels',
				qty: '1',
				needed: true,
				listed: true,
			},
			{
				id: 'wholeWheatBread',
				name: 'Whole-wheat bread',
				qty: '1',
				needed: true,
				listed: true,
			},
			{
				id: 'tofu',
				name: 'Tofu',
				qty: '1',
				needed: false,
				listed: true,
			}
		] // inventory
	}, // list
	{
		id: uuid.v4(),
		name: 'Hardware store',
		creationDate: Date.now(),
		modifyDate: Date.now(),
		inventory: [
			{
				id: 'plywood',
				name: 'Plywood',
				qty: '1',
				needed: true,
				listed: true,
			},
			{
				id: 'pruningShears',
				name: 'Pruning shears',
				qty: '1',
				needed: true,
				listed: true,
			},
			{
				id: 'aaaBatteries',
				name: 'AAA batteries',
				qty: '8 pk',
				needed: true,
				listed: true,
			},
			{
				id: 'groutCleaner',
				name: 'Grout cleaner',
				qty: '1',
				needed: false,
				listed: false,
			}
		]
	}
]

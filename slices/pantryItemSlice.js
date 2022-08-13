import * as Utils from '../utils/utils';

export default function createPantryItem(props) {
	const {
		name = 'New item',
		id = Utils.camelize(name),
		qty = '1',
		needed = true,
		listed = true,
		staple = false,
		history = [],
		images = [],
		price = '',
		loc = '',
		url = '',
		upc = '',
		interval = 0,
		purchaseBy = 0,
		notes = '',
		creationDate = Date.now(),
		modifyDate = Date.now()
	} = props;

	return ({
		name,
		id,
		qty,
		needed,
		listed,
		staple,
		history,
		images,
		price,
		loc,
		url,
		upc,
		interval,
		purchaseBy,
		notes,
		creationDate,
		modifyDate
	});
}

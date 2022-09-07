import { useState } from 'react';
import {
	Pressable,
	SafeAreaView,
	Text,
	TextInput,
	View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'react-native-elements';
import * as Pantry from '../slices/pantriesSlice';
import * as Inv from '../slices/inventorySlice';
import * as Utils from '../utils/utils';
import { _Styles } from '../res/_Styles';
import { _Store } from '../res/_Store';

export default function Footer(props) {
	const [ inputText, setInputText ] = useState('');
	const { _Pantries, currentPantry } = useSelector(S => S.pantries);
	const { _Inventory } = useSelector(S => S.inventory);
	const { handleSweepAll, dumpListData } = props;
	const dispatch = useDispatch();

	const handleSubmit = _ => {
		console.log('handleSubmit', currentPantry, inputText);

		if(inputText) { // if there's text, parse it and add an item to the pantry
			let [ name = 'New item', qty, ...preTags ] = inputText.split(',');
			const id = Utils.sanitize(Utils.camelize(name));
			let invItem = _Inventory.find(item => item.id === id);
			tags = preTags.map(t => Utils.sanitize(Utils.camelize(t)));

			if(Utils.nullp(invItem)) {
				// if item doesn't exist, push it to _Inventory
				const newItem = Utils.createPantryItem({
					name,
					id,
					tags,
					parents: [ _Pantries[currentPantry].id ],
					defaultQty: qty || '1'
				});
				dispatch(Inv.addItem(newItem));
			}

			if(invItem && !invItem.parents.includes(_Pantries[currentPantry].id))
				dispatch(Inv.updateItem(invItem.id,
					{
						parents: [
							...invItem.parents,
							_Pantries[currentPantry].id
						]
					}
				));

			dispatch(Pantry.addItemToPantry([ id,
				{
					inCart: false,
					qty: qty || invItem.defaultQty || '1',
					purchaseBy: invItem.interval && invItem.history[0]
						? invItem.history[0] + (invItem.interval * 86400000)
						: 0,
				}
			]));
		} else { // if no text, add all staples
			console.log('handleSubmit all:', _Pantries[currentPantry].staples);
			_Pantries[currentPantry].staples.forEach(id => {
				console.log('processing staple', id);
				if(Object.keys(_Pantries[currentPantry].inventory).includes(id)) return;
				const invItem = _Inventory.find(i => i.id === id);

				if(Utils.nullp(invItem)) { // if the ID isn't in inventory, toss it
					console.log('found bad id', id);
					dispatch(Pantry.updatePantry({
						..._Pantries[currentPantry],
						staples: _Pantries[currentPantry].staples.filter(i => i.id === id)
					}));
				} else { // otherwise add it to the list
					console.log('adding item', id);
					dispatch(Pantry.addItemToPantry([ id,
						{
							inCart: false,
							qty: invItem.defaultQty || '1',
							purchaseBy: invItem.interval && invItem.history[0]
								? invItem.history[0] + (invItem.interval * 86400000)
								: 0,
						}
					]));
				}
			});
			console.log('handleSubmit all done');
		}
		console.log('handleSubmit done');
		setInputText('');

	}

	const dumpState = _ => {
		const state = _Store.getState();

		console.log(state);
	}

	return (
		<SafeAreaView style={{ flexDirection: 'row', alignItems: 'center' }}>
			<TextInput
				style={_Styles.footerTextBox}
				onChangeText={setInputText}
				value={inputText}
				placeholder='Add an item ...'
			/>
			<Icon
				style={_Styles.footerIcon}
				name='plus'
				type='font-awesome'
				color='royalblue'
				reverse
				onPress={handleSubmit}
				disabled={currentPantry === -1}
			/>
			<Icon
				style={_Styles.footerIcon}
				name='broom'
				type='font-awesome-5'
				color='royalblue'
				reverse
				onPress={handleSweepAll}
			/>
			<Pressable
				onPress={dumpListData}
				onLongPress={dumpState}
			>
					<Icon
						style={_Styles.footerIcon}
						name='dump-truck'
						type='material-community'
						color='royalblue'
						reverse
					/>
			</Pressable>
		</SafeAreaView>
	);
}

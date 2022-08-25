import { useState } from 'react';
import {
	SafeAreaView,
	Text,
	TextInput,
	View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'react-native-elements';
import * as Pantry from '../slices/pantriesSlice';
import { _Styles } from '../res/_Styles';

export default function Footer(props) {
	const [ inputText, setInputText ] = useState('');
	const { _Pantries, currentPantry } = useSelector(S => S.pantries);
	const dispatch = useDispatch();

	const handleSubmit = _ => {
		console.log('handleSubmit:', currentPantry, inputText);

		// if the input field is empty, set all staples to needed
		// otherwise attempt to add the input field text as an item
		if(inputText) {
			dispatch(Pantry.addItem(inputText));
		} else {
			_Pantries[currentPantry].inventory.filter(item => item.staple && !item.listed)
				.forEach(item => dispatch(Pantry.updateItem({
					itemID: item.id,
					updatedItem: {
						...item,
						listed: true,
						needed: true
					}
				}))
			);
		}
		setInputText('');
	}

	const sweepAll = _ => {
		_Pantries[currentPantry].inventory.filter(i => !i.needed)
			.forEach(item => dispatch(Pantry.updateItem({
				itemID: item.id,
				updatedItem: {
					...item,
					listed: false,
					needed: true,
					history: [ Date.now(), ...item.history ]
				}
			}))
		);
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
				onPress={sweepAll}
			/>
		</SafeAreaView>
	);
}

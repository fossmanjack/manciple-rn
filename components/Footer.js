import {
	SafeAreaView,
	Text,
	TextInput,
	View
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import * as Pantry from '../slices/pantriesSlice';
import { _Styles } from '../res/_Styles';

export default function Footer() {
	const [ inputText, onChangeInputText ] = React.useState('');
	const { mode } = useSelector(S => S.options);
	const ptr = useSelector(S => S.pantries);
	const dispatch = useDispatch();

	const handleSubmit = _ => {
		console.log('handleSubmit:', ptr.currentPantry, inputText);

		//if(mode === 'list') {
		// if the input field is empty, set all staples to needed
		// otherwise attempt to add the input field text as an item
		if(inputText) {
			dispatch(Pantry.addItem(inputText));
		} else {
			ptr._Pantries[ptr.currentPantry].inventory.forEach(item =>
				item.staple && !item.listed && dispatch(Pantry.toggleListed(item.id)) && !item.needed && dispatch(Pantry.toggleNeeded(item.id)));
		}
		resetForm();
	}

	const resetForm = _ => {
		onChangeInputText('');
	}

	return (
		<SafeAreaView style={{ flexDirection: 'row', alignItems: 'center' }}>
			<TextInput
				style={_Styles.footerTextBox}
				onChangeText={onChangeInputText}
				value={inputText}
				placeholder='Add an item ...'
			/>
			<Icon
				style={_Styles.footerIcon}
				name='plus'
				type='font-awesome'
				color='royalblue'
				reverse
				onPress={_ => handleSubmit()}
				disabled={ptr.currentPantry === -1}
			/>
			<Icon
				style={_Styles.footerIcon}
				name='broom'
				type='font-awesome-5'
				color='royalblue'
				reverse
				onPress={_ => ptr._Pantries[ptr.currentPantry].inventory.forEach(i => !i.needed && dispatch(Pantry.toggleListed(i.id)))}
			/>
		</SafeAreaView>
	);
}

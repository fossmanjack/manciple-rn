import { useState } from 'react';
import Dialog from 'react-native-dialog';

export default function PantryDetailDialog(props) {
	const { pantry, visible, setVisible, handleEditPantry, handleDeletePantry } = props;
	const [ input, setInput ] = useState(pantry.name);

	return (
		<Dialog.Container visible={visible}>
			<Dialog.Title>
				Edit Pantry
			</Dialog.Title>
			<Dialog.Input
				placeholder='Edit pantry name...'
				value={input}
				onChangeText={text => setInput(text)}
			/>
			<Dialog.Button label='Delete List' onPress={handleDeletePantry} />
			<Dialog.Button label='Cancel' onPress={_ => setVisible(!visible)} />
			<Dialog.Button label='OK' onPress={_ => handleEditPantry(input)} />
		</Dialog.Container>
	);
}

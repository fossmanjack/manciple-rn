import { useSelector } from 'react-redux';
import { Button, Icon } from 'react-native-elements';
import { Text, View } from 'react-native';
import Dialog from 'react-native-dialog';

export default function PantryDetailDialog(props) {
	const { pantry, visible, setVisible, handleEditPantry } = props;

	const handleExport = _ => {
		console.log('handleExport', pantry);
	}

	return (
		<Dialog.Container visible={visible}>
			<Dialog.Title>
				Pantry Info: {pantry.name}
			</Dialog.Title>
			<View>
				<Text>
					Created on: {pantry.creationDate}
				</Text>
				<Text>
					Last modified: {pantry.modifyDate}
				</Text>
				<Text>
					Pantry size: {pantry.inventory.length}
				</Text>
			</View>
			<Dialog.Button
				label='Export'
				onPress={handleExport}
				icon={
					<Icon
						name='export'
						type='antdesign'
					/>
				}
			/>
			<Dialog.Button
				label='Edit'
				onPress={handleEditPantry}
				icon={
					<Icon
						name='pencil'
						type='font-awesome'
					/>
				}
			/>
			<Dialog.Button
				label='OK'
				onPress={_ => setVisible(!visible)}
				icon={
					<Icon
						name='check'
						type='font-awesome'
					/>
				}
			/>
		</Dialog.Container>
	);
}

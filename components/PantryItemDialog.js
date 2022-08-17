import { useSelector } from 'react-redux';
import { Button } from 'react-native-elements';
import { Text } from 'react-native';
import Dialog from 'react-native-dialog';

export default function PantryItemDialog(props) {
	const { display, pantry } = props;
	const { _Pantries, currentPantry } = useSelector(S => S.pantries);

	return (
		<Dialog.Container visible={display}>
			<Dialog.Title>
				Pantry Info: {pantry.name}
			</Dialog.Title>
			<Dialog.Description>
				<Text>
					Created on: {pantry.creationDate}
					Last modified: {pantry.modifyDate}
					Pantry size: {pantry.inventory.length}
				</Text>
			<Dialog.Button
				label='Export'
				onPress={handleExport}
				icon={
					<Icon
					/>
				}
			/>
			<Dialog.Button
				label='Edit'
				onPress={handleEditPantry}
				icon={
					<Icon
					/>
				}
			/>
			<Dialog.Button
				label='Close'
				onPress={handleClosePantryItemDialog}
				icon={
					<Icon
					/>
				}
			/>
		</Dialog.Container>
}

/*
			<Dialog.Container visible={showEditPantryDialog}>
				<Dialog.Title>
					Edit Pantry
				</Dialog.Title>
				<Dialog.Input
					placeholder='Edit pantry name...'
					value={inputEditPantry}
					onChangeText={text => setInputEditPantry(text)}
				/>
				<Dialog.Button label='Delete List' onPress={handleEPDDelete} />
				<Dialog.Button label='Cancel' onPress={handleEPDCancel} />
				<Dialog.Button label='OK' onPress={handleEPDCommit} />
			</Dialog.Container>
*/

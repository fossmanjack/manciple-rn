// ListDetalDialog.js
// Displays list meta-information and exposes list functions

// React, RN, RNE, Redux
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Button, Icon } from 'react-native-elements';

// Community
import Dialog from 'react-native-dialog';

export default function ListDetailDialog({ _Xstate }) {
	const { listToEdit: listID, funs: { setXstate } } = _Xstate;
	const { _Lists } = useSelector(S => S.lists);
	const refList = _Lists[listID];

	const handleExport = _ => {
		console.log('handleExport', pantry);
	}

	return (
		<Dialog.Container visible={_Xstate.showListDetail}>
			<Dialog.Title>
				List Info: {refList.name}
			</Dialog.Title>
			<View>
				<Text>
					Created on: {refList.creationDate}
				</Text>
				<Text>
					Last modified: {refList.modifyDate}
				</Text>
				<Text>
					List size: {refList.inventory.length}
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
				onPress={_ => setXstate({
					'showListDetail': false,
					'showListEdit': true
				})}
				icon={
					<Icon
						name='pencil'
						type='font-awesome'
					/>
				}
			/>
			<Dialog.Button
				label='OK'
				onPress={_ => setXstate({ 'showListDetail': false })}
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
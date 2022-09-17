// ListDetalDialog.js
// Displays list meta-information and exposes list functions

// React, RN, RNE, Redux
import { useContext } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Button, Icon } from 'react-native-elements';

// Community
import Dialog from 'react-native-dialog';

// Xstate
import { useXstate } from '../res/Xstate';

export default function ListDetailDialog() {
	const { listToEdit: listID, setXstate, showListDetail, parseDate } = useXstate();
	const { _Lists } = useSelector(S => S.lists);
	const refList = _Lists[listID];

	const handleExport = _ => {
		console.log('handleExport', pantry);
	}

	return (
		<Dialog.Container visible={showListDetail}>
			<Dialog.Title>
				List Info: {refList.name}
			</Dialog.Title>
			<View>
				<Text>
					List ID: {listID}
				</Text>
				<Text>
					Created on: {parseDate(refList.creationDate)}
				</Text>
				<Text>
					Last modified: {parseDate(refList.modifyDate)}
				</Text>
				<Text>
					List size: {Object.keys(refList.inventory).length}
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

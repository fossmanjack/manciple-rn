import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import * as Global from '../slices/globalSlice';
import * as Pantry from '../slices/pantriesSlice';
import SortOrderDialog from '../components/SortOrderDialog';

export default function Header({ drawerCtl }) {
	const ptr = useSelector(S => S.pantries);
	const { mode } = useSelector(S => S.global);
	const dispatch = useDispatch();
	const [ showSortDialog, setShowSortDialog ] = useState(false);

	const handleToggleMode = _ => {
		console.log(ptr._Pantries[ptr.currentPantry]);

		const targetMode = mode === 'list' ? 'pantry' : 'list';
		dispatch(Global.setMode(targetMode));
	}

	return (
		<>
			<View style={{ flexDirection: 'row', backgroundColor: 'royalblue', alignItems: 'center' }}>
				<Button
					type='outline'
					icon={
						<Icon
							name='menu'
							type='material-community'
							color='white'
						/>
					}
					onPress={drawerCtl}
				/>
				<View style={{ flex: 10 }}>
					<Text style={{ color: 'white', fontSize: 22 }}>
						{ptr.currentPantry !== -1 && ptr._Pantries[ptr.currentPantry].name}: {mode === 'list' ? 'List' : 'Pantry'} view
					</Text>
				</View>
				<View style={{ flex: 2, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
					<Button
						onPress={handleToggleMode}
						icon={mode === 'list'
							? <Icon
								name='list-status'
								type='material-community'
								color='white'
							/>
							: <Icon
								name='local-grocery-store'
								type='material'
								color='white'
							/>
						}
						color='royalblue'
					/>
					<Icon
						name='sort'
						type='material'
						onPress={_ => setShowSortDialog(!showSortDialog)}
						reverse
						color='royalblue'
					/>
				</View>
			</View>
			<SortOrderDialog
				dispatch={dispatch}
				visible={showSortDialog}
				setVisible={setShowSortDialog}
			/>
		</>
	);
}


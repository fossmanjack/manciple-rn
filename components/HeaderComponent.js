// HeaderComponent.js
// Provides the header for the application

// import React, RN, community deps
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';

// import custom components
import SortOrderDialog from '../components/SortOrderDialog';

// import slices
import * as Global from '../slices/globalSlice';
import * as Pantry from '../slices/pantriesSlice';

// function def
export default function Header(props) {
	const {
		drawerCtl,
		titleTxt,
		controls=false,
		mode='list',
		setMode
	} = props;
	const { _Pantries, currentPantry } = useSelector(S => S.pantries);
	const dispatch = useDispatch();
	const [ showSortDialog, setShowSortDialog ] = useState(false);

	const handleToggleMode = _ => {
		console.log(_Pantries[currentPantry]);

		const targetMode = mode === 'list' ? 'pantry' : 'list';
		setMode(targetMode);
	}
/*
	const HeaderTitle = _ => {
		let title;

		switch(nav) {
			case 'help':
				title = 'Help';
				break;
			case 'options':
				title = 'Options';
				break;
			case 'pantry':
				title = currentPantry === -1
					&& title = 'No pantry loaded!'
					|| title = `${_Pantries[currentPantry].name}: ${mode === 'list' ? 'List' : 'Pantry'} view`;
				break;
			default:
				title = 'Error!';
		}

		return (
			<Text style={{ color: 'white', fontSize: 20 }}>
				{title}
			</Text>
		);
	}
*/

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
					<Text style={{ color: 'white', fontSize: 20 }}>
						{titleTxt}
					</Text>
				</View>
				{ controls &&
					(
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
					)
				}
			</View>
			<SortOrderDialog
				dispatch={dispatch}
				visible={showSortDialog}
				setVisible={setShowSortDialog}
			/>
		</>
	);
}


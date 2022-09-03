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
		title,
		controls=false,
		nav,
		setNav,
	} = props;
	const { _Pantries, currentPantry } = useSelector(S => S.pantries);
	const dispatch = useDispatch();
	const [ showSortDialog, setShowSortDialog ] = useState(false);

	const handleToggleMode = _ => {
		console.log('handleToggleMode', _Pantries[currentPantry].id, ':', _Pantries[currentPantry].name);
		//_Pantries[currentPantry].inventory.forEach(item => console.log(`Item ${item.id}: needed: ${item.needed}, listed: ${item.listed}`));
		console.log('*******************');

		const target = nav === 'pantry' ? 'inventory' : 'pantry';
		setNav(target);
	}

	return (
		<>
			<View style={{ flexDirection: 'row', backgroundColor: 'royalblue', alignItems: 'center', height: 60 }}>
				<Button
					type='outline'
					icon={
						<Icon
							name='menu'
							type='material-community'
							color='white'
						/>
					}
					onPress={_ => drawerCtl(true)}
				/>
				<View style={{ flex: 10 }}>
					<Text style={{ color: 'white', fontSize: 20 }}>
						{title}
					</Text>
				</View>
				{ controls &&
					(
						<View style={{ flex: 2, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
							<Button
								onPress={handleToggleMode}
								icon={nav === 'pantry'
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


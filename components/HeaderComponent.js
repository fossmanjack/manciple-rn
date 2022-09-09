// HeaderComponent.js
// Provides the header for the application

// import React, RN, community deps
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';

// import custom components
import SortOrderDialog from '../components/SortOrderDialog';

// import slices
import * as Global from '../slices/globalSlice';
import * as Pantry from '../slices/listsSlice';

// function def
export default function Header({ _Xstate, setXstate }) {
	const {
		currentPage,
		headerTitle,
		headerControls,
		showSortDialog
		funs: { drawerCtl }
	} = _Xstate;
	const { _Lists, currentList } = useSelector(S => S.lists);

	const handleToggleMode = _ => {
		console.log('handleToggleMode', currentList, ':', _Lists[currentList].name);
		console.log('*******************');

		setXstate(currentPage === 'pantry'
			? {
				'currentPage': 'itemStore',
				'headerTitle': `Item Store (${_Lists[currentList].name})`,
				'headerControls': true
			} : {
				'currentPage': 'pantry',
				'headerTitle': `${_Lists[listID].name}: List view`,
				'headerControls': true
			});
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
				{ headerControls &&
					(
						<View style={{ flex: 2, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
							<Button
								onPress={handleToggleMode}
								icon={currentPage === 'pantry'
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
								onPress={_ => setXstate({ 'showSortOrder': true })}
								reverse
								color='royalblue'
							/>
						</View>
					)
				}
			</View>
		</>
	);
}


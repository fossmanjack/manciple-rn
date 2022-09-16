// HeaderComponent.js
// Provides the header for the application

// import React, RN, community deps
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { useSelector } from 'react-redux';

// import custom components
import SortOrderDialog from '../dialogs/SortOrderDialog';

// import slices
import * as Global from '../slices/globalSlice';
import * as Lists from '../slices/listsSlice';
import { useXstate } from '../res/Xstate';

// function def
export default function Header() {
	const {
		currentScreen,
		headerTitle,
		headerControls,
		showSortDialog,
		drawerCtl,
		setXstate,
		navigate
	} = useXstate();
	const { _Lists, currentList } = useSelector(S => S.lists);

	const handleToggleMode = _ => {
		console.log('handleToggleMode', currentList, ':', _Lists[currentList].name);
		console.log('*******************');

		if(currentScreen === 'currentList') {
			setXstate({
				'headerTitle': `Item Store (${_Lists[currentList].name})`,
				'headerControls': true
			});
			navigate('itemStore');
		} else {
			setXstate({
				'headerTitle': `${_Lists[currentList].name}: List view`,
				'headerControls': true
			});
			navigate('currentList');
		}
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
						{headerTitle}
					</Text>
				</View>
				{ headerControls &&
					(
						<View style={{ flex: 2, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
							<Button
								onPress={handleToggleMode}
								icon={currentScreen === 'currentList'
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


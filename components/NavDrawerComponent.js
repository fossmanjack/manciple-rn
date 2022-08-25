// NavDrawerComponent.js
// Called by MainComponent, provides navigation between lists and access to
// new lists, options, help, and user management
// Might be replaced with react-native-navigation

// react, RN, community imports
import { useDispatch, useSelector } from 'react-redux';
import {
	FlatList,
	Pressable,
	Text,
	View
} from 'react-native';
import {
	Icon
} from 'react-native-elements';

// component imports
import UserComponent from './UserComponent';

export default function NavDrawer(props) {
	const {
		handlePantryChange,
		setShowNewPantryDialog,
		setNav,
		showNewPantryDialog,
		showPantryDetail
	} = props.exports;
	const { _Pantries, currentPantry } = useSelector(S => S.pantries);
	const dispatch = useDispatch();

	return (
		<>
			<UserComponent />
			{ _Pantries.length > 0 &&
				<FlatList
					data={_Pantries}
					keyExtractor={item => item.id}
					renderItem={({ item: pantry }) => (
						<Pressable
							onPress={_ => handlePantryChange(pantry.id)}
							onLongPress={_ => showPantryDetail(pantry.id)}
							style={{
								borderBottomWidth: 1,
								borderBottomColor: 'lightgray',
								paddingVertical: 10,
							}}
						>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center'
								}}
							>
								<Icon
									name='list'
									type='entypo'
									size={22}
									style={{
										marginRight: 3,
										marginLeft: 10
									}}
								/>
								<Text
									style={{
										fontSize: 18
									}}
								>
									{pantry.name}
								</Text>
							</View>
						</Pressable>
					)}
				/>
			}
			<Pressable
				onPress={_ => {
					console.log('New pantry pressed');
					drawer.current.closeDrawer();
					setShowNewPantryDialog(!showNewPantryDialog);
				}}
				style={{
					borderBottomWidth: 1,
					borderBottomColor: 'lightgray',
					paddingVertical: 10,
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center'
					}}
				>
					<Icon
						name='add-to-list'
						type='entypo'
						size={22}
						style={{
							marginRight: 3,
							marginLeft: 10
						}}
					/>
					<Text
						style={{
							fontSize: 18
						}}
					>
						New Pantry...
					</Text>
				</View>
			</Pressable>
			<Pressable
				style={{
					borderBottomWidth: 1,
					borderBottomColor: 'lightgray',
					paddingVertical: 10,
				}}
				onPress={_ => setNav('options')}
			>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center'
					}}
				>
					<Icon
						name='settings'
						type='material'
						size={22}
						style={{
							marginRight: 3,
							marginLeft: 10
						}}
					/>
					<Text
						style={{
							fontSize: 18
						}}
					>
						Settings
					</Text>
				</View>
			</Pressable>
			<Pressable
				style={{
					borderBottomWidth: 1,
					borderBottomColor: 'lightgray',
					paddingVertical: 10,
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center'
					}}
				>
					<Icon
						name='help-circle-outline'
						type='material-community'
						size={22}
						style={{
							marginRight: 3,
							marginLeft: 10
						}}
					/>
					<Text
						style={{
							fontSize: 18
						}}
					>
						Help
					</Text>
				</View>
			</Pressable>
		</>
	);
}

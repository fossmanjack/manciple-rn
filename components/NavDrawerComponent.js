// NavDrawerComponent.js
// Called by MainComponent, provides navigation between lists and access to
// new lists, options, help, and user management
// Might be replaced with react-native-navigation

// react, RN, community imports
import { useSelector } from 'react-redux';
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
import UserComponent from '../components/UserComponent';

// utils
import * as Utils from '../utils/utils';
import { useXstate } from '../res/Xstate';

export default function NavDrawer() {
	const {
		showListDetail,
		showListCreate,
		handleListChange,
		setXstate,
		dumpXstate,
		navigate,
		drawerCtl
	} = useXstate();
	const { _Lists, currentList } = useSelector(S => S.lists);
	Utils.debugMsg('NavDrawer rendering with keys: '+JSON.stringify(Object.keys(_Lists)), Utils.VERBOSE);

	return (
		<>
			<UserComponent />
			{ Object.keys(_Lists).length &&
				<FlatList
					data={Object.keys(_Lists)}
					keyExtractor={data => {
						Utils.debugMsg('NavComponent keyExtractor data: '+JSON.stringify(data));
						return data;
					}}
					renderItem={data => {
						const list = _Lists[data.item];
						Utils.debugMsg('NavComponent renderItem:\n\tdata: '+JSON.stringify(data)+
							'\n\tlist.name: '+list.name);
						return (
							<Pressable
								onPress={_ => handleListChange(data.item)}
								onLongPress={_ => {
									setXstate({
										'showListDetail': true,
										'listToEdit': data.item
									});
									drawerCtl(false);
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
										{list.name}
									</Text>
								</View>
							</Pressable>
						);
					}}
				/>
			}
			<Pressable
				onPress={_ => {
					console.log('New list pressed');
					drawerCtl(false);
					setXstate({
						'headerTitle': `${_Lists[currentList].name}: List view`,
						'headerControls': true,
						'showListCreate': true
					});
					navigate('currentList');
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
						New List...
					</Text>
				</View>
			</Pressable>
			<Pressable
				style={{
					borderBottomWidth: 1,
					borderBottomColor: 'lightgray',
					paddingVertical: 10,
				}}
				onPress={dumpXstate}
			>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center'
					}}
				>
					<Icon
						name='state-machine'
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
						Dump Xstate
					</Text>
				</View>
			</Pressable>
			<Pressable
				style={{
					borderBottomWidth: 1,
					borderBottomColor: 'lightgray',
					paddingVertical: 10,
				}}
				onPress={_ => {
					drawerCtl(false);
					navigate('options');
				}}
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
				onPress={_ => {
					drawerCtl(false);
					navigate('help');
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

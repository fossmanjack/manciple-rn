// UserComponent.js
// Provides badge, name, title info for logged-in user

import {
	Pressable,
	Text,
	View
} from 'react-native';
import {
	Avatar
} from 'react-native-elements';

import { useXstate } from '../res/Xstate';

export default function UserComponent() {
	const { navigate, drawerCtl } = useXstate();

	const handlePress = _ => {
		navigate('user');
		drawerCtl(false);
	};

	return (
		<Pressable onPress={handlePress} style={{ backgroundColor: 'royalblue' }}>
			<View style={{ flexDirection: 'row' }}>
				<Avatar
					rounded
					icon={{ name: 'user-circle', type: 'font-awesome' }}
				/>
				<View>
					<Text>
						User Login
					</Text>
					<Text>
						https://
					</Text>
				</View>
			</View>
		</Pressable>
	);
}

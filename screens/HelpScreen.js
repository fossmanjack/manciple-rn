import {
	Pressable,
	Text,
	View
} from 'react-native';
import Header from '../components/HeaderComponent';
import { useXstate } from '../res/Xstate';

export default function HelpScreen() {
	const { navigate } = useXstate();

	return (
		<View>
			<Pressable onPress={_ => navigate('currentList')}>
				<Text>Back to Pantry</Text>
			</Pressable>
		</View>
	);
}

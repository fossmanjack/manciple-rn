import {
	Pressable,
	View
} from 'react-native';
import Header from '../components/HeaderComponent';
import { useXstate } from '../res/Xstate';

export default function HelpScreen() {
	const { navigate } = useXstate();

	return (
		<View>
			<Header
				_Xstate={_Xstate}
				title='Manciple Help'
			/>
			<Pressable onPress={_ => navigate('currentList')}>
				<Text>Back to Pantry</Text>
			</Pressable>
		</View>
	);
}

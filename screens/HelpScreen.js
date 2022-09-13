import {
	Pressable,
	View
} from 'react-native';
import Header from '../components/HeaderComponent';

export default function HelpScreen({ _Xstate }) {
	const { navigate } = _Xstate.funs;

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

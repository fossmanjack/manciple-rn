import {
	Pressable,
	View
} from 'react-native';
import Header from '../components/HeaderComponent';

export default function HelpScreen(props) {
	const { _Xstate, setXstate } = props;

	return (
		<View>
			<Header
				_Xstate={_Xstate}
				setXstate={setXstate}
				title='Manciple Help'
			/>
			<Pressable onPress={_ => setXstate({ 'currentPage': 'pantry' })}>
				<Text>Back to Pantry</Text>
			</Pressable>
		</View>
	);
}

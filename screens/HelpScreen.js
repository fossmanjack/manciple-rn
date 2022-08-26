import {
	Pressable,
	View
} from 'react-native';
import Header from '../components/HeaderComponent';

export default function HelpScreen(props) {
	const { setNav, drawer } = props;

	return (
		<View>
			<Header
				drawerCtl={drawerCtl}
				title='Manciple Help'
			/>
			<Pressable onPress={_ => setNav('pantry')}>
				<Text>Back to Pantry</Text>
			</Pressable>
		</View>
	);
}

import {
	ActivityIndicator,
	Text,
	View
} from 'react-native';

export default function Loading() {
	return (
		<View style={{
			alignItems: 'center',
			justifyContent: 'center',
			flex: 1
		}}>
			<ActivityIndicator
				size='large'
				color='royalblue'
			/>
			<Text style={{
				color: 'royalblue',
				fontSize: 14,
				fontWeight: 'bold'
			}}>
			</Text>
		</View>
	);
}

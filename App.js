import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import {
	Text,
	View
} from 'react-native';
import { _Store } from './res/_Store';
import { _Styles } from './res/_Styles';
import MainScreen from './screens/MainScreen';

export default function App() {
	return (
		<NavigationContainer>
			<Provider store={_Store}>
				<View style={_Styles.viewMain}>
					<MainScreen />
				</View>
			</Provider>
		</NavigationContainer>
	);
}

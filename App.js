import { Provider } from 'react-redux';
//import { NavigationContainer } from '@react-navigation/native';
import {
	Text,
	View
} from 'react-native';
import { _Store } from './res/_Store';
import { _Styles } from './res/_Styles';
//import MainScreen from './screens/MainScreen';
import Main from './components/MainComponent';
import Loading from './components/LoadingComponent';
import * as Global from './slices/globalSlice';

export default function App() {

	return (
		<Provider store={_Store}>
			<View style={_Styles.viewMain}>
				<Main />
			</View>
		</Provider>
	);
}

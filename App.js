import { Provider } from 'react-redux';
//import { NavigationContainer } from '@react-navigation/native';
import {
	Text,
	View
} from 'react-native';
import { _Store } from './res/_Store';
import { _Styles } from './res/_Styles';
import MainScreen from './screens/MainScreen';
//import XstateProvider from './utils/XstateProvider';
import { XstateProvider } from './res/Xstate';
import Main from './components/MainComponent';
import Loading from './components/LoadingComponent';
import * as Global from './slices/globalSlice';

export default function App() {

	return (
		<Provider store={_Store}>
			<XstateProvider>
				<View style={_Styles.viewMain}>
					<Main />
				</View>
			</XstateProvider>
		</Provider>
	);
}

import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import {
	Text,
	View
} from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { _Store, _Persist } from './res/_Store';
import { _Styles } from './res/_Styles';
//import MainScreen from './screens/MainScreen';
import Main from './components/MainComponent';
import Loading from './components/LoadingComponent';
import * as Global from './slices/globalSlice';

export default function App() {
	console.log('Persistor:', _Persist);

	return (
		<Provider store={_Store}>
			<PersistGate
				loading={<Loading />}
				persistor={_Persist}
			>
				<NavigationContainer>
					<View style={_Styles.viewMain}>
						<Main />
					</View>
				</NavigationContainer>
			</PersistGate>
		</Provider>
	);
}

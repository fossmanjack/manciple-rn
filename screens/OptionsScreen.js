import { useState } from 'react';
import {
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View
} from 'react-native';
import {
	Button
} from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import SecureStorage from 'expo-secure-storage';
import Header from '../components/HeaderComponent';
import * as Pantry from '../slices/pantriesSlice';
import * as Options from '../slices/optionsSlice';
import * as Global from '../slices/globalSlice';
import * as Dav from '../utils/davModule';

export default function OptionsScreen(props) {
	const { setNav, drawerCtl } = props;
	const _Opts = useSelector(S => S.options);
	const [ username, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ userdataSaved, setUserdataSaved ] = useState(false);
	const [ syncOpen, setSyncOpen ] = useState(false);
	const [ syncValue, setSyncValue ] = useState(_Opts.sync);
	const [ syncItems, setSyncItems ] = useState([
		{ label: 'None', value: 'none' },
		{ label: 'NextCloud', value: 'nc' },
		{ label: 'WebDAV', value: 'dav' },
		{ label: 'Manciple', value: 'node' }
	]);

	const dispatch = useDispatch();

	const rehydrateUser = async _ => {
		try {
			const res = await SecureStore.getItemAsync('userinfo');
			setUsername(userinfo.username);
			setPassword(userinfo.password);
		} catch(err) {
			console.log('Could not retrieve user info:', err);
		}
	};

	useEffect(_ => {
		rehydrateUser();
	}, []);

	const handleSetValue = val => {
		dispatch(Options.setSync(val));
		setSyncValue(val);
		setSyncOpen(false);
	}

	const handleSave = async _ => {
		try {
			await(SecureStore.setItemAsync(
			'userinfo',
			JSON.stringify({
				username,
				password
			})));
			setUserdataSaved(true);
		} catch(err) {
			console.log('Could not save user data!');
		}
	}

	const restoreDefaults = _ => {
		// purge store
		console.log('Attempting to restore defaults!');
		dispatch(Pantry.resetState());
	}

	const SyncForm = _ => {
		switch(_Opts.sync) {
			case 'nc':
				return (
					<View>
						<View style={{ flexDirection: 'row' }}>
							<Text>
								Nextcloud URL:
							</Text>
							<Input />
						</View>
						<View style={{ flexDirection: 'row' }}>
							<Text>
								Nextcloud User:
							</Text>
							<Input />
						</View>
						<View style={{ flexDirection: 'row' }}>
							<Text>
								Password:
							</Text>
							<Input />
						</View>
						<Button
							title={userdataSaved ? 'Saved!' : 'Save'}
							onPress={handleSave}
							disabled={!userdataSaved}
						/>
					</View>
				);
				break;
			default:
				return (<View></View>);
		}
	}

	return (
		<View style={styles.container}>
			<Header
				drawerCtl={drawerCtl}
				title='Options'
			/>
			<Text>
				TBI:
					- Back-end storage option
					- State reset button (flush persistent storage)
					- Light/dark mode
			</Text>
			<View style={styles.row}>
				<Text>Synchronization Back-End</Text>
				<DropDownPicker
					open={syncOpen}
					value={syncValue}
					items={syncItems}
					setOpen={setSyncOpen}
					setValue={setSyncValue}
					setItems={setSyncItems}
					onChangeValue={handleSetValue}
				/>
			</View>
			<View>
				<Button
					onPress={restoreDefaults}
					title='Restore Factory Defaults'
				/>
			</View>
			<View>
				<Button
					onPress={_ => setNav('pantry')}
					title='Back to Pantry'
				/>
			</View>
			<View>
				<Button
					onPress={_ => Dav.saveStateToDAV()}
					title='State Save Test'
				/>
			</View>
			<View>
				<SyncForm key={syncValue} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	row: {
		flexDirection: 'row'
	}
});

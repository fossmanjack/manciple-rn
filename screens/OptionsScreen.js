import { useState, useEffect } from 'react';
import {
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View
} from 'react-native';
import {
	Button,
	Input
} from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import * as SecureStore from 'expo-secure-store';
import Header from '../components/HeaderComponent';
import * as Pantry from '../slices/pantriesSlice';
import * as Options from '../slices/optionsSlice';
import * as Global from '../slices/globalSlice';
//import * as Dav from '../utils/davModule';
import * as Saver from '../utils/saver';

export default function OptionsScreen(props) {
	const { setNav, drawerCtl } = props;
	const _Opts = useSelector(S => S.options);
	const [ username, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ url, setURL ] = useState(_Opts[_Opts.sync].url);
	const [ path, setPath ] = useState('/Apps/Manciple');
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
			const userinfo = JSON.parse(res);
			if(userinfo) {
				setUsername(userinfo.username);
				setPassword(userinfo.password);
			}
		} catch(err) {
			console.log('Could not retrieve user info:', err);
		}
	};

	useEffect(_ => {
		rehydrateUser();
	}, []);
/*
	useEffect(_ => SecureStore.getItemAsync('userinfo')
		.then(res => {
			console.log(res);
			const userinfo = JSON.parse(res);
			console.log(userinfo);
			if(userinfo) {
				setUsername(userinfo.username);
				setPassword(userinfo.password);
			}
		}), []);
*/

	const handleSetValue = val => {
		dispatch(Options.setSync(val));
		setSyncValue(val);
		setSyncOpen(false);
	};

	const handleSave = async _ => {
		//const userOb = { username, password };
		//const userTxt = JSON.stringify(userOb);
		dispatch(Options.setSyncOpts({ [syncValue]: { url, path }}));
		try {
			//console.log('Attempting to set userinfo with', userTxt);
			res = await SecureStore.setItemAsync(
				'userinfo',
				JSON.stringify({
					username,
					password
				})
			);
			console.log(res);
			res && setUserdataSaved(true);
		} catch(err) {
			console.log('Could not save user data!', err);
		}
	};

	const restoreDefaults = _ => {
		// purge store
		console.log('Attempting to restore defaults!');
		dispatch(Pantry.resetState());
	};

	const SyncForm = _ => {
		//switch(_Opts.sync) {
		////	case 'nc':
				return (
					<>
						<View style={{ flexDirection: 'row' }}>
							<Input
								placeholder='Nextcloud URL'
								onChangeText={text => {
									setURL(text);
									setUserdataSaved(false);
								}}
								value={url}
								style={styles.formInput}
								label='Nextcloud URL'
							/>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<Input
								placeholder='Application path'
								onChangeText={text => {
									setPath(text);
									setUserdataSaved(false);
								}}
								value={path}
								style={styles.formInput}
								label='Application path'
							/>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<Input
								placeholder='Username'
								onChangeText={text => {
									setUsername(text);
									setUserdataSaved(false);
								}}
								value={username}
								style={styles.formInput}
								label='Username'
							/>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<Input
								secureTextEntry
								placeholder=''
								onChangeText={text => {
									setPassword(text);
									setUserdataSaved(false);
								}}
								value={password}
								style={styles.formInput}
								label='Password'
							/>
						</View>
						<Button
							title={userdataSaved ? 'Saved!' : 'Save'}
							onPress={handleSave}
							disabled={userdataSaved}
						/>
					</>
				);
		//		break;
		//	default:
		//		return (<View></View>);
		//}
	};

	return (
		<View
			keyboardShouldPersistTaps='always'
			style={styles.mainContainer}
		>
			<Header
				drawerCtl={drawerCtl}
				title='Options'
			/>
			<Text>
				TBI:
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
					onPress={_ => Saver.saveState(dispatch)}
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
	mainContainer: {
		flex: 1
	},
	row: {
		flexDirection: 'row'
	},
	formInput: {
		padding: 8,
		height: 60
	}
});


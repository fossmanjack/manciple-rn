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
import { useSelector } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import * as SecureStore from 'expo-secure-store';
import Header from '../components/HeaderComponent';
import * as Lists from '../slices/listsSlice';
import * as Options from '../slices/optionsSlice';
import * as Global from '../slices/globalSlice';
//import * as Dav from '../utils/davModule';
import * as Saver from '../utils/saver';
import { _Persist } from '../res/_Store';
import { Xstate } from '../res/Xstate';

export default function OptionsScreen() {
	const { dispatch, drawerCtl, navigate } = Xstate;
	const _Opts = useSelector(S => S.options);
//	const [ username, setUsername ] = useState('');
//	const [ password, setPassword ] = useState('');
//	const [ url, setURL ] = useState(_Opts[_Opts.sync].url);
//	const [ path, setPath ] = useState('/Apps/Manciple');
//	const [ userdataSaved, setUserdataSaved ] = useState(false);
	const [ syncOpen, setSyncOpen ] = useState(false);
	const [ syncValue, setSyncValue ] = useState(_Opts.sync);
	const [ syncItems, setSyncItems ] = useState([
		{ label: 'None', value: 'none' },
		{ label: 'NextCloud', value: 'nc' },
		{ label: 'WebDAV', value: 'dav' },
		{ label: 'Seneschal', value: 'seneschal' }
	]);


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
		dispatch(Options.setSyncType(val));
		setSyncValue(val);
		setSyncOpen(false);
	};
/*
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
*/

	const restoreDefaults = _ => {
		// purge store
		console.log('Attempting to restore defaults!');
		Alert.alert(
			'Reset Application State',
			'Are you sure you want to reset the application state?  This will delete all list content and purchase history!',
			[
				{
					text: 'Cancel',
					style: 'cancel'
				},
				{
					text: 'Confirm',
					onPress: _ => _Persist.purge()
				}
			],

		);
	};

	const SyncForm = _ => {
		//switch(_Opts.sync) {
		////	case 'nc':
		return ( <View></View> );
		//		break;
		//	default:
		//		return (<View></View>);
		//}
	};

	return (
		<View
			style={styles.mainContainer}
		>
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
					color='red'
				/>
			</View>
			<View>
				<Button
					onPress={_ => navigate('currentList')}
					title='Back to List View'
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


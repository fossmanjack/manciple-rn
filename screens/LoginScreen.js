import { useState, useEffect } from 'react';
import {
	Text,
	View
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
	Avatar,
	Button,
	Icon,
	Input
} from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import * as User from '../slices/userSlice';

export default function LoginScreen(props) {
	const { dav: { url, path }, sync, userAvi } = useSelector(S => S.user);
	const [ urlTxt, setURLTxt ] = useState('https://');
	const [ pathTxt,setPathTxt ] = useState('/Apps/Manciple');
	const [ username, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ userdataSaved, setUserdataSaved ] = useState(true);
	const dispatch = useDispatch();


	const rehydrateUser = async _ => {
		try {
			const res = await SecureStore.getItemAsync('userinfo');
			const userinfo = JSON.parse(res);
			if(userinfo) {
				setUsername(userinfo.username);
				setPassword(userinfo.password);
				setUrlTxt(url);
				setPathTxt(path);
			}
		} catch(err) {
			console.log('Could not retrieve user info:', err);
		}
	};

	useEffect(_ => {
		rehydrateUser();
	}, []);

	return (
		<>
			<Avatar
				{ !username && icon={{ name: 'user-circle' type: 'fontawesome' }}
					|| !userAvi && title={`${username[0]}${username[1]}`}
					|| source={userAvi}
				}
				rounded
			/>
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
}

/*









*/

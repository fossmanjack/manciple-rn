import { useState, useEffect } from 'react';
import {
	StyleSheet,
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
import * as Options from '../slices/optionsSlice';
import * as Saver from '../utils/saver';
import Header from '../components/HeaderComponent';
import { _Store } from '../res/_Store';
import { useXstate } from '../res/Xstate';

export default function UserScreen() {
	const { dispatch, drawerCtl, navigate } = useXstate();
	const userState = useSelector(S => S.user);
	const optionsState = useSelector(S => S.options);
	const [ url, setUrl ] = useState(optionsState.syncOpts.url || 'https://');
	const [ path, setPath ] = useState(optionsState.syncOpts.path || '/Apps/Manciple');
	const [ username, setUsername ] = useState(userState.username || '');
	const [ password, setPassword ] = useState(userState.password || '');
	const [ userAvi, setUserAvi ] = useState(userState.userAvi || null);
	const [ userdataSaved, setUserdataSaved ] = useState(true);
	const [ userLoggedIn, setUserLoggedIn ] = useState(username ? true : false);


	const handleLogin = _ => {

		// save userinfo to secure storage
		SecureStore.setItemAsync('userinfo', JSON.stringify({ username, password }))

		// set user state
		.then(_ => {
			// Saver.login() does the next two things
			//dispatch(User.setUsername(username));
			//dispatch(User.setPassword(password));
			dispatch(Options.setSyncOpts({ url, path }));
		})

		// sync
		.then(_ => Saver.login(_Store))
		.then(_ => setUserLoggedIn(true))
		.catch(err => {
			console.log('Error: could not login ---', err);
		});
	}

	const handleLogout = _ => {
		Saver.logout(_Store);

		setUrl('https://');
		setPath('/Apps/Manciple');
		setUsername('');
		setPassword('');
		setUserAvi('');
		setUserLoggedIn(false);
	}

	const UserAvi = _ => {
		return !username ? (
			<Avatar
				rounded
				icon={{ name: 'user-circle', type: 'font-awesome' }}
			/>
		) : !userAvi ? (
			<Avatar
				rounded
				title={`${username[0]}`}
			/>
		) : (
			<Avatar
				rounded
				source={userAvi}
			/>
		);
	}

	return (
		<>
			<UserAvi />
			<View style={{ flexDirection: 'row' }}>
				<Input
					placeholder='Nextcloud URL'
					onChangeText={text => {
						setUrl(text);
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
			{
				userLoggedIn ? (
					<Button
						title='Logout'
						onPress={handleLogout}
					/>
				) : (
					<Button
						title='Login'
						onPress={handleLogin}
						disabled={!username}
					/>
				)
			}
		</>
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
/*

Put all userinfo {
	username
	password
	userAvi ref
	fullname
	url
	port
	path
} into securestorage

figure out how to ref to userAvi, or just store that one in state








*/

/*
	const rehydrateUser = async _ => {
		try {
			const res = await SecureStore.getItemAsync('userinfo');
			const userinfo = JSON.parse(res);
			if(userinfo) {
				setUsername(userinfo.username);
				setPassword(userinfo.password);
				setUrl(savedURL);
				setPath(savedPath);
				setUserLoggedIn(true);
			}
		} catch(err) {
			console.log('Could not retrieve user info:', err);
		}
	};

	useEffect(_ => {
		rehydrateUser();
	}, []);

	const handleLogin = _ => {
		SecureStore.setItemAsync(
			'userinfo',
			JSON.stringify({
				username,
				password
			})
		)
		.then(_ => dispatch(User.setSync('nc'))
		.then(_ => dispatch(User.setSyncOpts({ url, path }))
		.then(_ => setUserLoggedIn(true))
		.catch(err => console.log('Could not save userinfo:', err));
	}

	useEffect(_ => {
		userLoggedIn && Saver.login(userState)
	}, [ userLoggedIn ]);

		// first save userpass to secure storage
		// dispatch the user state update
		// call share for userAvi
		// initPath()
		// get digest if it exists
		// sync
		setUserdataSaved(true);
	};
*/

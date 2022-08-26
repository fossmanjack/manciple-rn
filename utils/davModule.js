import * as SecureStore from 'expo-secure-store';
import { createClient } from 'webdav';
import { useSelector } from 'react-redux';
import { _Store } from '../res/_Store';

export async function saveStateToDAV() {
	const state = _Store.getState();
	const { dav } = state.global;
	const ptr = state.pantries;

	console.log(dav);

	//const { username, password } = await JSON.parse(SecureStore.getItemAsync('userinfo'));

	const username='';
	const password='';

	//const davPath = `${dav.url}${dav.path}`;

	const davPath = 'https://cloud.sagephoenix.org/remote.php/dav/files/dummy/Apps/Manciple'

	const davClient = createClient(
		davPath,
		{
			username,
			password
		}
	);

	try {
		console.log(`Trying to save state to ${davPath}/manciple.json...`);
		//const res = await davClient.putFileContents(`${davPath}/manciple.json`, JSON.stringify(ptr));
		const res = await davClient.putFileContents(`${davPath}/manciple.json`, 'This is a test');
	} catch(err) {
		console.log('Error saving data to remote host: ', err);
	}
}

export async function loadStateFromDav() {
	const { dav } = useSelector(S => S.global);

	const { username, password } = await JSON.parse(SecureStore.getItemAsync('userinfo'));

	const davPath = `${dav.url}${dav.path}`;

	const davClient = createClient(url, { username, password });

	try {
		const res = await davClient.getFileContents(`${davPath}/manciple.json`, { format: 'text' });
	} catch(err) {
		console.log('Error retrieving data from remote host: ', err);
	}

	return JSON.parse(res);
}




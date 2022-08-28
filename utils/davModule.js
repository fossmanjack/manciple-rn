import * as SecureStore from 'expo-secure-store';
import { createClient } from 'webdav';
import { useSelector } from 'react-redux';
//import { _Store } from '../res/_Store';

export default function davClient(state) {
	const { options: { dav }, global: { clientID }} = state;
	let username, password, davPath, retriever;
	//const [ username, setUsername ] = useState('');
	//const [ password, setPassword ] = useState('');

	//let davPath = `${dav.url}/remote.php/dav/files/${username}/${dav.path}`;

	const getUserinfo = async _ => await JSON.parse(SecureStore.getItemAsync('userinfo'));

	useEffect(_ => {
		const { username, password } = getUserInfo();
		//setUsername(userinfo.username);
		//setPassword(userinfo.password);
		retriever = createClient(
			davPath,
			{
				username,
				password
			}
		);
	}, []);

	const get = async filename => {
		try {
			const res = await JSON.parse(retriever.getFileContents(filename, { format: 'text' }));
		} catch(err) {
			console.log(`Could not retrieve ${filename}: ${err}`);
			return false;
		}
		return res;
	}

	const put = async (filename, textData) => {
		try {
			const res = retriever.putFileContents(filename, textData);
		} catch(err) {
			console.log(`Could not save ${filename}: ${err}`);
			return false;
		}
		return true;
	}

	return { ...retriever, get, put };
}

/*
export async function saveStateToDAV() {
	const { pantries, options: { dav }, global: { clientID }} = _Store.getState();

	const { username, password } = await JSON.parse(SecureStore.getItemAsync('userinfo'));
	console.log(dav);

	//const { username, password } = await JSON.parse(SecureStore.getItemAsync('userinfo'));

	const username='dummy';
	const password='atypical-humongous-glazing';

	//const davPath = `${dav.url}${dav.path}`;

	const davPath = 'https://cloud.sagephoenix.org/remote.php/dav/files/dummy/Apps/Manciple'

	const davClient = createClient(
		davPath,
		{
			username,
			password
		}
	);

	const mancipleData = {
		timestamp: Date.now(),
		clientID,
		pantries
	}


	try {
		console.log(`Trying to save state to ${davPath}/manciple.json...`);
		//const res = await davClient.putFileContents(`${davPath}/manciple.json`, JSON.stringify(ptr));
		const res = await davClient.putFileContents('/manciple.json', JSON.stringify(mancipleData));
	} catch(err) {
		console.log('Error saving data to remote host: ', err);
	}
}

export async function loadStateFromDav() {
	const { dav } = _Store.getState().options;

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

*/



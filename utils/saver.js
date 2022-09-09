import { useDispatch } from 'react-redux'
import * as Dav from 'webdav';
import * as SecureStore from 'expo-secure-store';
import * as User from '../slices/userSlice';
import * as Options from '../slices/optionsSlice';
import * as Global from '../slices/globalSlice';
//import { _Store } from '../res/_Store';

export const getClient = args => {
	// Returns a client interface based on sync type
	// Takes an object with { username, password, sync, url, path, port }
	const { username, password, sync, url, path, port } = args;

	switch(sync) {
		case 'nc': case 'dav':
			return Dav.createClient(
				`${url}/remote.php/dav/${username}/files`,
				{ username, password }
			);
			break;
		case 'node':
			console.log('Node support not yet implemented!');
			return false;
			break;
		default:
			console.log('No sync support configured!');
	}

	return false;
}

export function login(_Store) {
	// called from UserScreen
	const state = _Store.getState();
	const dispatch = _Store.dispatch;
	const clientInfo = {
		username: null,
		password: null,
		sync: state.options.syncType,
		url: state.options.syncOpts.url,
		path: state.options.syncOpts.path,
		port: state.options.syncOpts.port
	}

	console.log('Attempting to retrieve userinfo...');
	SecureStore.getItemAsync('userinfo')
	.then(res => JSON.parse(res))
	.then(userinfo => {
		if(userinfo) {
			console.log('Loading userinfo', userinfo);
			clientInfo.username = userinfo.username;
			clientInfo.password = userinfo.password;
			dispatch(User.setUsername(userinfo.username));
			dispatch(User.setPassword(userinfo.password));
			dispatch(User.setUserAvi(userinfo.userAvi));
			dispatch(Global.setLastUse(Date.now()));
			console.log('Done');
		} else {
			console.log('No userinfo found, aborting...');
			return null;
		}
	})
	.then(_ => {
		console.log('Attempting to get client with:', clientInfo);
		const client = getClient(clientInfo);
		const localManifest = generateManifest(state);
		console.log(client);
	})
	.catch(err => {
		console.log('Error in login ---', err);
	});

}

export function logout(_Store) {
	const dispatch = _Store.dispatch;

	SecureStore.deleteItemAsync('userinfo');
	dispatch(Options.setSyncOpts({
		url: 'https://',
		path: '/App/Manciple'
	}));
	dispatch(User.setUsername(''));
	dispatch(User.setPassword(''));
	dispatch(User.setUserAvi(''));
}


export async function saveState(_Store) {
	const state = _Store.getState();
	const local = generateManifest();
	const queue = [ ...state.lists._Lists ];
	const syncClient = Dav.davClient(state);

	// for now let's just put all lists into the remote store

	try {
		let res = syncClient.put('manifest.json', JSON.stringify(local), { format: 'text' });
	} catch(err) {
		console.log('Error: could not put manifest.json ---', err);
	}

	queue.forEach(ptr => {
		try {
			res = syncClient.put(`${ptr.id}.json`, JSON.stringify(ptr), { format: 'text' });
		} catch(err) {
			console.log(`Error: could not put ${ptr.id}.json --- ${err}`);
		}
	});
}

export function loadState(_Store) {
	const state = _Store.getState();
	const dispatch = _Store.dispatch;
	const local = generateManifest(state);

	// check to see if manifest exists -- if yes, grab it, if no, initRemoteRepo()

	console.log('loadState', local);
}

export function initRemoteRepo(_Store) {
	const state = _Store.getState();
	const dispatch = _Store.dispatch;
	const local = generateManifest(state);
	const syncClient = Dav.davClient(state);

	// create remote directory and save manifest and pantry files
}


export function generateManifest(state) {

	const ret = {
		timestamp: state.global.lastUse,
		clientID: state.global.clientID,
		lists: { }
	}

	state.lists._Lists.forEach(ptr => ret.lists[ptr.id] = ptr.modifyDate);

	return ret;
}


/*
	try {
		let res = await SecureStore.getItemAsync('userinfo');
		let userinfo = JSON.parse(res);
		if(userinfo) {
			console.log('Loading userinfo', userinfo);
			clientInfo.username = userinfo.username;
			clientInfo.password = userinfo.password;
			dispatch(User.setUsername(userinfo.username));
			dispatch(User.setPassword(userinfo.password));
			dispatch(User.setUserAvi(userinfo.userAvi));
			console.log('Done');
		} else {
			console.log('No userinfo found, aborting...');
			return;
		}
	} catch(err) {
		console.log('Could not load userinfo ---', err);
		return;
	}

	const client = getClient(clientInfo);
	const localManifest = generateManifest();

	console.log(client);
*/
/*
	// does path exist?  if not, create

	if(await client.exists(path) === false) {
		await client.createDirectory(path);
	}

	// does manifest exist?  if not, initial save

	if(await client.exists(`${path}/manifest.json`) === false) {
		await client.putFileContents(`${path}/manifest.json`, JSON.stringify(localManifest), { overwrite: true });
	}

	// run syncToRemote
*/
/*
export async function getRemoteState(dispatch) {
	const state = _Store.getState();
	const queue = [];
	console.log('getRemoteState called');
	// outline:
	// - read from remote file
	// if local timestamp is older, overwrite local
	// if remote timestamp is older, throw alert to resolve
	// remote file structure: {
	//     timestamp: ...,
	//     clientID: ...,
	//     data: {
	//         lists: {
	//             _Lists: { ... },
	//             currentList: int
	//         }
	//     }
	// }
	const retriever = _ => {
		switch(state.options.sync) {
			case 'dav': case 'nc':
				return Dav.davClient();
				break;
			case 'node':
				return null; // nyi
				break;
			default:
				return null;
		}
	};

	const localManifest = generateManifest();
	const remoteManifest = JSON.parse(syncClient.get('manifest.json'));

	if(localManifest.timestamp > remoteManifest.timestamp) {
		state.lists._Lists.forEach(ptr => {
			if(ptr.modifyDate > remoteManifest.lists[ptr.id])
				queue.push(ptr.id);
		})
	};

	queue.forEach(entry => {
		try {
			let data = JSON.parse(retriever().get(`${entry}.json`, { format: 'text' }));
			dispatch(Pantries.updatePantry(data));
		} catch(err) {
			console.log(`Error updating pantry ${data.id} -- ${err}`);
		}
	})
	console.log('Finished retrieving remote data');

}
*/

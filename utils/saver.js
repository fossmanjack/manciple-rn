import { useDispatch } from 'react-redux';
import * as Dav from './davModule';

export async function saveState(_Store) {
	const state = _Store.getState();
	const local = generateManifest();
	const queue = [ ...state.pantries._Pantries ];
	const syncClient = Dav.davClient(state);

	// for now let's just put all pantries into the remote store

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

	console.log('loadState', local);
}
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
	//         pantries: {
	//             _Pantries: { ... },
	//             currentPantry: int
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
		state.pantries._Pantries.forEach(ptr => {
			if(ptr.modifyDate > remoteManifest.pantries[ptr.id])
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
export function generateManifest(state) {

	const ret = {
		timestamp: state.global.lastUse,
		clientID: state.global.clientID,
		pantries: { }
	}

	state.pantries._Pantries.forEach(ptr => ret.pantries[ptr.id] = ptr.modifyDate);

	return ret;
}

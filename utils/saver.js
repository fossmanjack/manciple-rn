import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { _Store } from '../res/_Store';
import * as Dav from './davModule';

export async function saveState(dispatch) {
	const local = generateManifest();
	const [ queue, setQueue ] = useState([]);
	const syncClient = Dav.davClient();
	const state = _Store.getState();

	// for now let's just put all pantries into the remote store
	setQueue(state.pantries._Pantries);

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

export async function loadState(dispatch) {
	local = generateManifest();

	console.log('loadState', local);
	return;
}

export async function getRemoteState(dispatch) {
	const state = _Store.getState();
	const [ queue, setQueue ] = useState([]);
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
				setQueue([ ...queue, ptr.id ]);
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
	setQueue([]);

}

export function generateManifest() {
	const state = _Store.getState();

	const ret = {
		timestamp: state.global.lastUse,
		clientID: state.global.clientID,
		pantries: { }
	}

	state.pantries._Pantries.forEach(ptr => ret.pantries[ptr.id] = ptr.modifyDate);

	return ret;
}

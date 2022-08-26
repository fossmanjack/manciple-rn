export function getRemoteState() {
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
}

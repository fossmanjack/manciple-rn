import { useSelector } from 'react-redux';

export const camelize = str => str ? str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, c) => c.toUpperCase()) : false;
export const sanitize = str => str ? str.replace(/[~!@#$%^&*().,<>?_=+:;\'\"\/\-\[\]\{\}\\\|\`]/g, '') : false;
export const parseDate = i => new Date(i).toISOString().split("T")[0];
export const daysBetween = (i, j) => (j - i) / (86400000);
export const truncateString = (str, num) => str.length >= num ? str.slice(num)+' ...' : str;

export const getDebugLvl = _ => useSelector(S => S.options).debug;

export const debugMsg = (fun, params, dlvl=9) => {
	if(dlvl >= getDebugLvl()) {
		console.log("****** DEBUG ******");
		console.log(`Calling function ${fun} with:`);
		for(i in params) {
			console.log("\t", truncateString(JSON.stringify(params[i]), 60));
		}
		console.log("*******************");
	}
}


/* debugging

debug level (dlvl) is the debug value at which the message will trigger
0 is meant to be no messages, 9 is meant to be the most verbose

So:

|dlvl v | debug> | 1 | 3 | 5 | 7 | 9 |
| 1              | x | x | x | x | x |
| 3              | - | x | x | x | x |
| 5              | - | - | x | x | x |
| 7              | - | - | - | x | x |
| 9              | - | - | - | - | x |

So:
	ERROR (always show) -> dlvl 1
	WARN (usually show) -> dlvl 3
	DEBUG (show when debug is enabled) -> dlvl 5
	DBG2 (verbose debug) -> dlvl 7
	DBG3 (vverbose debug) -> dlvl 9


*/

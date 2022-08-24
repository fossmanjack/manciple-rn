return(
	{ switch view
		pantry:
		login: ?
		options
	}
)


On opening app, bring up Loading screen
- rehydrate
- check for login
	- if no login, load login/register screen
	- options accessible to set type of back-end, "none" being an option
- check for net connection
	- if active, pull remote data and update local state
	- if inactive, inform user and ask if they'd like to work locally
- load pantry screen

It wouldn't be too hard to implement a back-action stack, or I could just bring in
RN-navigation

const [ nav, setNav ] = useState('...');
const [ navHist, setNavHist ] = useState([]);

const updateNavigation = screen/pantryID => {
	setNav(screen); // can either be "options" or just a pantry ID
	setNavHist([ screen, ...navHist ]);
}

I know there's a way to monitor for backswipes under Android, so ... backswipe -> pop
navHist?


---

I think I need to just save the _Pantries array to storage every time it's updated --

1. check to see if it's been updated since last push
2. if ... and here we introduce the possibility of collision

No, I think what I really need to do is save the history chain to the remote server
in order to prevent collisions.  Each time a pantriesSlice action is dispatched, it
should push that action onto the remote stack, and then the remote stack should unshift ...

Remote stack is array of action objects:

[ 0, 1, 2, 3, 4, 5, 6 ... x ]

Either in flat JSON file or some kind of database

On load,...

See, here's the thing.  I'm pretty sure there's no easy way to append to a file
via webdav nor a way to get only part of a file.  Thus we'd have to slurp the whole
history queue and dump it all to ... yeah, no go.

Honestly I'm not sure this is feasible to do without a database of some kind, because
at least that way it would be pretty straightforward to simply log the dispatches
and play them back when a client connected, but I'm gonna soldier on.  I think the
"save the _Pantries after every dispatch" is workable, it's just a question of
keeping the file in sync with the remote.  Maybe compare hashes every so often?

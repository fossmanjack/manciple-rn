### Sync flow

1. retrieve remote manifest and load
2. Compare local lastSync to date of remote manifest
	- if remote manifest is older or doesn't exist, push data
	- otherwise, pull data

### Push flow

1. generate and push manifest
2. forEach local pantry, check if remote store exists
	- if yes, check if remote is older
		- if yes, save file to remote
		- if no, skip
	- if no, save pantry to remote
3. forEach local item, check if remote store exists
	- if yes, check if remote is older
		- if yes, save file to remote
		- if no, skip
	- if no, save item to remote
4. forEach deleted item, check if remote store exists
	- if yes, delete remote store
5. Clear delete queue
6. update lastSync timestamp
7. No need to run pull -- everything should be latest

### Pull flow

1. forEach remote pantry, check if local exists
	- if yes, check if local is older
		- if yes, pull file
		- if no, skip
	- if no, pull file
2. forEach remote item, check if local exists
	- if yes, check if local is older
		- if yes, pull file
		- if no, skip
	- if no, pull file
3. forEach deleted item in remote manifest, check if local exists
	- if yes, delete local item
4. run push()

### Build manifest

1. Timestamp: Date.now() (or whenever sync operation is run)
2. current: { id: modifyDate }
3. delete: { delete queue }

### Notes

I've just inserted a "sync" prop into the lists.  Thus we want to sync only based
on lists that actually want to sync -- items only get synced if they're listed
in a pantry that has sync enabled.  I don't want local-only stuff (birthday gifts,
etc) being a part of the background data.

### Thoughts

It kind of seems like the best thing to do is to send all dispatches to seneschal
and update the remote store in parallel.  Seneschal ... no, this would only work if
there wasn't a local store.  Ugh.  Like.  If I could figure out push notifications then
maybe but there would be collisions almost immediately, and I think I'd have to rewrite
Redux to include dispatch timestamps?  No, this would never work.  It would, and could,
only work if the back-end was the primary data source, and I want to avoid that.

So we're back to the manifest/update changes approach I guess.  Bleh.

Let's think about this.  Think about this.  With push notifications maybe?  Idk

### Tentative Update Flow

- User dispatches state change

{ action: 'slice/method', payload: [ ID, { data }] }

- Middleware catches and packages like so:

{
	timestamp: Date.now(),
	clientID,
	dispatch: action,
}

- Middleware hands this off to seneschal and waits for response
- Seneschal has been keeping track of connections from each client on back end,
and each time a connection comes in, it sends as a response all dispatches received since
last connection in array form [ [ timestamp, dispatch ], [ timestamp, dispatch ] ]
- Potentially the array also includes as its first entry the current md5sum of the data in the database?
- Middleware gets these items and dispatches them, then allows most recent dispatch to go forward
- If the local checksum doesn't match the remote checksum after processing the queue then a re-sync can be requested
- Extremely asynchronous
- Worth noting that it's only itemStore and lists that are tracked in this way

The problem with this approach is that it's inherently synchronous, and this needs to be an add-on -- if there's no
internet connection, the app still has to work.  There's also the question of who gets which updates -- if they don't
pertain to a list that's shared with the user then there's no point in sending them.

Let's get the app working and then worry about how to handle the back end.  I don't think we're going to make Honors
graduation at this rate.




- updates previous checksum, then dispatches as normal
- Seneschal receives the action and slots it into _Journal?
- Meanwhile seneschal is listening to _Journal



- Middleware sends seneschal lastUpdate, sees if there are any actions in queue
- If yes, seneschal returns actions array [ [ timestamp, action ], [ timestamp, action ] ]
- Response gets parsed and added to local dispatch queue
- Local dispatch queue processed
- Middleware sends
- Middleware catches action and forwards to seneschal
- Seneschal adds action to _Queue with timestamp
- Seneschal processes action, DB is updated
- Seneschal

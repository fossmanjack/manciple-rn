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

I've just inserted a "sync" prop into the pantries.  Thus we want to sync only based
on pantries that actually want to sync -- items only get synced if they're listed
in a pantry that has sync enabled.  I don't want local-only stuff (birthday gifts,
etc) being a part of the background data.

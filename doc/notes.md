### Underline under the list items

⎈        borderBottomColor: 'black',
        borderBottomWidth: 1,

### RNE <Switch>

https://reactnativeelements.com/docs/components/switch

### What if?

What if instead of saving the database, we store the dispatches chronologically, and play them back on each sync.  Add timestamp, allowed-users, perms to each list.  Items could show "last modified by."  Only real problem is there's no way I can think of to use Nextcloud to sync the changes.

### What if redux

So keep each list in its own file ... and each item in its own file?  Each list in its
own file, certainly.  Then a manifest.json file with list metadata:

- filename/url
- last touched
- client that did the editing (?)

Then on load, poll the manifest file and compare its last-touched attribute against
the local last-touched info.  If local is older, grab the manifest file and use it to
update the local cache.  Check each of the lists' local modify date against the
one in the manifest and upload any files that are newer.  If we could work out a way to
break out items as well we could seriously cut down on the amount of data that
has to be transferred.

### Checking back-end for updates

Can I do a useEffect and setTimeout to call a loop every five minutes or so to
scoop the manifest and update anything that's changed?  maybe

### Dependency loop

Have utils import _Store and have consts for _Dispatch and _State.

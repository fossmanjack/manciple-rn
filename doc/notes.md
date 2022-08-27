### Underline under the list items

⎈        borderBottomColor: 'black',
        borderBottomWidth: 1,

### RNE <Switch>

https://reactnativeelements.com/docs/components/switch

### What if?

What if instead of saving the database, we store the dispatches chronologically, and play them back on each sync.  Add timestamp, allowed-users, perms to each list.  Items could show "last modified by."  Only real problem is there's no way I can think of to use Nextcloud to sync the changes.

### The icon drawer update problem

Put the icon drawer into its own component and assign a useEffect to refresh the
component content based on the item object reference?

### Changes

- Master state array Inventory takes on all pantry items, saves their history and such
- Pantry list is object of key-value pairs
	//- itemID: { staple: bool, purchaseBy: int }
	- No, itemID: { qty: String, purchaseBy: int, inCart: bool }
	- Pantry.staples = [ itemID, itemID, ... ]
- List dataset is array of objects built from pantry list

for item in pantry.inventory {
	data.push({
		name:
		id:
		...
		staple:
		purchaseBy:
	})
}

We want to do this to cut down on overall data transfer -- only update items if
they've actually been edited.  The list files should be quite a bit smaller and easier
to transfer.

The manifest can therefore just be:
[
	{ id, modifyDate },
	{ id, modifyDate },
	{ id, modifyDate }
]

There's no real need to track if something is a list or an item, right?  Since
the ID will be unique across items and lists, and there's only two places to check:

if(pantry.find(id)) { ... }
else if(inventory.find(id)) { ... }
else { ... }

It's also easy enough to add "type" and "version" strings to all the objects.

So, what all do we need to update?

- pantriesSlice -> pantrySlice (only handles pantries)
- inventorySlice -> handles all changes to _Inventory
- PantryItem or PantryScreen or both


### What else?

- Add "category" to each item, so they can be searched easier

### Next Steps (2022-09-03)

- [x] Remove persistence until testing revised back-end is done
- [x] Finish InventoryScreen
- [x] Update Footer -> handleSweep
- [ ] Add in navigation object update?
- [ ] Review code flow from App down to rendering items
- [ ] Test
- [ ] Add persistence back in
- [ ] Write DAV saving
- [ ] Fix dependency loop

### Things to Implement

- [ ] Add staple -> sets "purchase by" equal to last purchase + interval
- [x] Calculate purchase interval
- [ ] Little icons for "has notes" and "changed since last visit"
- [ ] Notification that list has changed since last visit (potentially with changes?)
- [x] State persistence
- [ ] Navigation (ugh)
- [x] "Last visit" global state value, triggered whenever a list is loaded
- [ ] if listModified > lastVisit, notify
- [x] Photo carousel -- add photos, remove photos
- [x] Item edit modal
- [ ] Date picker in carousel?  What did I mean by this?  Did I mean accordion?
- [x] Pantry mode (should be easy)
- [x] When adding an item, if the item already exists, still parse quantity
- [ ] Change out all the TouchableOpacities and Buttons for Pressables (RN)
- [x] Convert accordion header to listItem
- [x] Change staple? button to RNE Switch
- [x] Figure out that "unregistered element" bug when swiping an item off the list
- [ ] Set hidden button width equal to hidden drawer width
- [ ] Move item to another list
- [x] Sort drop-down
- [x] Sort function -- Utils.sort(pantry, field, asc)
- [ ] Add little up/down arrow next to field in detail view to show current sort by
- [ ] Export pantry to JSON file


As of the evening of 2022-08-10, the date picker is basically working (except for the
cancel and ok buttons), so next I should probably implement pantry mode.

### Next steps

- [x] Implement sidebar
- [ ] Options -- sort, auto-interval
- [x] Image carousel
- [x] Persistence
- [ ] Import/export
- [x] save to webdav
- [ ] restore from webdav
- [ ] login screen/options -> just put it on options page? like joplin?
- [ ] user data screen
- [ ] adjust global props
- [ ] implement global and options reset
- [ ] finish item edit dialog
- [ ] fix calendar bug
- [ ] auto-calculate intervals
- [ ] import/export pantries
- [x] move item status icons to IconTray component
- [ ] add chips for tag management to item and pantry detail
- [ ] convert item and pantry dates to human-readable format

### A cool idea

"Collections" of items and quantities that you can add to the current list with a
single click.  Credit to my wife, and also implementing this feature would greatly
facilitate recipe book integration.

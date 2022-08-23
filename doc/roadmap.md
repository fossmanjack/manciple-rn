### Things to Implement

- [ ] Add staple -> sets "purchase by" equal to last purchase + interval
- [ ] Calculate purchase interval
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
- [ ] Figure out that "unregistered element" bug when swiping an item off the list
- [ ] Set hidden button width equal to hidden drawer width
- [ ] Move item to another list
- [ ] Sort drop-down
- [x] Sort function -- Utils.sort(pantry, field, asc)
- [ ] Add little up/down arrow next to field in detail view to show current sort by
- [ ] Export pantry to JSON file


As of the evening of 2022-08-10, the date picker is basically working (except for the
cancel and ok buttons), so next I should probably implement pantry mode.

### Next steps

- [x] Implement sidebar
- [ ] Options -- sort, auto-interval
- [ ] Image carousel
- [ ] Persistence
- [ ] Import/export
- [ ] webDAV

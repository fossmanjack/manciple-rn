### Issue 01: Unmounted React component when swiping row

Not sure why this is happening.  Potential solution -- delete the row first using
the rowMap that SwipeListView generates.  Research this further.

### Issue 02: Staple toggle doesn't create refresh icon in tray until view is reloaded

Potential solution: extraData

### Issue 03: Accordion allows more than one entry open at a time

Not sure why.  Need to fix this somehow.

### Issue 04: Icon tray not correctly positioned

This is a frustrating thing that I've been working on for hours now.

### Issue 05: Adding item "unknown variable item" or some such

Happened when I created a new list and tried to add a new item to it.  Wasn't connected
to expo at the time so I'm not sure if this is a real bug but I think I remember it
happening once before?

### Issue 06 [SOLVED]: useState and useSelector aren't updating in a timely fashion, why?

addPantry won't switch to the new pantry, editPantry won't auto-populate the input
field, uhh there's at least one other place

It's still happening even after changing the code around

The solution ended up being including a key prop in each component.

So the list item is going to be largely the same.  We might as well move the edit function into a modal or detail screen, accessed by clicking on the "edit" button which will show up with a swipe along with the sweep button.  Let's implement the basic list functionality first and then worry about multiple lists, syncing, etc.

Item:
id: camelized name, not exposed to user
name: string
quantity: string
staple: boolean
needed: boolean (false is strikethrough)
listed: boolean (false isn't displayed)
images: array of images
price: string
location: string
url:string
upc: string
purchaseBy: string
interval: int
history: array of ints
notes: string
creationDate: int (not exposed to user)
modifyDate: int (not exposed to user)

Items are stored in Pantries, which are stored in the state for now.

Main screen uses FlatList and RenderListItem to display the check button, item text, and edit and sweep buttons.  Input is at the bottom of the screen with (+)/Add item button, while toggle view, sort, and sweep buttons are in the header.


### Reading

- How to pass parameters in Drawer navigation
- I need to learn more about Redux, get clearer

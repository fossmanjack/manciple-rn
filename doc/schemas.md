### Pantry Item

{
	name: String
	id: uuid v4 (auto-generated) -- might change back to camelize
	tags: Array[String]
	type: 'item' (auto-generated)
	version: 1 (auto-generated)
	price: String
	loc: String
	url: String
	upc: String
	interval: int
	notes: String
	images: Array[String]
	history: Array[int]
	creationDate: Date.now() (auto-generated)
	modifyDate: Date.now() (auto-generated)
}

### Pantry

{
	name: String
	id: uuid v4 (auto-generated)
	tags: Array[String]
	type: 'pantry' (auto-generated)
	version: 1 (auto-generated)
	creationDate: Date.now() (auto-generated)
	modifyDate: Date.now() (auto-generated)
	inventory: Object{
		item.id: Object{
			staple: bool,
			purchaseBy: int,
			inCart: bool
		}
	}
	staples: Array[String]
}

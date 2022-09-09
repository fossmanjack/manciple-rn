App
	Loading(Component)
	Main(Component) -- contains _Xstate
		NavDrawer
			UserComponent
		Header(Component)
		Screen(Component)
			HelpScreen
			ItemStoreScreen
				ListItem
					Carousel
				Footer(Component)
			ListScreen
				ListItem
					Carousel
				Footer(Component)
			OptionsScreen
			UserScreen
		ModalDialogComponent
			ItemEditModal
			ListCreateDialog
			ListDeleteDialog
			ListDetailDialog
			ListEditDialog
			SortOrderDialog

_Store
	globalSlice
	itemStoreSlice
	listsSlice
	optionsSlice
	userSlice
	DEFAULT

utils

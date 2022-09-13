App
	Loading(Component)
	Main(Component) -- contains _Xstate
		NavDrawer
			UserComponent
		Header(Component)
		Screen(Component)
			HelpScreen
			ItemStoreScreen
				ItemDisplay(Component)
					Carousel(Component)
				Footer(Component)
			ListScreen
				ItemDisplay(Component)
					Carousel(Component)
				Footer(Component)
			OptionsScreen
			UserScreen
			---
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

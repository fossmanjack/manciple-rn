// ModalDialogComponent.js
// Renders all of the modals and dialogs used in the app
// Visibility of each component is controlled by Xstate flags

import { View } from 'react-native';

import ListCreateDialog from '../dialogs/ListCreateDialog';
import ListDeleteDialog from '../dialogs/ListDeleteDialog';
import ListDetailDialog from '../dialogs/ListDetailDialog';
import ListEditDialog from '../dialogs/ListEditDialog';
import ItemEditModal from '../dialogs/ItemEditModal';
import SortOrderDialog from '../dialogs/SortOrderDialog';
import TagEditDialog from '../dialogs/TagEditDialog';

// Xstate
import { useXstate } from '../res/Xstate';

export default function ModalDialogComponent() {
	const {
		showItemEdit,
		showListCreate,
		showListDelete,
		showListDetail,
		showListEdit,
		showSortOrder,
		showTagEdit
	} = useXstate();

	return (
		<View>
			<ItemEditModal key={`itemEditModal-${showItemEdit}`} />
			<ListCreateDialog key={`listCreateDialog-${showListCreate}`} />
			<ListDeleteDialog key={`listDeleteDialog-${showListDelete}`} />
			<ListDetailDialog key={`listDetailDialog-${showListDetail}`}/>
			<ListEditDialog key={`listEditDialog-${showListEdit}`} />
			<SortOrderDialog key={`sortOrderDialog-${showSortOrder}`} />
			<TagEditDialog key={`tagEditDialog-${showTagEdit}`} />
		</View>
	);
}

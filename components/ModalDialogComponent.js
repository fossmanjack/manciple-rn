import ListCreateDialog from '../dialogs/ListCreateDialog';
import ListDeleteDialog from '../dialogs/ListDeleteDialog';
import ListDetailDialog from '../dialogs/ListDetailDialog';
import ListEditDialog from '../dialogs/ListEditDialog';
import ItemEditModal from '../dialogs/ItemEditModal';
import SortOrderDialog from '../dialogs/SortOrderDialog';

// Xstate
import { useXstate } from '../res/Xstate';

export default function ModalDialogComponent() {
	const {
		showItemEdit,
		showListCreate,
		showListDelete,
		showListDetail,
		showListEdit,
		showSortOrder
	} = useXstate();

	return (
		<>
			<ItemEditModal key={`itemEditModal-${showItemEdit}`} />
			<ListCreateDialog key={`listCreateDialog-${showListCreate}`} />
			<ListDeleteDialog key={`listDeleteDialog-${showListDelete}`} />
			<ListDetailDialog key={`listDetailDialog-${showListDetail}`}/>
			<ListEditDialog key={`listEditDialog-${showListEdit}`} />
			<SortOrderDialog key={`sortOrderDialog-${showSortOrder}`} />
		</>
	);
}

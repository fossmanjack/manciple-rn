import ListCreateDialog from '../dialogs/ListCreateDialog';
import ListDeleteDialog from '../dialogs/ListDeleteDialog';
import ListDetailDialog from '../dialogs/ListDetailDialog';
import ListEditDialog from '../dialogs/ListEditDialog';
import ItemEditModal from '../dialogs/ItemEditModal';
import SortOrderDialog from '../dialogs/SortOrderDialog';

export default function ModalDialogComponent() {

	return (
		<>
			<ListCreateDialog />
			<ListDetailDialog />
			<ListEditDialog />
			<ListDeleteDialog />
			<ItemEditModal />
			<SortOrderDialog />
		</>
	);
}

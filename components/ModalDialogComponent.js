import ListCreateDialog from '../dialogs/ListCreateDialog';
import ListDeleteDialog from '../dialogs/ListDeleteDialog';
import ListDetailDialog from '../dialogs/ListDetailDialog';
import ListEditDialog from '../dialogs/ListEditDialog';
import ItemEditModal from '../dialogs/ItemEditModal';
import SortOrderDialog from '../dialogs/SortOrderDialog';

export default function ModalDialogComponent({ _Xstate }) {

	return (
		<>
			<ListCreateDialog
				_Xstate={_Xstate}
			/>
			<ListDetailDialog
				_Xstate={_Xstate}
				key={`${_Xstate.listToEdit}-detail`}
			/>
			<ListEditDialog
				_Xstate={_Xstate}
				key={`${_Xstate.listToEdit}-edit`}
			/>
			<ListDeleteDialog
				_Xstate={_Xstate}
				key={`${_Xstate.listToEdit}-delete`}
			/>
			<ItemEditModal
				_Xstate={_Xstate}
				key={_Xstate.itemToEdit}
			/>
			<SortOrderDialog
				_Xstate={_Xstate}
			/>
		</>
	);
}

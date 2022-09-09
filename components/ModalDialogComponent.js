import PantryCreateDialog from '../components/PantryCreateDialog';
import PantryDeleteDialog from '../components/PantryDeleteDialog';
import PantryDetailDialog from '../components/PantryDetailDialog';
import PantryEditDialog from '../components/PantryEditDialog';
import ItemEditModal from '../components/ItemEditModal';
import SortOrderDialog from '../components/SortOrderDialog';

export default function ModalDialogComponent(props) {
	const { _Xstate, setXstate } = props;

	return (
		<>
			<PantryCreateDialog
				_Xstate={_Xstate}
				setXstate={setXstate}
			/>
			<PantryDetailDialog
				_Xstate={_Xstate}
				setXstate={setXstate}
				pantryID={pantryToEdit}
				handleEditPantry={_ => {
					setShowPantryDetailDialog(false);
					setShowPantryEditDialog(true);
				}}
				key={`${pantryToEdit}-detail`}
			/>
			<PantryEditDialog
				_Xstate={_Xstate}
				setXstate={setXstate}
				pantryID={pantryToEdit}
				setPantryID={setPantryToEdit}
				key={`${pantryToEdit}-edit`}
			/>
			<PantryDeleteDialog
				_Xstate={_Xstate}
				setXstate={setXstate}
				pantryID={pantryToEdit}
				setPantryID={setPantryToEdit}
				key={`${pantryToEdit}-delete`}
			/>
			<ItemEditModal
				_Xstate={_Xstate}
				setXstate={setXstate}
				key={_Xstate.itemToEdit}
			/>
			<SortOrderDialog
				_Xstate={_Xstate}
				setXstate={setXstate}
			/>
		</>
	);
}

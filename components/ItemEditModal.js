// Takes in an inventory object and returns edited inventory object
// What if this is created as a ref in parent object
// editItemModal = useRef(...)
// Then handleEdit sets the ref to a new one that grabs the current object to edit
// That might work?  Otherwise we'll probably have to turn this into a React component
// or something
import { useState, useEffect } from 'react';
import {
	Modal,
	Text,
	TextInput,
	View
} from 'react-native';
import {
	Button,
	Input
} from 'react-native-elements';
import * as Pantry from '../slices/listsSlice';
import * as Inv from '../slices/itemStoreSlice';
import * as Utils from '../utils/utils';

export default function EditItemModal(props) {
	const { item, visible, setVisible, dispatch } = props;
	// updatedItem holds the props that have been changed
	// refItem populates the fields and is kept in sync with updatedItem
	const [ updatedItem, setUpdatedItem ] = useState({});
	const [ refItem, setRefItem ] = useState({ ...item });

	// tracking this separately because it's handled separately
	// staple and purchaseBy are handled elsewhere
	const [ updatedQty, setUpdatedQty ] = useState(item.qty);

	console.log('EditItemModal', refItem.id, updatedItem);

	const handleCommit = _ => {
/*
		dispatch(Pantry.updateItem({
			updatedItem: { ...updatedItem, id: Utils.camelize(updatedItem.name) },
			itemID: item.id
		}));
*/
		// In order to ensure the pantry data is ready to go before the PantryScreen
		// re-render triggers, handle the pantry data first

		// if the itemID changes then the pantry is going to contain a useless ref
		// so if it's changed we have to remove all

		if(item.id === refItem.id)
			dispatch(Pantry.updateItemInPantry([ item.id, { qty: updatedQty } ]));
		else {
			item.parents.forEach(id => {
				// first grab and hold the metadata
				const tempData = _Lists.find(ptr => ptr.id === id) ? {
					...Pantries[_Lists.indexOf(_Lists.find(ptr => ptr.id === id))].inventory[item.id]
				} : false;
				// now we can remove the stale ref
				dispatch(Pantry.deleteItemFromPantry([ item.id, id ]));
				// if there was metadata to be stored, push the metadata under the
				// new itemID
				if(tempData)
					dispatch(Pantry.addItemToPantry([ refItem.id, tempData, id ]));
			});
		}

		// now that the pantry updates have been dispatched, push the item update to
		// inventory.  The itemIDs should then match when PantryScreen registers the
		// _ItemStore update via useEffect
		dispatch(Inv.updateItem([
			item.id,
			{ ...updatedItem, id: Utils.sanitize(Utils.camelize(updatedItem.name.trim())) }
		]));
		setVisible(!visible);
	}

	const setProp = (field, val) => {
		console.log('setProp', field, val);
		field === 'qty' && setUpdatedQty(val);
		field === 'name' && setUpdatedItem({
			...updatedItem, id: Utils.sanitize(Utils.camelize(val.trim()))
		});
		setUpdatedItem({ ...updatedItem, [field]: val.trim() });
	}

	// subscribe to updatedItem to keep it synced with refItem
	useEffect(_ => setRefItem({ ...refItem, ...updatedItem }), [ updatedItem ]);

	return (
		<Modal
			transparent={false}
			visible={visible}
			onRequestClose={_ => setVisible(!visible)}
		>
			<Text>
				Name
			</Text>
			<Input
				placeholder='Item name'
				value={refItem.name}
				onChangeText={t => setProp('name', t)}
			/>
			<View style={{
				flexDirection: 'row'
			}}>
				<Button
					title='Commit'
					onPress={_ => handleCommit(updatedItem)}
				/>
				<Button
					title='Cancel'
					onPress={_ => setVisible(!visible)}
				/>
			</View>
		</Modal>
	);
}

/*

			<Modal
				transparent={false}
				visible={showModal}
				onRequestClose={_ => setShowModal(!showModal)}
			>
				<Text>
					Name
				</Text>
				<Input
					placeholder='Item name'
					value={updatedName}
					onChangeText={t => setUpdatedName(t)}
				/>
				<Text>
					Quantity
				</Text>
				<Input
					placeholder='Quantity'
					value={updatedQty}
					onChangeText={t => setUpdatedQty(t)}
				/>
				<Text>
					Price
				</Text>
				<Input
					placeholder='Price'
					value={updatedPrice}
					onChangeText={t => setUpdatedPrice(t)}
				/>
				<Text>
					Location
				</Text>
				<Input
					placeholder='Location'
					value={updatedLoc}
					onChangeText={t => setUpdatedLoc(t)}
				/>
				<Text>
					URL
				</Text>
				<Input
					placeholder='URL'
					value={updatedURL}
					onChangeText={t => setUpdatedURL(t)}
				/>
				<Text>
					UPC
				</Text>
				<Input
					placeholder='UPC'
					value={updatedUPC}
					onChangeText={t => setUpdatedUPC(t)}
				/>
				<Text>
					Interval
				</Text>
				<Input
					placeholder='Purchase interval'
					value={updatedInterval}
					keyboardType='number-pad'
					onChangeText={t => setUpdatedInterval(t)}
				/>
				<Text>
					Notes
				</Text>
				<Input
					placeholder='Notes'
					value={updatedNotes}
					onChangeText={t => setUpdatedNotes(t)}
				/>
				<Button
					title='Commit'
					onPress={_ => handleEditItemCommit()}
				/>
				<Button
					title='Cancel'
					onPress={_ => resetState()}
				/>
			</Modal>


*/

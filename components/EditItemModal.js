// Takes in an inventory object and returns edited inventory object
// What if this is created as a ref in parent object
// editItemModal = useRef(...)
// Then handleEdit sets the ref to a new one that grabs the current object to edit
// That might work?  Otherwise we'll probably have to turn this into a React component
// or something
import { useState } from 'react';
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
import * as Pantry from '../slices/pantriesSlice';
import * as Utils from '../utils/utils';

export default function EditItemModal(props) {
	const { item, visible, setVisible, dispatch } = props;
	const [ updatedItem, setUpdatedItem ] = useState(item);

	const handleCommit = _ => {
		dispatch(Pantry.updateItem({
			updatedItem: { ...updatedItem, id: Utils.camelize(updatedItem.name) },
			itemID: item.id
		}));
		setVisible(!visible);
	}

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
				value={updatedItem.name}
				onChangeText={t => setUpdatedItem({ ...updatedItem, name: t })}
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

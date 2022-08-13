import {
	Alert,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { SwipeRow } from 'react-native-swipe-list-view';
import { _Styles } from '../res/_Styles';
import * as Pantry from '../slices/pantriesSlice';
import * as Global from '../slices/globalSlice';
import * as Utils from '../utils/utils';

export default function renderPantryViewItem(props) {
	console.log('renderPantryViewItem', props);
	const { item, dispatch } = props;

	const handleAdd = item => {
		console.log("handleCheck called with item", item);
		dispatch(Pantry.toggleListed(item.id));
	}

	const handleDelete = item => {
		console.log('handleDelete called with item', item);
		dispatch(Pantry.deleteItem(item.id));
	}

	const handleEdit = item => {
		console.log('handleEdit called with item', item);
	}

	return (
		<SwipeRow rightOpenValue={-100}>
			<View style={_Styles.itemSwipeView}>
				<TouchableOpacity
					style={{ backgroundColor: 'green', height: '100%' }}
					onPress={_ => handleEdit(item)}
				>
					<Icon
						name='pencil'
						type='font-awesome'
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={{ backgroundColor: 'yellow', height: '100%' }}
					onPress={_ => Alert.alert(
						'Delete item?',
						`Are you sure you wish to delete the item ${item.name} from
						your pantry?  Your purchase history for this item will be lost!`,
						[
							{
								text: 'Cancel',
								style: 'cancel'
							},
							{
								text: 'OK',
								onPress: _ => handleDelete(item)
							}
						],
						{ cancelable: false }
					)}
				>
					<Icon
						name='close'
						type='font-awesome'
					/>
				</TouchableOpacity>
			</View>
			<View style={_Styles.viewList}>
				<TouchableOpacity
					style={{ flex: 1 }}
					onPress={_ => handleAdd(item)}
				>
					<View>
						<Icon
							name={item.listed ? 'minus' : 'plus'}
							type='font-awesome'
						/>
					</View>
				</TouchableOpacity>
				<View style={{ flex: 8 }}>
					<Text
						style={_Styles.textItemName}
					>
						{item.name}
					</Text>
				</View>
				<View style={{ flex: 3 }}>
					<Text
						style={_Styles.textItemQtyLabel}
					>
						Qty:
					</Text>
					<Text
						style={_Styles.textItemQty}
					>
						{item.qty}
					</Text>
				</View>
			</View>
		</SwipeRow>
	);

}


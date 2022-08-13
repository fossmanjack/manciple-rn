import {
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { SwipeRow } from 'react-native-swipe-list-view';
import { _Styles } from '../res/_Styles';
import * as Pantry from '../slices/pantriesSlice';
import * as Global from '../slices/globalSlice';
import * as Utils from '../utils/utils';

export default function renderListViewItem(props) {
	console.log('renderListViewItem', props);
	const { item, dispatch } = props.item;

	const handleCheck = item => {
		console.log("handleCheck called with item", item);

		dispatch(Pantry.toggleNeeded(item.id));
	}

	const handleSweep = item => {
		console.log('handleSweep called with item', item);

		dispatch(Pantry.toggleListed(item.id));
	}

//	const renderPantryItem = ({ item }) => {

	return (
			<View style={_Styles.viewList}>
				<TouchableOpacity
					style={{ flex: 1 }}
					onPress={_ => handleCheck(item)}
				>
					<View>
						<Icon
							name={item.needed ? 'square-o' : 'check-square-o'}
							type='font-awesome'
						/>
					</View>
				</TouchableOpacity>
				<View style={{ flex: 8, flexDirection: 'row' }}>
					<Text
						style={item.needed ? _Styles.textItemName : _Styles.textItemNameChecked}
					>
						{item.name}
					</Text>
					{ item.staple && <Icon
						name='refresh'
						type='font-awesome'
						style={{ padding: 3, fontSize: 12, color: 'lightgray' }}
					/> }
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
	);

}


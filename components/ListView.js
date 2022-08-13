import {
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import { _Styles } from '../res/_Styles';
import * as Pantry from '../slices/pantriesSlice';
import * as Global from '../slices/globalSlice';
import * as Utils from '../utils/utils';

export default function ListView(props) {
	console.log('ListView', props);

	const dispatch = useDispatch();
	const { _Pantries, currentPantry } = useSelector(S => S.pantries);

	const handleCheck = itemID => {
		console.log("handleCheck called with item", itemID);

		dispatch(Pantry.toggleNeeded(itemID));
	};

	const handleSweep = rowKey => {
		console.log('**************');
		console.log('handleSweep called with rowKey', rowKey);
		console.log('**************');

		dispatch(Pantry.toggleListed(rowKey));
	};

	const handleToggleStaple = itemID => {
		console.log('handleToggleStaple called with item', itemID);

		dispatch(Pantry.toggleStaple(itemID));
	};

	return (
		<SwipeListView
			data={
				_Pantries[currentPantry].inventory.filter(i => i.listed).map(item => ({
					item,
					key: item.id,
					dispatch
				}))
			}
			renderItem={(data, rowKey) => {
				console.log('************');
				console.log('renderItem: ');
				console.log('\tdata:', Utils.truncateString(''+data, 60));
				console.log('\trowKey:', Utils.truncateString(''+rowKey, 60));
				console.log('************');
				//const { item: datum } = data;
				//const { item } = datum;
				const { item: { item } } = data;
				return (
				<View style={_Styles.viewList}>
					<TouchableOpacity
						style={{ flex: 1 }}
						onPress={_ => handleCheck(item.id)}
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
							style={{ padding: 3, size: 12, color: 'lightgray' }}
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
			)
			}}
			renderHiddenItem={(data, rowKey) => {
				const { item: { item }} = data;
				return (
				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
					<TouchableOpacity
					>
						<Icon
							name='pencil'
							type='font-awesome'
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={_ => handleToggleStaple(item.id)}
					>
						<Icon
							name={item.staple ? 'toggle-on' : 'toggle-off'}
							type='font-awesome'
						/>
					</TouchableOpacity>
				</View>
			)
			}}
			rightOpenValue={-100}
			leftActivationValue={75}
			leftActionValue={500}
			onLeftAction={handleSweep}
		/>
	);
}


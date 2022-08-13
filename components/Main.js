import {
	Button,
	FlatList,
	ScrollView,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { SwipeRow, SwipeListView } from 'react-native-swipe-list-view';
import { _Styles } from '../res/_Styles';
import * as Global from '../slices/globalSlice';
import * as Pantry from '../slices/pantriesSlice';
import * as Options from '../slices/optionsSlice';
import * as Utils from '../utils/utils';
import renderListViewItem from './ListViewItem';
import renderPantryViewItem from './PantryViewItem';
import ListView from './ListView';

export default function Main() {
	const { _Pantries, currentPantry } = useSelector(S => S.pantries);
	const { mode } = useSelector(S => S.global);
	const dispatch = useDispatch();

	const handleSweep = rowKey => {
		console.log('handleSweep called with item', rowKey);

		dispatch(Pantry.toggleListed(rowKey));
	}

	const listData = _Pantries[currentPantry].inventory.filter(i => mode === 'list' ? i.listed : i).map(item => ({
		item,
		key: item.id,
		dispatch
	}));

	return mode === 'list'
		? <ListView />
		: <View />;

	/*
	return (
		<SwipeListView
			data={listData}
			key={i => i.item.id}
			renderItem={mode === 'list' ? renderListViewItem : renderPantryViewItem}
			renderHiddenItem={(data, rowMap) => (
				<View style={_Styles.itemSwipeView}>
					<TouchableOpacity
					>
						<Icon
							name='pencil'
							type='font-awesome'
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={handleSweep}
					>
						<Icon
							name='broom'
							type='font-awesome-5'
						/>
					</TouchableOpacity>
				</View>
			)}
			rightOpenValue={-100}
			leftActivationValue={75}
			leftActionValue={500}
			onLeftAction={handleSweep}
		/>
	);
	*/
}

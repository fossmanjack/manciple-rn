import {
	Button,
	FlatList,
	Text,
	View
} from 'react-native';
import { useSelector } from 'react-redux';
//import { SwipeRow } from 'react-native-swipe-list-view';
import { _Styles } from '../res/_Styles';

export default function PantryScreen(props) {
	const pantry = props.pantry;
	const inv = pantry.inventory;
	console.log('PantryScreen: inv', inv);

	const renderPantryItem = ({ item }) => {
		console.log('Rendering item:', item);

		return (
			//<SwipeRow rightOpenValue={-100}>
			<>
				<View>
					// swipe buttons go here
				</View>
				<View> // main line view
					<Button
						onPress={_ => item.needed = !item.needed}
						style={item.needed ? _Styles.checkboxEmpty : _Styles.checkboxChecked}
					/>
					<Text
						onPress={_ => navigation.navigate('PantryItemDetail', { item }) }
						style={item.needed ? _Styles.itemNeeded : _Styles.itemBought}
					>
						{item.name}
					</Text>
					<Text style={_Styles.qtyText}>
						Qty: 
					</Text>
					<Text>
						{item.qty}
					</Text>
				</View>
			</>
			//</SwipeRow>
		);
	}

	return pantry ? (
		<FlatList
			data={inv}
			renderItem={renderPantryItem}
			keyExtractor={ob => ob.id}
		/>
	) : <View />;
}


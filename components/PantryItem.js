// Builds the accordion entry for each pantry item
// Called from ListView and PantryView
// Calls ListViewHiddenButtons and PantryViewHiddenButtons
// Expects the pantry item object and dispatch functions as props
import {
	Button,
	Image,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useState } from 'react';
import {
	Collapse,
	CollapseHeader,
	CollapseBody
} from 'accordion-collapse-react-native';
import { useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { _Styles } from '../res/_Styles';
import { _DefaultImage } from '../res/_DefaultImage';
import * as Utils from '../utils/utils';

// { Picker } for implementing date selection


export default function PantryItem({ item, exports }) {
	const { mode } = useSelector(S => S.global);
	const [ showCalendar, setShowCalendar ] = useState(false);
	const [ pickDate, setPickDate ] = useState(new Date(Date.now()));
	const {
		handleCheckBox,
		handleDateChange
	} = exports;

	const onCalendarChange = (event, selectedDate) => {
		//setUpdatedPurchaseBy(selectedDate);
		console.log('called onCalendarChange with event', event, 'selectedDate', selectedDate);
		setPickDate(selectedDate);
		handleDateChange(item, selectedDate);
		setShowCalendar(!showCalendar);
	}

	const ListViewCheckBox = _ => {
		return (
			<TouchableOpacity
				style={{ flex: 1 }}
				onPress={_ => handleCheckBox(item.id)}
			>
				<View>
					<Icon
						name={item.needed ? 'square-o' : 'check-square-o'}
						type='font-awesome'
					/>
				</View>
			</TouchableOpacity>
		);
	}

	const PantryViewCheckBox = _ => {
		return (
			<TouchableOpacity
				style={{ flex: 1 }}
				onPress={_ => handleCheckBox(item.id)}
			>
				<View>
					<Icon
						name={item.needed ? 'minus' : 'plus'}
						type='font-awesome'
					/>
				</View>
			</TouchableOpacity>
		);
	}
// Doing it without ListView

	return (
		<Collapse>
			<CollapseHeader>
				<View style={_Styles.viewList}>
					{ mode === 'list' ? <ListViewCheckBox /> : <PantryViewCheckBox /> }
					<View style={{ flex: 8, flexDirection: 'row' }}>
						<Text
							style={mode === 'list' ? item.needed ? _Styles.textItemName : _Styles.textItemNameChecked : _Styles.textItemName}
						>
							{item.name}
						</Text>
						{ item.staple && <Icon
							name='refresh'
							type='font-awesome'
							style={{ padding: 3, size: 12, color: 'lightgray' }}
						/> }
					</View>
					<View style={{ flex: 3, flexDirection: 'row' }}>
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
			</CollapseHeader>
			<CollapseBody>
				<View>
					<Image
						source={{ uri: _DefaultImage }}
						style={{
							width: '70%',
							height: 'auto'
						}}
					/>
				</View>
				<View style={{ flexDirection: 'row' }}>
					<View style={{ flex: 3 }}>
						<Text style={_Styles.textItemDetailLabel}>
							Price:
						</Text>
						<Text style={_Styles.textItemDetailText}>
							{item.price || '-'}
						</Text>
					</View>
					<View style={{ flex: 3 }}>
						<Text style={_Styles.textItemDetailLabel}>
							Location:
						</Text>
						<Text style={_Styles.textItemDetailText}>
							{item.loc || '-'}
						</Text>
					</View>
				</View>

				<View style={{ flexDirection: 'row' }}>
					<View style={{ flex: 3 }}>
						<Text style={_Styles.textItemDetailLabel}>
							Last purchased:
						</Text>
						<Text style={_Styles.textItemDetailText}>
							{item.history[0] ? Utils.parseDate(item.history[0]) : '-'}
						</Text>
					</View>
					<View style={{ flex: 3 }}>
						<Text style={_Styles.textItemDetailLabel}>
							Purchase by:
						</Text>
						<Button
							onPress={_ => setShowCalendar(!showCalendar)}
							title={item.purchaseBy
								? Utils.parseDate(item.purchaseBy)
								: '-'
							}
						/>
						{ showCalendar && (
							<DateTimePicker
								value={pickDate}
								mode='date'
								display='calendar'
								onChange={onCalendarChange}
								minimumDate={Date.now()}
							/>
						)}
					</View>
				</View>
				<View>
					<Text style={_Styles.textItemDetailLabel}>
						URL:
					</Text>
					<Text style={_Styles.textItemDetailText}>
						{item.url || '-'}
					</Text>
				</View>
				<View>
					<Text style={_Styles.textItemDetailLabel}>
						UPC:
					</Text>
					<Text style={_Styles.textItemDetailText}>
						{item.upc || '-'}
					</Text>
				</View>
				<View>
					<Text style={_Styles.textItemDetailLabel}>
						Notes
					</Text>
				</View>
				<View>
					<Text style={_Styles.textItemDetailText}>
						{item.notes || '...'}
					</Text>
				</View>
			</CollapseBody>
		</Collapse>
	);
// end doing it without listview

// Doing it with listview
/*

	return (
		<Collapse>
			<CollapseHeader>
				<View style={{ flexAlign: 'row' }}>
					{ mode === 'list' ? <ListViewCheckBox /> : <PantryViewCheckBox /> }
					<ListItem>
						<ListItem.Content>
							<ListItem.Title
								style={mode === 'list'
									? item.needed
										? _Styles.textItemName
										: _Styles.textItemNameChecked
									: _Styles.textItemName
								}
							>
								{item.name}
							</ListItem.Title>
							<ListItem.Subtitle>
								<View style={{ flex: 8, flexAlign: 'row' }}>
									<Text style={_Styles.textItemQtyLabel}>
										Qty:
									</Text>
									<Text style={_Styles.textItemQty}>
										{item.qty}
									</Text>
								</View>
								<View style={{ flex: 4 }}>
									{ item.staple && <Icon
										name='refresh'
										type='font-awesome'
										style={{ padding: 3, size: 12, color: 'lightgray' }}
									/>
									}
								</View>
							</ListItem.Subtitle>
						</ListItem.Content>
					</ListItem>
				</View>
			</CollapseHeader>
			<CollapseBody>
				<View>
					<Image
						source={{ uri: _DefaultImage }}
						style={{
							width: '70%',
							height: 'auto'
						}}
					/>
				</View>
				<View style={{ flexDirection: 'row' }}>
					<View style={{ flex: 3 }}>
						<Text style={_Styles.textItemDetailLabel}>
							Price:
						</Text>
						<Text style={_Styles.textItemDetailText}>
							{item.price || '-'}
						</Text>
					</View>
					<View style={{ flex: 3 }}>
						<Text style={_Styles.textItemDetailLabel}>
							Location:
						</Text>
						<Text style={_Styles.textItemDetailText}>
							{item.loc || '-'}
						</Text>
					</View>
				</View>

				<View style={{ flexDirection: 'row' }}>
					<View style={{ flex: 3 }}>
						<Text style={_Styles.textItemDetailLabel}>
							Last purchased:
						</Text>
						<Text style={_Styles.textItemDetailText}>
							{item.history[0] ? Utils.parseDate(item.history[0]) : '-'}
						</Text>
					</View>
					<View style={{ flex: 3 }}>
						<Text style={_Styles.textItemDetailLabel}>
							Purchase by:
						</Text>
						<Button
							onPress={_ => setShowCalendar(!showCalendar)}
							title={item.purchaseBy
								? Utils.parseDate(item.purchaseBy)
								: '-'
							}
						/>
						{ showCalendar && (
							<DateTimePicker
								value={pickDate}
								mode='date'
								display='calendar'
								onChange={onCalendarChange}
								minimumDate={Date.now()}
							/>
						)}
					</View>
				</View>
				<View>
					<Text style={_Styles.textItemDetailLabel}>
						URL:
					</Text>
					<Text style={_Styles.textItemDetailText}>
						{item.url || '-'}
					</Text>
				</View>
				<View>
					<Text style={_Styles.textItemDetailLabel}>
						UPC:
					</Text>
					<Text style={_Styles.textItemDetailText}>
						{item.upc || '-'}
					</Text>
				</View>
				<View>
					<Text style={_Styles.textItemDetailLabel}>
						Notes
					</Text>
				</View>
				<View>
					<Text style={_Styles.textItemDetailText}>
						{item.notes || '...'}
					</Text>
				</View>
			</CollapseBody>
		</Collapse>
	);

*/

// Using SwipeRow instead of the list container
/*
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
*/

}

/*

ListViewCheckBox:
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
*/

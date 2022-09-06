// Builds the accordion entry for each pantry item
// Called from ListView and PantryView
// Calls ListViewHiddenButtons and PantryViewHiddenButtons
// Expects the pantry item object and dispatch functions as props
import {
	Image,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import {
	CheckBox,
	Icon,
	ListItem,
	Button
} from 'react-native-elements';
import { useState } from 'react';
import {
	Collapse,
	CollapseHeader,
	CollapseBody
} from 'accordion-collapse-react-native';
import { useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import Carousel from './Carousel';
import { _Styles } from '../res/_Styles';
import { _DefaultImage } from '../res/_DefaultImage';
import * as Utils from '../utils/utils';

// { Picker } for implementing date selection


export default function PantryItem({ item, exports }) {
	const [ showCalendar, setShowCalendar ] = useState(false);
	const [ currentImageIndex, setCurrentImageIndex ] = useState(0);
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

	const IconDrawer = item => {
		return (
			<View style={{
				flex: 4,
				flexDirection: 'row-reverse',
				alignItems: 'flex-end',
				alignSelf: 'flex-end',
				justifyContent: 'center',
			}}>
				{
					item.staple && <Icon
						name='refresh'
						type='font-awesome'
						size={20}
						color='gray'
						style={{
							marginLeft: 5
						}}
					/>
				}
				{
					(item.notes !== '') && <Icon
						name='note-alert-outline'
						type='material-community'
						size={20}
						color='gray'
						style={{
							marginLeft: 5
						}}
					/>
				}
				{
					(item.purchaseBy !== 0 && item.purchaseBy < Date.now()) && <Icon
						name='calendar-alert'
						type='material-community'
						size={20}
						color='red'
						style={{
							marginLeft: 5
						}}
					/>
				}
			</View>
		);
	}
/*
	const PantryViewCheckBox = _ => {
		return (
			<Button
				type='clear'
				icon={_ => (
					<Icon
						name={item.listed ? 'minus' : 'plus'}
						type='font-awesome'
						size={32}
						color={item.listed ? 'red' : 'green'}
					/>
				)}
				onPress={_ => handleCheckBox(item.id)}
			/>
		);
	}
*/

// Doing it with listview

	return (
		<Collapse style={{
			backgroundColor: 'white',
			borderBottomColor: 'lightgray',
			borderBottomWidth: 1,
		}}>
			<CollapseHeader>
				<ListItem>
					<Button
						type='clear'
						icon={_ => (
							<Icon
								name={item.inCart ? 'check-square-o' : 'square-o'}
								type='font-awesome'
								size={32}
							/>
						)}
						onPress={_ => handleCheckBox(item.id)}
					/>
					<ListItem.Content>
						<ListItem.Title
							style={item.inCart
								? _Styles.textItemNameChecked
								: _Styles.textItemName
							}
						>
							{item.name}
						</ListItem.Title>
						<ListItem.Subtitle style={{
							flexDirection: 'row',
							width: '100%',
						}}>
							<View style={{
								flex: 8,
								flexDirection: 'row',
								alignSelf: 'stretch'
							}}>
								<Text style={_Styles.textItemQtyLabel}>
									Qty:
								</Text>
								<Text style={_Styles.textItemQty}>
									{item.qty}
								</Text>
							</View>
							<IconDrawer item={item} />
						</ListItem.Subtitle>
					</ListItem.Content>
				</ListItem>
			</CollapseHeader>
			<CollapseBody style={{
				padding: 20
			}}>
				<Carousel
					item={item}
					width={200}
					height={200}
					key={item}
				/>
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


}

/* Everything that follows is archival -- earlier versions and attempts

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

// Doing it without ListView
/*
	return (
		<Collapse>
			<CollapseHeader style={{ backgroundColor: 'white' }}>
				<View style={_Styles.viewList }>
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
							width: 200
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
// end doing it without listview
//


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

	const ListViewCheckBox = _ => {
		return (
			<CheckBox
				center
				checkedIcon='check-square-o'
				uncheckedIcon='square-o'
				type='font-awesome'
				checked={!item.needed}
				onPress={_ => handleCheckBox(item.id)}
			/>
		)
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
*/

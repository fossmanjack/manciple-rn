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


export default function InventoryItem({ item, exports }) {
	const [ showCalendar, setShowCalendar ] = useState(false);
	const [ currentImageIndex, setCurrentImageIndex ] = useState(0);
	const [ pickDate, setPickDate ] = useState(new Date(Date.now()));
	const {
		handleCheckBox,
		handleDateChange
	} = exports;
	const { _Pantries, currentPantry } = useSelector(S => S.pantries);
	const { _Inventory } = useSelector(S => S.inventory);

	const onCalendarChange = (event, selectedDate) => {
		console.log('called onCalendarChange with event', event, 'selectedDate', selectedDate);
		setPickDate(selectedDate);
		handleDateChange(item, selectedDate);
		setShowCalendar(!showCalendar);
	}

	const CheckBox = _ => {
		const listed = Object.keys(_Pantries[currentPantry].inventory).includes(item.id);

		return (
			<Button
				type='clear'
				icon={_ => (
					<Icon
						name={listed ? 'minus' : 'plus'}
						color={listed ? 'red' : 'green'}
						type='font-awesome'
						size={32}
					/>
				)}
				onPress={_ => handleCheckBox(item.id)}
			/>
		);
	}
/*
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
					<CheckBox />
					<ListItem.Content>
						<ListItem.Title
							style={_Styles.textItemName}
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
									Default Qty:
								</Text>
								<Text style={_Styles.textItemQty}>
									{item.defaultQty}
								</Text>
							</View>
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
							Interval:
						</Text>
						<Text style={_Styles.textItemDetailText}>
							{item.interval || '-'}
						</Text>
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

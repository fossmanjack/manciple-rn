// ItemDisplayComponent.js
// Builds the accordion entry for each list item
// Called from ItemStoreScreen and CurrentListScreen

// React, RN, RNE
import { useState, useRef } from 'react';
import {
	Image,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import {
	CheckBox,
	Chip,
	Icon,
	ListItem,
	Button
} from 'react-native-elements';
import { useSelector } from 'react-redux';

// Community
import {
	Collapse,
	CollapseHeader,
	CollapseBody
} from 'accordion-collapse-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// Local
import Carousel from '../components/CarouselComponent';
import * as Lists from '../slices/listsSlice';
import * as Istore from '../slices/itemStoreSlice';
import { _Styles } from '../res/_Styles';
import * as Utils from '../utils/utils';
import { useXstate } from '../res/Xstate';

export default function ItemDisplay({ item }) {
	const { _Lists, currentList } = useSelector(S => S.lists);
	const { _ItemStore, _History } = useSelector(S => S.itemStore);
	const { uuid } = useSelector(S => S.user);
	const [ showCalendar, setShowCalendar ] = useState(false);
	const [ currentImageIndex, setCurrentImageIndex ] = useState(0);
	const [ pickDate, setPickDate ] = useState(new Date(Date.now()));
	const { currentScreen, setXstate, dispatch, showTagEdit } = useXstate();
/*
	const {
		handleCheckBox,
		handleDateChange
	} = exports;
*/
	const global = currentScreen === 'itemStore';

	const handleCheckBox = itemID => {
		console.log('handleCheckBox called with item', itemID);
		if(global) {
			// add item to currentList if not in it, or remove it if it is
			const { inventory } = _Lists[currentList];
			const refItem = _ItemStore[itemID];
			if(Object.keys(inventory).includes(itemID)) {
				if(inventory[itemID].inCart) {
					dispatch(Istore.updateHistory([
						itemID, Date.now()
					]));
				}
				dispatch(Lists.deleteItemFromList([ itemID, currentList ]));

			} else {
				let purchaseBy = 0;
				if(refItem.interval) {
					let lastBuy = _History[itemID] && _History[itemID][0] ? _History[itemID][0] : Date.now();
					purchaseBy = lastBuy + (refItem.interval * 86400000);
				}
				dispatch(Lists.addItemToList([
					itemID,
					{
						inCart: false,
						qty: refItem.defaultQty || '1',
						addedBy: uuid,
						purchaseBy
					},
					currentList
				]));
				if(!refItem.parents.includes(currentList))
					dispatch(Istore.updateItem([
						itemID,
						{
							...refItem,
							parents: [ ...refItem.parents, currentList ]
						}
					]));
			}
		} else {
			// Toggle inCart, re-render should happen automatically
			const newItem = { ..._Lists[currentList].inventory[itemID] };
			newItem.inCart = !newItem.inCart;

			dispatch(Lists.updateItemInList([ itemID, newItem, currentList ]));
		}
	}

	const IconDrawer = ({ item }) => {
		return (
			<>
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
			</>
		);
	}

	const editTags = item => {
		console.log('editTags');
		setXstate({
			'itemToEdit': item.id,
			'showTagEdit': true
		});
	}

	const removeTag = (item, tag) => {
		dispatch(Istore.updateItem([
			item.id,
			{
				tags: item.tags.filter(t => t !== tag)
			}
		]));
	}

/* Differences between ItemStore and List view:

- Checkbox completely different, different functions
- No qty, purchaseBy, or inCart with global view

Solutions:
- render different checkboxes
- only show Qty and purchaseBy lines if in List view

*/

	return (
		<Collapse style={{
			backgroundColor: 'white',
			borderBottomColor: 'lightgray',
			borderBottomWidth: 1,
			flex: 1
		}}>
			<CollapseHeader style={{ flex: 1 }}>
				<ListItem style={{ flex: 1 }}>
					{ global
						? <Button
							type='clear'
							icon={_ => (
								<Icon
									name={Object.keys(_Lists[currentList].inventory).includes(item.id) ? 'minus' : 'plus'}
									color={Object.keys(_Lists[currentList].inventory).includes(item.id) ? 'red' : 'green'}
									type='font-awesome'
									size={32}
								/>
							)}
							onPress={_ => handleCheckBox(item.id)}
						/>
						: <Button
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
					}
					<ListItem.Content style={{
						flex: 1,
						borderWidth: 1,
						borderColor: 'yellow'
					}}>
						<ListItem.Title
							style={item.inCart
								? _Styles.textItemNameChecked
								: _Styles.textItemName
							}
						>
							{item.name}
						</ListItem.Title>
						{ !global &&
							<ListItem.Subtitle style={{
								flexDirection: 'row',
								flex: 1,
								alignSelf: 'stretch',
								borderWidth: 1,
								borderColor: 'purple'
							}}>
								<View style={{
									flex: 8,
									flexDirection: 'row',
									borderWidth: 1,
									borderColor: 'blue',
									backgroundColor: 'white'
								}}>
									<Text style={_Styles.textItemQtyLabel}>
										Qty:
									</Text>
									<Text style={_Styles.textItemQty}>
										{item.qty}
									</Text>
								</View>
								<View style={{
									flex: 4,
									flexDirection: 'row-reverse',
									alignItems: 'flex-end',
									justifyContent: 'center',
									borderWidth: 1,
									borderColor: 'red',
									backgroundColor: 'white'
								}}>
									<IconDrawer item={item} />
								</View>
							</ListItem.Subtitle>
						}
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
				<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
					{ item.tags.map(tag => {
						console.log('rendering tag:', tag);
						return (
							<Chip
								buttonStyle={{
									backgroundColor: 'goldenrod',
									marginVertical: 5,
									marginRight: 5
								}}
								title={`${tag} |`}
								onPress={_ => removeTag(item, tag)}
								key={`${item.id}-${tag}`}
								iconRight
								icon={{
									name: 'x',
									type: 'feather',
									color: 'white'
								}}
							/>
						)
					}
					)}
					<Chip
						icon={{
							name: 'plus',
							type: 'font-awesome',
							color: 'white'
						}}
						buttonStyle={{
							backgroundColor: 'goldenrod',
							marginVertical: 5
						}}
						onPress={_ => editTags(item)}
					/>
				</View>
				<View>
					<Text style={_Styles.textItemDetailLabel}>
						Added by:
					</Text>
					<Text style={_Styles.textItemDetailText}>
						{item.addedBy || '-'}
					</Text>
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
					{ !global &&
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
							{ showCalendar && !global && (
								<DateTimePicker
									value={pickDate}
									mode='date'
									display='calendar'
									onChange={(e, newDate) => {
										Utils.debugMsg('dateTimePicker:\n\te: '+
											JSON.stringify(e)+'\n\tnewDate: '+
											JSON.stringify(newDate)+
											'\n\te.type: '+e.type);
										//setXstate({ 'showCalendar': false });
										setShowCalendar(false);
										if(e.type === 'set')
										{
											Utils.debugMsg('setting date...');
											setPickDate(newDate);
											dispatch(Lists.updateItemInList([
												item.id,
												{
													purchaseBy: e.nativeEvent.timestamp
												}
											]));
										}
									}}
									minimumDate={Date.now()}
								/>
							)}
						</View>
					}
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

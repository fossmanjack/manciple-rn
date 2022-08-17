import { useState } from 'react';
import {
	Pressable,
	ScrollView,
	Switch,
	Text,
	View
} from 'react-native';
import { useSelector } from 'react-redux';
import { Button, Icon } from 'react-native-elements';
import Dialog from 'react-native-dialog';
import * as Options from '../slices/optionsSlice';

export default function SortOrderDialog(props) {
	const { dispatch, visible, setVisible } = props;
	const [ sortField, sortAsc ] = useSelector(S => S.options.sortOpts);
	const [ ascending, setAscending ] = useState(sortAsc);

	const handleSelection = field => {
		dispatch(Options.setSortOpts([ field, ascending ]));
		setVisible(!visible);
	}

	const handleClose = _ => {
		if(ascending !== sortAsc)
			dispatch(Options.setSortOpts([ sortField, ascending]));
		setVisible(!visible);
	}

	return (
		<Dialog.Container
			visible={visible}
			onBackdropPress={handleClose}
			onRequestClose={handleClose}
		>
			<ScrollView>
				<Dialog.Title>
					Sort Order
				</Dialog.Title>
				<Dialog.Description style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center'
				}}>
						<Text>
							Ascending?
						</Text>
						<Switch
							value={ascending}
							onValueChange={_ => setAscending(!ascending)}
						/>
						<Button
							onPress={handleClose}
							title='Close'
						/>
				</Dialog.Description>
				<Dialog.Description>
					<View>
						<Pressable
							onPress={_ => handleSelection('name')}
						>
							{ sortField === 'name' &&
								<Icon
									name='check'
									type='font-awesome'
									color='gray'
									size={14}
								/>
							}
							<Text>Name</Text>
						</Pressable>
						<Pressable
							onPress={_ => handleSelection('loc')}
						>
							{ sortField === 'loc' &&
								<Icon
									name='check'
									type='font-awesome'
									color='gray'
									size={14}
								/>
							}
							<Text>Location</Text>
						</Pressable>
						<Pressable
							onPress={_ => handleSelection('purchaseBy')}
						>
							{ sortField === 'purchaseBy' &&
								<Icon
									name='check'
									type='font-awesome'
									color='gray'
									size={14}
								/>
							}
							<Text>Purchase By</Text>
						</Pressable>
						<Pressable
							onPress={_ => handleSelection('price')}
						>
							{ sortField === 'price' &&
								<Icon
									name='check'
									type='font-awesome'
									color='gray'
									size={14}
								/>
							}
							<Text>Price</Text>
						</Pressable>
						<Pressable
							onPress={_ => handleSelection('none')}
						>
							{ sortField === 'none' &&
								<Icon
									name='check'
									type='font-awesome'
									color='gray'
									size={14}
								/>
							}
							<Text>Custom</Text>
						</Pressable>
					</View>
				</Dialog.Description>
			</ScrollView>
		</Dialog.Container>
	);
}

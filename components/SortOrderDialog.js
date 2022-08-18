import { useState } from 'react';
import {
	Pressable,
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
	const [ field, setField ] = useState(sortField);
	const _Opts = [
		[ 'name', 'Name' ],
		[ 'loc', 'Location' ],
		[ 'price', 'Price' ],
		[ 'purchaseBy', 'Purchase By' ],
		[ 'none', 'Custom' ]
	];

	const handleClose = _ => {
		dispatch(Options.setSortOpts([ field, ascending ]));
		setVisible(!visible);
	}

	const RadioButton = props => {
		const { id, label } = props;

		return (
			<Pressable
				onPress={_ => setField(id)}
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					paddingVertical: 8
				}}
			>
				<Icon
					name={field === id ? 'radio-button-on' : 'radio-button-off'}
					type='material'
					style={{
						paddingRight: 5
					}}
				/>
				<Text
					style={{
						fontSize: 18
					}}
				>
					{label}
				</Text>
			</Pressable>
		);
	}

	return (
		<Dialog.Container
			visible={visible}
			onBackdropPress={handleClose}
			onRequestClose={handleClose}
		>
			<Dialog.Title>
				Sort Order
			</Dialog.Title>
			<Dialog.Switch
				value={ascending}
				label='Ascending?'
				onValueChange={_ => setAscending(!ascending)}
			/>
				{_Opts.map(opt =>
					<View>
						<RadioButton
							id={opt[0]}
							label={opt[1]}
						/>
					</View>
				)}
			<Dialog.Button
				onPress={handleClose}
				label='OK'
			/>
		</Dialog.Container>
	);

}


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
import { useXstate } from '../res/Xstate';

export default function SortOrderDialog() {
	const { showSortOrder, dispatch, setXstate } = useXstate();
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
		setXstate({ 'showSortOrder': false });
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
			visible={showSortOrder}
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
						<RadioButton
							id={opt[0]}
							label={opt[1]}
							key={opt[0]}
						/>
				)}
			<Dialog.Button
				onPress={handleClose}
				label='OK'
			/>
		</Dialog.Container>
	);

}


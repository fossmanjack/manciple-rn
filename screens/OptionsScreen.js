import { useState } from 'react';
import {
	Pressable,
	StyleSheet,
	Text,
	View
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Options from '../slices/optionsSlice';
import * as Global from '../slices/globalSlice';

export default function OptionsScreen(props) {
	const { setNav } = props;
	const _Opts = useSelector(S => S.options);
	const [ syncOpen, setSyncOpen ] = useState(false);
	const [ syncValue, setSyncValue ] = useState(_Opts.sync);
	const [ syncItems, setSyncItems ] = useState([
		{ label: 'None', value: 'none' },
		{ label: 'NextCloud', value: 'nc' },
		{ label: 'WebDAV', value: 'dav' },
		{ label: 'Manciple', value: 'native' }
	]);

	const dispatch = useDispatch();

	const handleSetValue = val => {
		dispatch(Options.setSync(val));
		setSyncValue(val);
	}

	const restoreDefaults = _ => {
		// purge store
	}

	return (
		<View style={styles.container}>
			<Text>
				TBI:
					- Back-end storage option
					- State reset button (flush persistent storage)
					- Light/dark mode
			</Text>
			<View style={styles.row}>
				<Text>Synchronization Back-End</Text>
				<DropDownPicker
					open={syncOpen}
					value={syncValue}
					items={syncItems}
					setOpen={setSyncOpen}
					setValue={setSyncValue}
					setItems={setSyncItems}
					onChangeValue={val => dispatch(Options.setSync(val))}
				/>
			</View>
			<View>
				<Pressable onPress={restoreDefaults}>
					<Text>Restore Factory Defaults</Text>
				</Pressable>
			</View>
			<View>
				<Pressable onPress={_ => setNav('pantry')}>
					<Text>Back to Pantry</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	row: {
		flexDirection: 'row'
	}
});

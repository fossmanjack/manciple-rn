import { useState } from 'react';
import {
	Pressable,
	StyleSheet,
	Text,
	View
} from 'react-native';
import {
	Button
} from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import Header from '../components/HeaderComponent';
import * as Pantry from '../slices/pantriesSlice';
import * as Options from '../slices/optionsSlice';
import * as Global from '../slices/globalSlice';
import * as Dav from '../utils/davModule';

export default function OptionsScreen(props) {
	const { setNav, drawerCtl } = props;
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
		console.log('Attempting to restore defaults!');
		dispatch(Pantry.resetState());
	}

	return (
		<View style={styles.container}>
			<Header
				drawerCtl={drawerCtl}
				title='Options'
			/>
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
				<Button
					onPress={restoreDefaults}
					title='Restore Factory Defaults'
				/>
			</View>
			<View>
				<Button
					onPress={_ => setNav('pantry')}
					title='Back to Pantry'
				/>
			</View>
			<View>
				<Button
					onPress={_ => Dav.saveStateToDAV()}
					title='State Save Test'
				/>
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

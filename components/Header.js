import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import * as Global from '../slices/globalSlice';
import * as Pantry from '../slices/pantriesSlice';

export default function Header() {
	const ptr = useSelector(S => S.pantries);
	const { mode } = useSelector(S => S.global);
	const dispatch = useDispatch();

	const handleToggleMode = _ => {
		console.log(ptr._Pantries[ptr.currentPantry]);

		const targetMode = mode === 'list' ? 'pantry' : 'list';
		dispatch(Global.setMode(targetMode));
	}

	return (
		<View style={{ flexDirection: 'row', backgroundColor: 'royalblue', alignItems: 'center' }}>
			<View style={{ flex: 10 }}>
				<Text style={{ color: 'white', fontSize: 24 }}>
					{ptr._Pantries[ptr.currentPantry].name}: {mode === 'list' ? 'List' : 'Pantry'} view
				</Text>
			</View>
			<View style={{ flex: 2, flexDirection: 'row', justifyContent: 'flex-end' }}>
				<Icon
					name='list'
					type='font-awesome'
					onPress={_ => handleToggleMode()}
					reverse
					color='royalblue'
				/>
				<Icon
					name='gear'
					type='font-awesome'
					onPress={_ => console.log('Options pressed')}
					reverse
					color='royalblue'
				/>
			</View>
		</View>
	);
}

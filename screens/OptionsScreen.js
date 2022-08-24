import { useState } from 'react';
import {
	StyleSheet,
	Text,
	View
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as Options from '../slices/optionsSlice';
import * as Global from '../slices/globalSlice';

export default function OptionsScreen(props) => {

	return (
		<View style={styles.container}>
			<Text>
				TBI:
					- Back-end storage option
					- State reset button (flush persistent storage)
					- Light/dark mode
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

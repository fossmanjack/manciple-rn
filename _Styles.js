import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';

export const _Styles = StyleSheet.create({
	viewMain: {
		flex: 1,
		paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight
	},
	viewList: {
		flexDirection: 'row',
		marginVertical: 4,
		borderStyle: 'solid',
		borderColor: 'gray',
		alignItems: 'center'
	},
	textItemName: {
		fontSize: 20
	},
	textItemNameChecked: {
		fontSize: 20,
		textDecorationLine: 'line-through'
	},
	textItemQtyLabel: {
		fontSize: 16,
		color: 'gray'
	},
	textItemQty: {
		fontSize: 16
	},
	footerSafeView: {
		flex: 1,
		flexDirection: 'row'
	},
	footerTextBox: {
		height: 40,
		width: '100%',
		borderWidth: 1,
		padding: 3,
		flex: 10
	},
	footerIcon: {
		padding: 3,
		justifyContent: 'center',
		alignItems: 'center',
		flex: 2
	},
	itemSwipeView: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		flex: 1
	},
	textItemDetailLabel: {
		fontSize: 12,
		color: 'gray'
	},
	textItemDetailText: {
		fontSize: 12
	}
});

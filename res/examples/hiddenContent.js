<View style={styles.rowBack}>
	<Text>Left</Text>
	<TouchableOpacity
		style={[styles.backRightBtn, styles.backRightBtnLeft]}
		onPress={() => closeRow(rowMap, data.item.key)}
	>
		<Text style={styles.backTextWhite}>Close</Text>
	</TouchableOpacity>
	<TouchableOpacity
		style={[styles.backRightBtn, styles.backRightBtnRight]}
		onPress={() => deleteRow(rowMap, data.item.key)}
	>
		<Text style={styles.backTextWhite}>Delete</Text>
	</TouchableOpacity>
</View>


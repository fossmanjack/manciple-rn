

export default function PantryScreen(props) => {
	const { exports } = props;

	return (
		<>
			<SwipeListView
				data={
					Utils.sortPantry(mode === 'list'
						? _Pantries[currentPantry].inventory.filter(i => i.listed)
						: _Pantries[currentPantry].inventory, sortOpts)
						.map(item => ({
							item,
							key: item.id,
							dispatch
						}))
				}
				renderItem={(data, rowMap) => {
					const { item: { item } } = data;
					return (
						<PantryItem
							item={item}
							exports={{
								handleCheckBox,
								handleDateChange
							}}
						/>
					)
				}}
				renderHiddenItem={(data, rowMap) => {
					const { item: { item }} = data;
					return (
					<View style={{
						alignItems: 'flex-end',
						justifyContent: 'center',
						borderWidth: 1,
						borderColor: 'purple',
					}}>
						<Button
							onPress={_ => {
									editItem(item);
								}
							}
							icon={
								<Icon
									name='pencil'
									type='font-awesome'
									color='white'
									style={{ marginRight: 5 }}
								/>
							}
							title='Edit'
							style={{ width: 100 }}
						/>
						<Button
							onPress={_ => handleToggleStaple(item)}
							icon={
								<Icon
									name={item.staple ? 'toggle-on' : 'toggle-off'}
									type='font-awesome'
									color='black'
									style={{ marginRight: 5 }}
								/>
							}
							title='Staple'
							type='outline'
						/>
					</View>
				)
				}}
				rightOpenValue={-100}
				leftActivationValue={75}
				leftActionValue={500}
				onLeftAction={handleSweep}
				bottomDivider
				closeOnRowPress
				closeOnRowBeginSwipe
				closeOnRowOpen
				closeOnScroll
			/>
			<Footer />
		</>
	);
}

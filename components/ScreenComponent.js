// ScreenComponent.js
// Loads the various screens on state change in Main
import { Text, View } from 'react-native';
import HelpScreen from '../screens/HelpScreen';
import OptionsScreen from '../screens/OptionsScreen';
import PantryScreen from '../screens/PantryScreen';
import UserScreen from '../screens/UserScreen';
import InventoryScreen from '../screens/InventoryScreen';

export default function Screen(props) {
	const { _Xstate, setXstate } = props;

	return (
		{_ => {
			switch(_Xstate.currentPage) {
				case 'help':
					return (<HelpScreen _Xstate={_Xstate} setXstate={setXstate} />);
					break;
				case 'itemStore':
					return (<ItemStoreScreen _Xstate={_Xstate} setXstate={setXstate} />);
					break;
				case 'options':
					return (<OptionsScreen _Xstate={_Xstate} setXstate={setXstate} />);
					break;
				case 'pantry':
					return (<PantryScreen _Xstate={_Xstate} setXstate={setXstate} />);
					break;
				case 'user':
					return (<UserScreen _Xstate={_Xstate} setXstate={setXstate} />);
					break;
				default:
					return (<View><Text>Oops!</Text></View>);
			}
		}
	);
}

/*
	switch(nav) {
		case 'help':
			return <HelpScreen />;
			break;
		case 'options':
			return <OptionsScreen />;
			break;
		case 'pantry':
			return <PantryScreen />;
			break;
		case 'default':
			return (<View></View>);
	}
*/
/*
	return _Xstate.currentPage === 'help'
		? <HelpScreen
		    _Xstate={_Xstate}
			setXstate={setXstate}
		/>
		: nav === 'options'
			? <OptionsScreen
		    	_Xstate={_Xstate}
				setXstate={setXstate}
			/>
			: nav === 'pantry'
				? <PantryScreen
		    		_Xstate={_Xstate}
					setXstate={setXstate}
				/>
				: nav === 'user'
					? <UserScreen
		    			_Xstate={_Xstate}
						setXstate={setXstate}
					/>
					: nav === 'inventory'
						? <InventoryScreen
		    				_Xstate={_Xstate}
							setXstate={setXstate}
						/>
						: (<View><Text>Oops!</Text></View>);
}
*/

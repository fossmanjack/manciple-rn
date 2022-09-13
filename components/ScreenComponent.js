// ScreenComponent.js
// Loads the various screens on state change in Main
import { Text, View } from 'react-native';
import CurrentListScreen from '../screens/CurrentListScreen';
import HelpScreen from '../screens/HelpScreen';
import ItemStoreScreen from '../screens/ItemStoreScreen';
import OptionsScreen from '../screens/OptionsScreen';
import UserScreen from '../screens/UserScreen';

export default function Screen({ _Xstate }) {
	// I utterly cannot figure out how to do this with switch, so if/else it is

	const nav = _Xstate.currentScreen;

	if(nav === 'currentList')
		return <CurrentListScreen _Xstate={_Xstate} />;
	else if(nav === 'itemStore')
		return <ItemStoreScreen _Xstate={_Xstate} />;
	else if(nav === 'user')
		return <UserScreen _Xstate={_Xstate} />;
	else if(nav === 'help')
		return <HelpScreen _Xstate={_Xstate} />;
	else if(nav === 'options')
		return <OptionsScreen _Xstate={_Xstate} />;
	else
		return (<View><Text>Oops!</Text></View>);
}

/*
	return (
		{switch(_Xstate.currentScreen) {
			case 'currentList':
				<CurrentListScreen _Xstate={_Xstate} />;
				break;
			default:
				<View><Text>Oops!</Text></View>;
		}}
	);
}
*/
/*
	return (
		{_ => {
			switch(_Xstate.currentScreen) {
				case 'currentList':
					return (<CurrentListScreen _Xstate={_Xstate} />);
					break;
				case 'help':
					return (<HelpScreen _Xstate={_Xstate} />);
					break;
				case 'itemStore':
					return (<ItemStoreScreen _Xstate={_Xstate} />);
					break;
				case 'options':
					return (<OptionsScreen _Xstate={_Xstate} />);
					break;
				case 'user':
					return (<UserScreen _Xstate={_Xstate} />);
					break;
				default:
					return (<View><Text>Oops!</Text></View>);
			}
		}
	);
}
*/

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
	return _Xstate.currentScreen === 'help'
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

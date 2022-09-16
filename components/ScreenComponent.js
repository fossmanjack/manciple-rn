// ScreenComponent.js
// Loads the various screens on state change in Main
import { useContext } from 'react';
import { Text, View } from 'react-native';
import CurrentListScreen from '../screens/CurrentListScreen';
import HelpScreen from '../screens/HelpScreen';
import ItemStoreScreen from '../screens/ItemStoreScreen';
import OptionsScreen from '../screens/OptionsScreen';
import UserScreen from '../screens/UserScreen';
import { Xstate } from '../res/Xstate';

export default function Screen() {
	// I utterly cannot figure out how to do this with switch, so if/else it is

	const { nav: currentScreen } = Xstate;

	if(nav === 'currentList')
		return <CurrentListScreen />;
	else if(nav === 'itemStore')
		return <ItemStoreScreen />;
	else if(nav === 'user')
		return <UserScreen />;
	else if(nav === 'help')
		return <HelpScreen />;
	else if(nav === 'options')
		return <OptionsScreen />;
	else
		return (<View><Text>Oops!</Text></View>);
}

/*
	return (
		{switch(_Xstate.currentScreen) {
			case 'currentList':
				<CurrentListScreen />;
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
					return (<CurrentListScreen />);
					break;
				case 'help':
					return (<HelpScreen />);
					break;
				case 'itemStore':
					return (<ItemStoreScreen />);
					break;
				case 'options':
					return (<OptionsScreen />);
					break;
				case 'user':
					return (<UserScreen />);
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

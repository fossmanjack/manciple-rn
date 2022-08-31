// ScreenComponent.js
// Loads the various screens on state change in Main
import { Text, View } from 'react-native';
import HelpScreen from '../screens/HelpScreen';
import OptionsScreen from '../screens/OptionsScreen';
import PantryScreen from '../screens/PantryScreen';
import UserScreen from '../screens/UserScreen';

export default function Screen(props) {
	const { exports: { nav, setNav, drawerCtl }} = props;

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
	return nav === 'help'
		? <HelpScreen
			drawerCtl={drawerCtl}
			setNav={setNav}
		/>
		: nav === 'options'
			? <OptionsScreen
				drawerCtl={drawerCtl}
				setNav={setNav}
			/>
			: nav === 'pantry'
				? <PantryScreen
					drawerCtl={drawerCtl}
					setNav={setNav}
				/>
				: nav === 'user'
					? <UserScreen
						drawerCtl={drawerCtl}
						setNav={setNav}
					/>
					: (<View><Text>Oops!</Text></View>);
}

// ScreenComponent.js
// Loads the various screens on state change in Main
import { Text, View } from 'react-native';
import HelpScreen from '../screens/HelpScreen';
import OptionsScreen from '../screens/OptionsScreen';
import PantryScreen from '../screens/PantryScreen';

export default function Screen(props) {
	const { exports: { nav, setNav, drawerCtl, handleCheckBox, handleDateChange }} = props;

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
				? <PantryScreen exports={{ drawerCtl, handleCheckBox, handleDateChange }}/>
				: (<View><Text>Oops!</Text></View>);
}

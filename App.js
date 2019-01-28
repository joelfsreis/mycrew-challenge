import { createStackNavigator, createAppContainer } from 'react-navigation';
import RegisterScreen from './src/containers/Register';
import RaceScreen from './src/containers/Race';

const App = createStackNavigator({
  Race: { screen: RaceScreen},
  Home: { screen: RegisterScreen },
}, {
  initialRouteName: "Home",
}, {
  portraitOnlyMode: true,
});

export default createAppContainer(App);

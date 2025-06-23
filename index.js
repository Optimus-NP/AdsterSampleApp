/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {RootNavigation} from './src/navigation/rootNavigation';
import { enableScreens } from 'react-native-screens';


AppRegistry.registerComponent(appName, () => RootNavigation);
enableScreens();
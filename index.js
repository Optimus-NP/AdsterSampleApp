/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {RootNavigation} from './src/navigation/rootNavigation';

AppRegistry.registerComponent(appName, () => RootNavigation);

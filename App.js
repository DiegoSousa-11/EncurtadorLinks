import React, { useEffect, useState } from 'react';
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabComponent from './assets/Components/TabBar';
import Home from './assets/Screens/Home';
import MyLinks from './assets/Screens/MyLinks';
import Statistics from './assets/Screens/Statistics';
import Search from './assets/Screens/Search';
import Settings from './assets/Screens/Settings';
import { PreferencesContext } from './assets/Components/PreferencesContext';
import { DarkTheme as PaperDarkTheme, DefaultTheme as PaperDefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    backgroundColor: "#E5E5E5",
    text: 'black',
    header: "white",
    secondBackgroundColor: "white",
    thirdBackgroundColor: "white",
    statusBar: "dark-content",
  },
};
const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    backgroundColor: "#252525",
    text: 'white',
    header: "#121212",
    secondBackgroundColor: "#3B3B3B",
    thirdBackgroundColor: "#5A5A5A",
    statusBar: "light-content",
  },
};

const light = {
  backgroundColor: "#E5E5E5",
  color: "#252525",
}

const dark = {
  backgroundColor: "#252525",
  color: "white",
}

const Tab = createBottomTabNavigator();

export default function App() {
  const [isThemeDark, setIsThemeDark] = useState(false);
  const Theme = isThemeDark == true ? dark : light;
  let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

  const toggleTheme = React.useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark]
  );

  useEffect(() => {
    async function getTheme() {
      let isDarkTheme = await AsyncStorage.getItem("DarkTheme");
      if(isDarkTheme == null)
        setIsThemeDark(false);
      else
        setIsThemeDark(JSON.parse(isDarkTheme));
    }
    getTheme();
  }, [])

  return (
    <PreferencesContext.Provider value={preferences}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <Tab.Navigator initialRouteName="HomeScreen" tabBarOptions={{style: {height: 70, alignItems: 'center'}}}>
            <Tab.Screen name="HomeScreen" component={Home} options={{tabBarButton: (props) => <TabComponent label="Home" icon="home" {...props}/>, }}/>
            <Tab.Screen name="MyLinksScreen" component={MyLinks} options={{tabBarButton: (props) => <TabComponent label="Links" icon="link-2" {...props}/>, }}/>
            <Tab.Screen name="StatisticsScreen" component={Statistics} options={{tabBarButton: (props) => <TabComponent label="Estatísticas" icon="bar-chart" {...props}/>, }}/>
            <Tab.Screen name="SearchScreen" component={Search} options={{tabBarButton: (props) => <TabComponent label="Pesquisa" icon="search" {...props}/>, }}/>
            <Tab.Screen name="SettingsScreen" component={Settings} options={{tabBarButton: (props) => <TabComponent label="Config" icon="settings" {...props}/>, }}/>
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </PreferencesContext.Provider>
  );
}
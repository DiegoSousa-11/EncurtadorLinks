import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, ImageBackground } from 'react-native';
import AppLoading from 'expo-app-loading';
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFonts, Archivo_500Medium } from '@expo-google-fonts/archivo';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

export default ({navigation}) => {
    let [fontsLoaded] = useFonts({
        Archivo_500Medium
    });

    //Home menu constants
    const HomeViewScale = useSharedValue(1.15);
    const HomeViewBottom = useSharedValue((height/100) * 7.5);

    //My Links menu constants
    const myLinksTextOpacity = useSharedValue(0);
    const myLinksTextFontSize = useSharedValue(0);
    const myLinksViewMarginLeft = useSharedValue(width/15);
    const myLinksViewPadding = useSharedValue(0);
    const [myLinksViewBackground, setMyLinksViewBackground] = useState("white");
    const [myLinksIconColor, setMyLinksIconColor] = useState("#000000");

    //Statistics menu constants
    const statisticsTextOpacity = useSharedValue(0);
    const statisticsTextFontSize = useSharedValue(0);
    const statisticsViewMarginLeft = useSharedValue(width/15);
    const statisticsViewPadding = useSharedValue(10);
    const [statisticsViewBackground, setStatisticsViewBackground] = useState("white");
    const [statisticsIconColor, setStatisticsIconColor] = useState("#000000");

    //Search menu constants
    const searchTextOpacity = useSharedValue(0);
    const searchTextFontSize = useSharedValue(0);
    const searchViewMarginRight = useSharedValue(width/15);
    const searchViewPadding = useSharedValue(10);
    const [searchViewBackground, setSearchViewBackground] = useState("white");
    const [searchIconColor, setSearchIconColor] = useState("#000000");

    //Settings menu constants
    const settingsTextOpacity = useSharedValue(0);
    const settingsTextFontSize = useSharedValue(0);
    const settingsViewMarginRight = useSharedValue(width/15);
    const settingsViewPadding = useSharedValue(10);
    const [settingsViewBackground, setSettingsViewBackground] = useState("white");
    const [settingsIconColor, setSettingsIconColor] = useState("#000000");

    //Home menu animations
    const HomeViewStyle = useAnimatedStyle(()=> {
        return{
            transform: [{scale: HomeViewScale.value}],
            bottom: HomeViewBottom.value
        }
    })

    function HomeActivate()
    {
        navigation.navigate('HomeScreen');
        AllDisabled();
        HomeViewScale.value = withTiming(1.15, {
            duration: 1000,
            easing: Easing.bounce
        })
        HomeViewBottom.value = withTiming((height/100) * 7.5, {
            duration: 1000,
            easing: Easing.bounce
        })
    }

    //My links menu animations
    const myLinksTextStyle = useAnimatedStyle(() => {
        return{
            opacity: myLinksTextOpacity.value,
            fontSize: myLinksTextFontSize.value,
        };
    })

    const myLinksViewStyle = useAnimatedStyle(() => {
        return{
            marginLeft: myLinksViewMarginLeft.value,
            paddingHorizontal: myLinksViewPadding.value,
        }
    })

    function MyLinksActivate()
    {
        AllDisabled()
        setMyLinksViewBackground("#F1C2EC");
        myLinksTextFontSize.value = withTiming(14, {
            duration: 800,
            easing: Easing.bounce
        })
        myLinksTextOpacity.value = withTiming(1, {
            duration: 1000,
            easing: Easing.bounce
        })
        myLinksViewMarginLeft.value = withTiming(10, {
            duration: 1000,
            easing: Easing.bounce
        })
        statisticsViewPadding.value = withTiming(0, {
            duration: 1000,
            easing: Easing.bounce
        })
        statisticsViewMarginLeft.value = withTiming(5, {
            duration: 1000,
            easing: Easing.bounce
        })
        setMyLinksIconColor("#D446C6");
        navigation.navigate('MyLinksScreen');
    }

    //Statistics menu animations
    const statisticsTextStyle = useAnimatedStyle(() => {
        return{
            opacity: statisticsTextOpacity.value,
            fontSize: statisticsTextFontSize.value
        };
    })

    const statisticsViewStyle = useAnimatedStyle(() => {
        return{
            paddingHorizontal: statisticsViewPadding.value,
            marginLeft: statisticsViewMarginLeft.value,
        }
    })

    function StatisticsActivate()
    {
        AllDisabled()
        setStatisticsViewBackground("#F1C2EC");
        statisticsTextFontSize.value = withTiming(14, {
            duration: 800,
            easing: Easing.bounce
        })
        statisticsTextOpacity.value = withTiming(1, {
            duration: 1000,
            easing: Easing.bounce
        })
        statisticsViewMarginLeft.value = withTiming(5, {
            duration: 1000,
            easing: Easing.bounce
        })
        myLinksViewMarginLeft.value = withTiming(10, {
            duration: 1000,
            easing: Easing.bounce
        })
        myLinksViewPadding.value = withTiming(0, {
            duration: 1000,
            easing: Easing.bounce
        })
        setStatisticsIconColor("#D446C6");
        navigation.navigate('StatisticsScreen');
    }

    //Search menu animations
    const searchTextStyle = useAnimatedStyle(() => {
        return{
            opacity: searchTextOpacity.value,
            fontSize: searchTextFontSize.value
        };
    });

    const searchViewStyle = useAnimatedStyle(() => {
        return{
            paddingHorizontal: searchViewPadding.value,
            marginRight: searchViewMarginRight.value,
        }
    });

    function SearchActivate() 
    {
        AllDisabled();
        setSearchViewBackground("#F1C2EC");
        searchTextFontSize.value = withTiming(14, {
            duration: 800,
            easing: Easing.bounce
        })
        searchTextOpacity.value = withTiming(1, {
            duration: 1000,
            easing: Easing.bounce
        })
        searchViewMarginRight.value = withTiming(10, {
            duration: 1000,
            easing: Easing.bounce
        })
        settingsViewPadding.value = withTiming(0, {
            duration: 1000,
            easing: Easing.bounce
        })
        settingsViewMarginRight.value = withTiming(5, {
            duration: 1000,
            easing: Easing.bounce
        })
        setSearchIconColor("#D446C6");
        navigation.navigate('SearchScreen');
    }

    //Settings menu animations
    const settingsTextStyle = useAnimatedStyle(()=> {
        return{
            opacity: settingsTextOpacity.value,
            fontSize: settingsTextFontSize.value,
        }
    })

    const settingsViewStyle = useAnimatedStyle(()=> {
        return{
            paddingHorizontal: settingsViewPadding.value,
            marginRight: settingsViewMarginRight.value
        }
    });

    function SettingsActivate() 
    {
        AllDisabled();
        setSettingsViewBackground("#F1C2EC");
        settingsTextFontSize.value = withTiming(12, {
            duration: 800,
            easing: Easing.bounce
        })
        settingsTextOpacity.value = withTiming(1, {
            duration: 1000,
            easing: Easing.bounce
        })
        settingsViewMarginRight.value = withTiming(0, {
            duration: 1000,
            easing: Easing.bounce
        })
        searchViewPadding.value = withTiming(0, {
            duration: 1000,
            easing: Easing.bounce
        })
        searchViewMarginRight.value = withTiming(3, {
            duration: 1000,
            easing: Easing.bounce
        })
        setSettingsIconColor("#D446C6");
        navigation.navigate('SettingsScreen');
    }

    function AllDisabled()
    {
        setMyLinksViewBackground("white");
        setStatisticsViewBackground("white");
        setSearchViewBackground("white");
        setSettingsViewBackground("white");

        //Home screen
        HomeViewScale.value = withTiming(1, {
            duration: 1000,
            easing: Easing.bounce
        })
        HomeViewBottom.value = withTiming((height/100) * 3, {
            duration: 1000,
            easing: Easing.bounce
        })
        //My Links screen
        myLinksTextFontSize.value = withTiming(0, {
            duration: 800,
            easing: Easing.bounce
        })
        myLinksTextOpacity.value = withTiming(0, {
            duration: 1000,
            easing: Easing.bounce
        })
        myLinksViewMarginLeft.value = withTiming(width/15, {
            duration: 1000,
            easing: Easing.bounce
        })
        myLinksViewPadding.value = withTiming(10, {
            duration: 1000,
            easing: Easing.bounce
        })

        //Statistics screen
        statisticsViewPadding.value = withTiming(10, {
            duration: 1000,
            easing: Easing.bounce
        })
        statisticsViewMarginLeft.value = withTiming(width/15, {
            duration: 1000,
            easing: Easing.bounce
        })
        statisticsTextFontSize.value = withTiming(0, {
            duration: 800,
            easing: Easing.bounce
        })
        statisticsTextOpacity.value = withTiming(0, {
            duration: 1000,
            easing: Easing.bounce
        })

        //Search screen
        searchTextFontSize.value = withTiming(0, {
            duration: 800,
            easing: Easing.bounce
        })
        searchTextOpacity.value = withTiming(0, {
            duration: 1000,
            easing: Easing.bounce
        })
        searchViewPadding.value = withTiming(10, {
            duration: 1000,
            easing: Easing.bounce
        })
        searchViewMarginRight.value = withTiming(width/15, {
            duration: 1000,
            easing: Easing.bounce
        })

        //Settings screen
        settingsTextFontSize.value = withTiming(0, {
            duration: 800,
            easing: Easing.bounce
        })
        settingsTextOpacity.value = withTiming(0, {
            duration: 1000,
            easing: Easing.bounce
        })
        settingsViewPadding.value = withTiming(10, {
            duration: 1000,
            easing: Easing.bounce
        })
        settingsViewMarginRight.value = withTiming(width/15, {
            duration: 1000,
            easing: Easing.bounce
        })
        setMyLinksIconColor("#000000");
        setStatisticsIconColor("#000000");
        setSearchIconColor("#000000");
        setSettingsIconColor("#000000");
    }

    if(!fontsLoaded)
    {
      return <AppLoading/>
    }
    else{
        return(
            <View style={{backgroundColor: "#E5E5E5"}}>

                <ImageBackground style={styles.tabArea} source={require('../img/tabBarBackground.png')}>

                    <Animated.View style={[{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, height: 30,
                    borderRadius: 100, backgroundColor: myLinksViewBackground}, myLinksViewStyle]}>
                        <Icon onPress={() => MyLinksActivate()} name="link" size={25} color={myLinksIconColor}/>
                        <Animated.Text style={[{marginLeft: 5, fontFamily: 'Archivo_500Medium', color: '#D446C6', 
                        marginBottom: 4}, myLinksTextStyle]}>Meus links</Animated.Text>
                    </Animated.View>

                    <Animated.View style={[{flexDirection: 'row', alignItems: 'center', borderRadius: 100, height: 30,
                    backgroundColor: statisticsViewBackground}, statisticsViewStyle]}>
                        <Icon onPress={() => StatisticsActivate()} name="assessment" size={25} color={statisticsIconColor}/> 
                        <Animated.Text style={[{marginLeft: 5, fontFamily: 'Archivo_500Medium', color: '#D446C6'}, 
                        statisticsTextStyle]}>Estatísticas</Animated.Text>
                    </Animated.View>

                    <Animated.View style={[styles.addButton, HomeViewStyle]}>
                        <Icon onPress={() => HomeActivate()} name="add" size={50} color={"white"}/>
                    </Animated.View>

                    <View style={{flexDirection: 'row', marginLeft: 'auto'}}>
                        <Animated.View style={[{flexDirection: 'row', alignItems: 'center', height: 30, 
                        backgroundColor: searchViewBackground, borderRadius: 100}, searchViewStyle]}>
                            <Icon onPress={() => SearchActivate()} name="search" size={25} color={searchIconColor}/> 
                            <Animated.Text style={[{marginLeft: 5, fontFamily: 'Archivo_500Medium', color: '#D446C6'}, 
                            searchTextStyle]}>Pesquisa</Animated.Text>
                        </Animated.View>

                        <Animated.View style={[{flexDirection: 'row', alignItems: 'center', height: 30, 
                        backgroundColor: settingsViewBackground, borderRadius: 100}, settingsViewStyle]}>
                            <Icon onPress={() => SettingsActivate()} name="settings" size={25} color={settingsIconColor}/> 
                            <Animated.Text style={[{marginLeft: 5, fontFamily: 'Archivo_500Medium', color: '#D446C6'}, 
                            settingsTextStyle]}>Configurações</Animated.Text>
                        </Animated.View>
                    </View>

                </ImageBackground>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    tabArea: {
        height: (height/100) * 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    addButton: {
        width: 50,
        height: 50,
        backgroundColor: "#D446C6",
        position: 'absolute',
        borderRadius: 100,
        right: width/2 - 21,
        marginLeft: width/2 - 34,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2
    }
});
import React, { useEffect } from 'react';
import { StyleSheet, View, StatusBar, Text, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import ToggleSwitch from 'toggle-switch-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PreferencesContext } from '../../Components/PreferencesContext';
import { useTheme } from '@react-navigation/native';

function Option({onPress, index}) {
    const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);
    const { colors } = useTheme();

    useEffect(() => {
        AsyncStorage.setItem("DarkTheme", JSON.stringify(isThemeDark));
    }, [isThemeDark])

    const backgroundColor = {
        1: "#A29BD3",
        2: "#EBB3B3",
        3: "#BDCCEB"
    };

    const color = {
        1: "#4330BD",
        2: "#FA2D2D",
        3: "#2C73FF"
    };

    const icon = {
        1: "moon",
        2: "trash",
        3: "clock",
    };

    const label = {
        1: "Modo escuro",
        2: "Deletar links",
        3: "Histórico de links",
    };

    return(
        <View style={{width: "100%", alignItems: "center", flexDirection: 'row', marginTop: 40}}>
            <View style={{width: 55, height: 55, backgroundColor: backgroundColor[index], 
                borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                <Icon name={icon[index]} color={color[index]} size={25}/>
            </View>

            <Text style={[styles.optionsLabel, {color: colors.text}]}>{label[index]}</Text>
            { index == 1 &&            
            <View style={{top: 4, marginLeft: "auto"}}>
                <ToggleSwitch
                    isOn={isThemeDark}
                    onColor="#4330BD"
                    offColor="gray"
                    size="small"
                    onToggle={() => toggleTheme()}
                />
            </View>
            }

            { index != 1 && 
                <View style={{marginLeft: 'auto'}}>
                    <TouchableOpacity onPress={onPress}>
                        <View style={{width: 55, height: 55, backgroundColor: '#D4D4D4', 
                        borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginLeft: 'auto'}}>
                            <Icon name="chevron-right" color="black" size={25}/>
                        </View>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}

export default function Settings() {
    const { colors } = useTheme();

    function deleteAllLinks() {
        Alert.alert(
            "Deletar links",
            "Atenção, essa ação deletará todos os links encurtados, tem certeza dessa ação ??",
            [
                {
                    text: "Sim",
                    onPress: () => AsyncStorage.removeItem("Data")
                },
                {
                    text: "Não",
                    onPress: () => {return}
                }
            ]
        )
    }

    return(
        <>
            <View style={[styles.container, {backgroundColor: colors.backgroundColor}]}>
                <StatusBar barStyle={colors.statusBar} translucent backgroundColor="transparent"/>
                <View style={[styles.header, {backgroundColor: colors.header}]}>
                    <Text style={styles.screenTitle}>Configurações</Text>
                    <Image style={{width: 160, height: 100, marginTop: 'auto', marginLeft: 'auto'}} source={require('../../img/Settings.png')}/>
                </View>

                <View style={{width: "80%"}}>
                    <Text style={[styles.titleConfig, {color: colors.text}]}>Geral</Text>

                    <Option index={1}/>
                    <Option onPress={() => deleteAllLinks()} index={2}/>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    header: {
        height: "20%",
        width: "100%",
        position: 'absolute',
        top: 0,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        flexDirection: 'row',
        zIndex: 10,
        paddingBottom: 20,
        paddingHorizontal: 40
    },
    screenTitle: {
        fontFamily: 'Archivo_700Bold',
        marginTop: 'auto',
        fontSize: 30,
        color: '#D446C6'
    },
    titleConfig: {
        marginTop: 200,
        fontFamily: 'Archivo_700Bold',
        fontSize: 35,
        marginBottom: 10
    },
    optionsLabel: {
        fontFamily: 'Archivo_500Medium',
        fontSize: 20,
        marginLeft: 20
    }
})
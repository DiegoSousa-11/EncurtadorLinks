import React, { useRef } from 'react';
import { Text, Dimensions, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Transition, Transitioning } from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';

export default function TabBar ({label, accessibilityState, onPress, icon}) {
    const focused = accessibilityState.selected;
    const ref = useRef();
    const { colors } = useTheme();

    const transition = (
        <Transition.Sequence>
            <Transition.Out type="fade" durationMs={600}/>
            <Transition.Change interpolation="easeInOut" durationMs={500}/>
            <Transition.In type="fade" durationMs={500}/>
        </Transition.Sequence>
    )

    return(
        <Transitioning.View ref={ref} transition={transition} style={[styles.content, focused ? {backgroundColor: "#F1C2EC", borderRadius: 100} : {}]}>
            <Icon onPress={() => {ref.current.animateNextTransition(); onPress()}} style={{margin: 5}} name={icon} size={22} color={focused ? "#D446C6" : colors.text}/>
            {focused && (<Text style={[styles.text, focused ? {color: "#D446C6"} : {}]}>{label}</Text>)}
        </Transitioning.View>
    )
}

const styles = StyleSheet.create({
    text: {
        margin: 5
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center", 
        marginLeft: 10,
        height: 40,
        marginTop: 15,
        paddingHorizontal: 10
    }
})
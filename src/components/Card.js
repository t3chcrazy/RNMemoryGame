import React from 'react'
import { Pressable, View, Text, StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get("window")
const SPACE = 10
const ROOT_PADDING = 16
const CARD_SIZE = (width - 2*ROOT_PADDING - 3*SPACE)/4

export default function Card({ item, handlePress }) {
    const { value, shown, completed } = item

    const callback = () => {
        handlePress(item)
    }
    
    return (
        <Pressable disabled = {completed} onPress = {callback} style = {styles.card}>
            <Text style = {styles.char}>{value}</Text>
            {!shown && <View style = {styles.overlay} />}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        width: CARD_SIZE,
        height: CARD_SIZE,
        borderRadius: 4,
        position: "relative",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: SPACE,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "gray"
    },
    char: {
        fontSize: 18
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "green",
        zIndex: 3
    }
})
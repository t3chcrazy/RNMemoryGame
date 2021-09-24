import React, { useEffect, useRef } from 'react'
import { Pressable, Text, StyleSheet, Dimensions, Animated, Easing } from 'react-native'

const { Value, timing } = Animated

const { width } = Dimensions.get("window")
const SPACE = 10
const ROOT_PADDING = 16
const CARD_SIZE = (width - 2*ROOT_PADDING - 3*SPACE)/4

const OPTIONS = {
    duration: 400,
    useNativeDriver: true,
    easing: Easing.cubic
}

export default function Card({ item, handlePress }) {
    const { value, shown, completed } = item
    const progress = useRef(new Value(0)).current

    useEffect(() => {
        if (shown) {
            timing(progress, {
                toValue: 1,
                ...OPTIONS
            }).start()
        }
        else {
            timing(progress, {
                toValue: 0,
                ...OPTIONS
            }).start()
        }
    }, [shown])

    const rotateY = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"]
    })

    const callback = () => {
        handlePress(item)
    }
    
    return (
        <Pressable disabled = {completed} onPress = {callback} style = {[styles.card, styles.rootContainer]}>
            <Animated.View style = {[styles.card, { transform: [{ rotateY }, { scaleX: -1 }] }]}>
                <Text style = {styles.char}>{value}</Text>
            </Animated.View>
            <Animated.View style = {[styles.overlay, { transform: [{ rotateY }] }]} />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    rootContainer: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "gray"
    },
    card: {
        width: CARD_SIZE,
        height: CARD_SIZE,
        borderRadius: 4,
        position: "relative",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: SPACE,
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
        zIndex: 3,
        backfaceVisibility: "hidden"
    }
})
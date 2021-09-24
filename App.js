/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useReducer } from 'react'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
  Pressable
} from 'react-native'
import _ from 'lodash'
import Card from './src/components/Card'

const COUNT = 8
const INITIAL_ARR = new Array(COUNT*2).fill(0).map((el, ind) => String.fromCharCode(65+ind%COUNT))

function reducer(state, action) {
  const id = action.id
  const item = state[id]
  switch (action.type) {
    case "show":
      return { ...state, [id]: { ...item, shown: true } }
    case "hide":
      return { ...state, [id]: { ...item, shown: false } }
    case "complete":
      const openItemID = action.openID
      const openedItem = state[openItemID]
      return { ...state, [id]: { ...item, shown: true, completed: true }, [openItemID]: { ...openedItem, shown: true, completed: true } }
    case "reset":
      return init(INITIAL_ARR)
    default:
      return state
  }
}

function init(initialArr) {
  const shuffled = _.shuffle(initialArr)
  return shuffled.reduce((acc, el, ind) => {
    acc[ind] = {
      id: ind,
      value: el,
      shown: false,
      completed: false
    }
    return acc
  }, {})
}

const App = () => {
  const [attempts, setAttempts] = useState(0)
  const [completed, setCompleted] = useState(0)
  const [state, dispatch] = useReducer(reducer, INITIAL_ARR, init)

  const handlePress = item => {
    const isOneOpen = _.find(state, el => el.shown && !el.completed)
    if (!!isOneOpen) {
      if (item.value === isOneOpen.value) {
        dispatch({ type: "complete", openID: isOneOpen.id, id: item.id })
        setCompleted(prev => prev+1)
      }
      else {
        dispatch({ type: "show", id: item.id })
        setTimeout(() => {
          dispatch({ type: "hide", id: item.id })
          dispatch({ type: "hide", id: isOneOpen.id })
        }, 1000)
      }
      setAttempts(prev => prev+1)
    }
    else {
      dispatch({ type: "show", id: item.id })
    }
  }

  const resetGame = () => {
    setCompleted(0)
    setAttempts(0)
    dispatch({ type: "reset" })
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle={'dark-content'} />
      <Text style = {styles.titleText}>Memory Game</Text>
      <View style = {styles.container}>
        {Object.keys(state).map(el => <Card key = {el} item = {state[el]} handlePress = {handlePress} />)}
      </View>
      <Text>Completed: {completed}</Text>
      <Text>Attempts: {attempts}</Text>
      {completed === COUNT && 
      <Pressable onPress = {resetGame}>
        <Text>Reset</Text>
      </Pressable>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 20
  },
  container: {
    flexDirection: 'row',
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginVertical: 20
  },
  titleText: {
    color: "gray",
    fontSize: 24,
    textAlign: "center"
  }
})

export default App;

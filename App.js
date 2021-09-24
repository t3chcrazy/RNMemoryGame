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
  StatusBar,
  StyleSheet,
  Text,
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
      <View style = {[styles.row, styles.mainPadding]}>
        <Text style = {styles.topRowText}>Attempts: {attempts}</Text>
        <Text style = {styles.topRowText}>Matches: {completed}</Text>
      </View>
      <View style = {[styles.container, styles.mainPadding]}>
        {Object.keys(state).map(el => <Card key = {el} item = {state[el]} handlePress = {handlePress} />)}
      </View>
      <View style = {styles.bottomContainer}>
        {completed === COUNT && <Text style = {styles.congratsText}>Congratulations! You completed the game in {attempts} moves!</Text>}
        <Pressable style = {styles.button} onPress = {resetGame}>
          <Text style = {styles.buttonText}>Reset</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 20
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15
  },
  mainPadding: {
    paddingHorizontal: 16
  },
  container: {
    flexDirection: 'row',
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 20
  },
  topRowText: {
    fontSize: 16,
    color: "green",
    fontWeight: "bold"
  },
  titleText: {
    color: "gray",
    fontSize: 24,
    textAlign: "center"
  },
  button: {
    backgroundColor: "#27ae60",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8
  },
  buttonText: {
    color: "#fff",
    fontSize: 16
  },
  congratsText: {
    color: "#9b59b6",
    textAlign: "center",
    fontSize: 20,
    marginVertical: 5,
    width: "70%",
    fontWeight: "bold",
  },
  bottomContainer: {
    width: "75%",
    alignItems: "center",
    alignSelf: "center"
  }
})

export default App;

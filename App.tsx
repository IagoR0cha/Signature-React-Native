import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Home } from './src/Pages/Home';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" style="dark" hidden />
      <Home />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

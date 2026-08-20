import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const DONE = [true, true, false, true, false, false, false];

export default function WeekStrip() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Esta semana</Text>
      <View style={styles.strip}>{DAYS.map((day, i) => (
        <View key={i} style={[styles.day, DONE[i] && styles.dayDone]}><Text style={[styles.dayText, DONE[i] && styles.dayTextDone]}>{day}</Text></View>
      ))}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 16 },
  title: { color: '#aaa', fontSize: 14, marginBottom: 8 },
  strip: { flexDirection: 'row', justifyContent: 'space-between' },
  day: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' },
  dayDone: { backgroundColor: '#00CC6633' },
  dayText: { color: '#666', fontWeight: '600' },
  dayTextDone: { color: '#00CC66' },
});

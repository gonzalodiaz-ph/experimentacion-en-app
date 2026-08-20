import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function XpBar({ xp, nextLevel, level }: { xp: number; nextLevel: number; level: number }) {
  const progress = xp / nextLevel;
  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.level}>Nivel {level}</Text><Text style={styles.xp}>{xp}/{nextLevel} XP</Text></View>
      <View style={styles.bar}><View style={[styles.fill, { width: `${progress * 100}%` }]} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  level: { color: '#fff', fontWeight: '600', fontSize: 16 },
  xp: { color: '#aaa', fontSize: 14 },
  bar: { height: 8, backgroundColor: '#1a1a2e', borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#00CC66', borderRadius: 4 },
});

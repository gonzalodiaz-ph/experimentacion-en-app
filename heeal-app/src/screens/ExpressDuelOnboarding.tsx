import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ExpressDuelOnboarding({ navigation }: any) {
  return (
    <View style={styles.container}>
      {/* Header Badges */}
      <View style={styles.badgeRow}>
        <View style={styles.badgeUrgencia}>
          <Text style={styles.badgeUrgenciaText}>🔥 DUELO EXPRÉS</Text>
        </View>
        <View style={styles.badgeTimer}>
          <Text style={styles.badgeTimerText}>⏱️ EXPIRA EN 04:59</Text>
        </View>
      </View>

      {/* Title & Subtitle */}
      <Text style={styles.title}>¡Desafío Inicial Encontrado!</Text>
      <Text style={styles.subtitle}>
        Supera a tu rival en el primer duelo para ganar experiencia y reclamar tu recompensa exclusiva.
      </Text>

      {/* Gamified VS Battle Arena Card */}
      <View style={styles.arenaCard}>
        {/* Jugador (Tú) */}
        <View style={styles.playerCol}>
          <View style={[styles.avatarCircle, styles.userGlow]}>
            <Text style={styles.avatarEmoji}>⚡</Text>
          </View>
          <Text style={styles.playerName}>Tú</Text>
          <View style={styles.levelPill}>
            <Text style={styles.levelPillText}>Nivel 1</Text>
          </View>
        </View>

        {/* VS Badge Central */}
        <View style={styles.vsBadgeContainer}>
          <View style={styles.vsCircle}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          <View style={styles.xpGlowBadge}>
            <Text style={styles.xpGlowText}>+500 XP</Text>
          </View>
        </View>

        {/* Rival (Bot) */}
        <View style={styles.playerCol}>
          <View style={[styles.avatarCircle, styles.botGlow]}>
            <Text style={styles.avatarEmoji}>🤖</Text>
          </View>
          <Text style={styles.playerName}>Bot_Alpha</Text>
          <View style={[styles.levelPill, styles.botLevelPill]}>
            <Text style={styles.levelPillText}>Nivel 3</Text>
          </View>
        </View>
      </View>

      {/* Exclusive Reward Banner */}
      <View style={styles.rewardBanner}>
        <Text style={styles.rewardIcon}>🏆</Text>
        <View style={styles.rewardInfo}>
          <Text style={styles.rewardTitle}>Recompensa por Victoria</Text>
          <Text style={styles.rewardSubtitle}>Skin Legendaria "Cyber-Knight" + 500 XP</Text>
        </View>
      </View>

      {/* Main Action CTA */}
      <TouchableOpacity
        style={styles.duelButton}
        onPress={() => navigation.replace('Duel')}
        activeOpacity={0.85}
      >
        <Text style={styles.duelButtonText}>⚔️ ¡ACEPTAR DUELO AHORA!</Text>
      </TouchableOpacity>

      {/* Skip Option */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.replace('Dashboard')}
        activeOpacity={0.7}
      >
        <Text style={styles.skipText}>Ahora no, prefiero ir al Panel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: '#0d0d1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  badgeUrgencia: {
    backgroundColor: 'rgba(255, 107, 0, 0.18)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF6B00',
  },
  badgeUrgenciaText: {
    color: '#FF6B00',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  badgeTimer: {
    backgroundColor: 'rgba(0, 204, 106, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00CC66',
  },
  badgeTimerText: {
    color: '#00CC66',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#aaaaaa',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  arenaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 24,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  playerCol: {
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
  },
  userGlow: {
    borderColor: '#00CC66',
    shadowColor: '#00CC66',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  botGlow: {
    borderColor: '#FF6B00',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  avatarEmoji: {
    fontSize: 30,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  levelPill: {
    backgroundColor: 'rgba(0, 204, 102, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  botLevelPill: {
    backgroundColor: 'rgba(255, 107, 0, 0.2)',
  },
  levelPillText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  vsBadgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  vsText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  xpGlowBadge: {
    backgroundColor: 'rgba(255, 196, 42, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFC42A',
  },
  xpGlowText: {
    color: '#FFC42A',
    fontSize: 12,
    fontWeight: '800',
  },
  rewardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 196, 42, 0.08)',
    padding: 16,
    borderRadius: 16,
    width: '100%',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 196, 42, 0.3)',
  },
  rewardIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFC42A',
    marginBottom: 2,
  },
  rewardSubtitle: {
    fontSize: 13,
    color: '#ffffff',
    opacity: 0.9,
  },
  duelButton: {
    backgroundColor: '#00CC66',
    paddingVertical: 18,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#00CC66',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 16,
  },
  duelButtonText: {
    color: '#0d0d1a',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: '#666680',
    fontSize: 14,
    fontWeight: '500',
  },
});

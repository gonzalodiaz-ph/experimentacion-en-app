import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useStatsigClient, useDynamicConfig } from '@statsig/react-bindings';

const AVATAR_ALEX = require('../../assets/images/duel_avatar_alex.png');
const AVATAR_KATE = require('../../assets/images/duel_avatar_kate.png');

export default function DuelScreen({ navigation }: any) {
  const { client } = useStatsigClient();
  const config = useDynamicConfig('duel_config');

  const timeLimit      = config.get('time_limit', 30) as number;
  const remainingDuels = config.get('remaining_duels', 2) as number;
  const xpReward       = config.get('xp_reward', 50) as number;
  const ctaText        = config.get('cta_text', '🎮 Duel now!') as string;

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [started, setStarted] = useState(false);

  useEffect(() => { setTimeLeft(timeLimit); }, [timeLimit]);

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  const handleTap = () => { if (timeLeft > 0) setScore(s => s + 1); };

  const finishDuel = () => {
    client.logEvent('first_duel_completed', { score, time_limit: timeLimit, xp_reward: xpReward });
    navigation.replace('Dashboard');
  };

  useEffect(() => { if (timeLeft === 0) finishDuel(); }, [timeLeft]);

  if (started) {
    return (
      <View style={styles.container}>
        <View style={[StyleSheet.absoluteFillObject, styles.bgGradient] as any} />
        <View style={styles.gameContainer}>
          <Text style={styles.gameTimer}>{timeLeft}s</Text>
          <Text style={styles.gameScore}>{score} pts</Text>
          <Text style={styles.xpLabel}>+{xpReward} XP al ganar</Text>
          <TouchableOpacity style={styles.tapButton as any} onPress={handleTap} activeOpacity={0.7}>
            <Text style={styles.tapText}>💥</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[StyleSheet.absoluteFillObject, styles.bgGradient] as any} />

      <View style={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>◀</Text>
        </TouchableOpacity>

        <View style={styles.titleSection}>
          <Text style={styles.title}>Duel with a friend</Text>
          <View style={styles.purpleBar} />
          <Text style={styles.subtitle}>
            {remainingDuels} remaining duels on your free plan
          </Text>
        </View>

        <View style={styles.vsCard}>
          <View style={styles.userCol}>
            <View style={styles.avatarLarge}>
              <Image source={AVATAR_ALEX} style={{ width: '100%', height: '100%' }} resizeMode="cover" borderRadius={50} />
            </View>
            <Text style={styles.playerName}>Alex</Text>
            <Text style={styles.playerXP}>211 XP</Text>
          </View>

          <View style={styles.vsCol}>
            <Text style={styles.vsText}>VS</Text>
            <View style={styles.timerBadge}>
              <Text style={styles.timerBadgeText}>⏱ {timeLimit}s</Text>
            </View>
          </View>

          <View style={styles.userCol}>
            <View style={styles.avatarLarge}>
              <Image source={AVATAR_KATE} style={{ width: '100%', height: '100%' }} resizeMode="cover" borderRadius={50} />
            </View>
            <Text style={styles.playerName}>Kate</Text>
            <Text style={styles.playerXP}>194 XP</Text>
          </View>
        </View>

        <View style={styles.rewardBadge}>
          <Text style={styles.rewardText}>🏆 +{xpReward} XP al ganador</Text>
        </View>

        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={styles.duelNowBtn as any}
            onPress={() => setStarted(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.duelNowText}>{ctaText}</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>Or</Text>

          <TouchableOpacity style={styles.premiumBtn}>
            <Text style={styles.premiumBtnText}>✦ Duel with Premium</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D12',
  },
  bgGradient: {
    backgroundImage: 'radial-gradient(ellipse at -2% 9%, rgba(120,119,198,0.6) 0%, rgba(90,89,149,0.35) 18%, rgba(60,60,99,0.15) 36%, transparent 70%)',
  } as any,
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 44,
    gap: 24,
    alignItems: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: { fontSize: 18, color: '#fff' },
  titleSection: { alignItems: 'center', gap: 8, width: '100%' },
  title: { fontSize: 20, fontWeight: '700', color: '#fff', textAlign: 'center' },
  purpleBar: { width: 114, height: 6, backgroundColor: '#4C007B', marginTop: -8, marginBottom: 2 },
  subtitle: { fontSize: 14, color: '#fff', textAlign: 'center', lineHeight: 18, opacity: 0.8 },
  vsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(56,64,70,0.24)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 24,
    width: '100%',
  },
  userCol: { alignItems: 'center', gap: 16 },
  vsCol: { alignItems: 'center', gap: 10 },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2a2a3e',
    overflow: 'hidden',
  },
  playerName: { fontSize: 24, fontWeight: '900', color: '#fff' },
  playerXP: { fontSize: 18, fontWeight: '700', color: '#FFC42A' },
  vsText: { fontSize: 32, fontWeight: '900', fontStyle: 'italic', color: '#fff' },
  timerBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  timerBadgeText: { fontSize: 12, color: '#fff', fontWeight: '600' },
  rewardBadge: {
    backgroundColor: 'rgba(255,196,42,0.12)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,196,42,0.3)',
  },
  rewardText: { fontSize: 14, color: '#FFC42A', fontWeight: '600' },
  ctaSection: { alignItems: 'center', gap: 16, width: 184 },
  duelNowBtn: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'linear-gradient(to top, #88C800, #BBF246)',
    backgroundColor: '#9ADA00',
  },
  duelNowText: { fontSize: 14, fontWeight: '500', color: '#000' },
  orText: { fontSize: 14, fontWeight: '700', fontStyle: 'italic', color: '#fff' },
  premiumBtn: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F093FB',
    backgroundColor: '#181821',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumBtnText: { fontSize: 13, fontWeight: '500', color: '#F093FB' },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingTop: 44,
  },
  gameTimer: { fontSize: 64, fontWeight: '900', color: '#fff' },
  gameScore: { fontSize: 36, fontWeight: '700', color: '#BBF246' },
  xpLabel: { fontSize: 14, color: '#FFC42A', fontWeight: '600', opacity: 0.8 },
  tapButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundImage: 'linear-gradient(to top, #88C800, #BBF246)',
    backgroundColor: '#9ADA00',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#88C800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
  },
  tapText: { fontSize: 64 },
});

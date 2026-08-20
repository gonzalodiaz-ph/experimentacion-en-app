import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Image } from 'react-native';
import { useFeatureGate, useDynamicConfig, useStatsigClient } from '@statsig/react-bindings';

const AVATAR_ALEX = require('../../assets/images/avatar_alex.png');
const AVATAR_KATE = require('../../assets/images/avatar_kate.png');
const AVATAR_MAX  = require('../../assets/images/avatar_max.png');
const WORKOUT_1   = require('../../assets/images/workout_1.png');
const WORKOUT_2   = require('../../assets/images/workout_2.png');
const WORKOUT_3   = require('../../assets/images/workout_3.png');
const WORKOUT_4   = require('../../assets/images/workout_4.png');

const workouts = [
  { img: WORKOUT_1, name: 'Jumping Jacks', duration: '30 min' },
  { img: WORKOUT_2, name: 'Swimming', duration: '1h 30 min' },
  { img: WORKOUT_3, name: 'Fitness Session', duration: '45 min' },
  { img: WORKOUT_4, name: 'Jumping', duration: '10 min' },
];

const friends = [
  { img: AVATAR_KATE, name: 'Kate', activity: 'Morning Round Challenge', xp: '194 XP' },
  { img: AVATAR_MAX, name: 'Max', activity: 'Yoga Session', xp: '123 XP' },
];

export default function Dashboard({ navigation }: any) {
  const { value: showPremiumModal } = useFeatureGate('premium_social_proof');
  const { value: prominentWorkout } = useFeatureGate('new_workout_prominent');
  const config = useDynamicConfig('premium_modal_config');
  const { client } = useStatsigClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [duelsLeft, setDuelsLeft] = useState(2);
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');

  const handleDuel = () => {
    if (duelsLeft <= 0) { setModalVisible(true); return; }
    setDuelsLeft(duelsLeft - 1);
    navigation.navigate('Duel');
  };

  const handlePremiumPurchase = () => {
    client.logEvent('premium_purchased', { source: 'modal', variant: showPremiumModal ? 'pricing_social_proof' : 'control', plan: selectedPlan });
    setModalVisible(false);
  };

  // Volvemos a leer de la nube mediante Dynamic Configs de Statsig
  const title = config.get('title', 'Heeal Premium');
  const ctaText = config.get('cta_text', 'Suscribirse — 4,99€/mes');
  const showSocialProof = config.get('show_social_proof', false);
  const showUrgency = config.get('show_urgency', false);
  const showComparison = config.get('show_comparison', false);

  return (
    <View style={styles.container}>
      <View style={[StyleSheet.absoluteFillObject, styles.bgGradient] as any} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerLeft}>
            <View style={styles.avatarCircle}>
              <Image source={AVATAR_ALEX} style={{ width: '100%', height: '100%' }} resizeMode="cover" borderRadius={28} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.userName}>Alex</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.premiumBadge} onPress={() => setModalVisible(true)}>
            <Text style={styles.premiumBadgeText}>✦ Join Premium</Text>
          </TouchableOpacity>
        </View>

        {/* Mini activity cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.miniCardsContainer}
          style={styles.miniCardsScroll}
        >
          <View style={[styles.miniCard, { backgroundColor: 'rgba(120,119,198,0.2)' }]}>
            <View style={[styles.miniCardIcon, { backgroundColor: 'rgba(190,26,247,0.2)' }]}>
              <Text style={styles.miniCardIconText}>🥊</Text>
            </View>
            <Text style={styles.miniCardTitle}>Boxing</Text>
            <Text style={styles.miniCardSub}>3:32 min</Text>
            <Text style={styles.miniCardStat}>9,98 KM  ↑ 3.5</Text>
          </View>
          <View style={[styles.miniCard, { backgroundColor: 'rgba(30,200,100,0.15)' }]}>
            <View style={[styles.miniCardIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Text style={styles.miniCardIconText}>🏃</Text>
            </View>
            <Text style={styles.miniCardTitle}>Morning Run</Text>
            <Text style={styles.miniCardSub}>3:32 min</Text>
            <Text style={styles.miniCardStat}>9,98 KM  ↑ 8.2</Text>
          </View>
          <View style={[styles.miniCard, { backgroundColor: 'rgba(232,80,58,0.15)' }]}>
            <View style={[styles.miniCardIcon, { backgroundColor: 'rgba(232,80,58,0.2)' }]}>
              <Text style={styles.miniCardIconText}>🚲</Text>
            </View>
            <Text style={styles.miniCardTitle}>Ciclo</Text>
            <Text style={styles.miniCardSub}>3:32 min</Text>
            <Text style={styles.miniCardStat}>2,29 KM  ↑ 8.2</Text>
          </View>
        </ScrollView>

        {/* Today Rounds */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today Rounds</Text>
            <Text style={styles.sectionMeta}>1<Text style={styles.sectionMetaSub}>/8</Text></Text>
          </View>

          <View style={styles.workoutList}>
            {workouts.map((w, i) => (
              <View key={i} style={styles.workoutRow}>
                <View style={styles.workoutThumb}>
                  <Image source={w.img} style={{ width: '100%', height: '100%' }} resizeMode="cover" borderRadius={12} />
                </View>
                <View style={styles.workoutText}>
                  <Text style={styles.workoutName}>{w.name}</Text>
                  <Text style={styles.workoutDuration}>{w.duration}</Text>
                </View>
                <TouchableOpacity style={styles.playBtn} onPress={handleDuel}>
                  <Text style={styles.playBtnText}>▶</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity style={[styles.newWorkoutBtn as any, prominentWorkout && styles.newWorkoutBtnProminent as any]} activeOpacity={0.8}>
            <Text style={[styles.newWorkoutText, prominentWorkout && styles.newWorkoutTextProminent]}>
              {prominentWorkout ? '🔥 Start Workout Now' : '🏋️ New Workout'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Duel with a friend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duel with a friend</Text>
          <View style={styles.friendsList}>
            {friends.map((f, i) => (
              <TouchableOpacity key={i} style={styles.friendRow} onPress={handleDuel}>
                <View style={styles.friendAvatar}>
                  <Image source={f.img} style={{ width: '100%', height: '100%' }} resizeMode="cover" borderRadius={24} />
                </View>
                <View style={styles.friendText}>
                  <Text style={styles.friendName}>{f.name}</Text>
                  <Text style={styles.friendActivity}>{f.activity}</Text>
                </View>
                <Text style={styles.friendXP}>{f.xp}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.inviteText}>🎁 Invite friends</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom nav */}
      <View style={styles.bottomNav as any}>
        <View style={styles.navItem}>
          <Text style={styles.navIconActive}>📊</Text>
          <Text style={styles.navLabelActive}>Today</Text>
        </View>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🛍️</Text>
          <Text style={styles.navLabel}>Store</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏋️</Text>
          <Text style={styles.navLabel}>Track</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Premium Modal enfocado en Pricing */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            {/* Social Proof Badge Dinámico */}
            {showSocialProof && (
              <View style={{ backgroundColor: 'rgba(0, 204, 102, 0.15)', padding: 8, borderRadius: 20, alignSelf: 'center', marginBottom: 16 }}>
                <Text style={{ color: '#00CC66', fontWeight: '700', fontSize: 13 }}>⭐ 4.8 · 12.847 usuarios premium</Text>
              </View>
            )}

            {/* Textos Dinámicos */}
            <Text style={{ fontSize: 24, fontWeight: '900', color: '#fff', textAlign: 'center' }}>{title}</Text>
            <Text style={{ fontSize: 14, color: '#aaa', textAlign: 'center', marginTop: 6, marginBottom: 20 }}>
              Desbloquea todo el potencial de Heeal
            </Text>

            {/* Tabla Comparativa Dinámica */}
            {showComparison && (
              <View style={{ gap: 12, marginBottom: 24, backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#fff', flex: 1 }}>Duelos semanales</Text>
                  <Text style={{ color: '#aaa', flex: 1, textAlign: 'center' }}>❌ 2</Text>
                  <Text style={{ color: '#00CC66', flex: 1, textAlign: 'right', fontWeight: '700' }}>✅ ilimitados</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#fff', flex: 1 }}>Historial</Text>
                  <Text style={{ color: '#aaa', flex: 1, textAlign: 'center' }}>❌ 3 meses</Text>
                  <Text style={{ color: '#00CC66', flex: 1, textAlign: 'right', fontWeight: '700' }}>✅ completo</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#fff', flex: 1 }}>Avatares</Text>
                  <Text style={{ color: '#aaa', flex: 1, textAlign: 'center' }}>❌ básicos</Text>
                  <Text style={{ color: '#00CC66', flex: 1, textAlign: 'right', fontWeight: '700' }}>✅ exclusivos</Text>
                </View>
              </View>
            )}

            {/* CTA Dinámico */}
            <TouchableOpacity 
              onPress={handlePremiumPurchase}
              style={{ backgroundColor: '#00CC66', paddingVertical: 18, borderRadius: 16, alignItems: 'center' }}
            >
              <Text style={{ color: '#1a1a2e', fontSize: 17, fontWeight: '900' }}>{ctaText}</Text>
            </TouchableOpacity>

            {/* Urgencia Dinámica */}
            {showUrgency && (
              <Text style={{ color: '#FF6B00', fontSize: 12, fontWeight: '700', textAlign: 'center', marginTop: 12 }}>
                ⏰ 3 días gratis · Oferta por tiempo limitado
              </Text>
            )}

            {/* Dismiss */}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: '#888', textAlign: 'center', marginTop: 16, fontSize: 14 }}>Seguir en free</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D12',
  },
  bgGradient: {
    backgroundImage: 'radial-gradient(ellipse at -2% 9%, rgba(120,119,198,0.4) 0%, rgba(90,89,149,0.2) 18%, transparent 50%)',
  } as any,
  scroll: {
    paddingTop: 44,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2a2a3e',
    overflow: 'hidden',
  },
  headerText: {
    gap: 2,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
  },
  userName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
  },
  premiumBadge: {
    borderWidth: 1,
    borderColor: '#F093FB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#181821',
  },
  premiumBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F093FB',
  },
  miniCardsScroll: {
    marginBottom: 24,
    flexGrow: 0,
  },
  miniCardsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  miniCard: {
    width: 164,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    backdropFilter: 'blur(40px)',
    backgroundColor: 'rgba(255,255,255,0.12)',
  } as any,
  miniCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCardIconText: {
    fontSize: 20,
  },
  miniCardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    letterSpacing: 0.5,
  },
  miniCardSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5,
  },
  miniCardStat: {
    fontSize: 12,
    fontWeight: '600',
    color: '#04DC00',
    letterSpacing: 0.5,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  sectionMeta: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  sectionMetaSub: {
    fontSize: 12,
  },
  workoutList: {
    gap: 12,
  },
  workoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#384046',
    borderRadius: 15,
    paddingLeft: 8,
    paddingRight: 16,
    paddingVertical: 6,
    gap: 12,
  },
  workoutThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#192126',
    overflow: 'hidden',
  },
  workoutText: {
    flex: 1,
    gap: 6,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  workoutDuration: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  playBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#88C800',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '700',
  },
  newWorkoutBtn: {
    backgroundImage: 'linear-gradient(to top, #88C800, #BBF246)',
    backgroundColor: '#9ADA00',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  newWorkoutText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  newWorkoutBtnProminent: {
    backgroundColor: '#FF3366',
    backgroundImage: 'linear-gradient(to right, #FF3366, #FF6B00)',
    paddingHorizontal: 32,
    paddingVertical: 14,
    shadowColor: '#FF3366',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    transform: [{ scale: 1.05 }],
  },
  newWorkoutTextProminent: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  friendsList: {
    gap: 0,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 12,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2a2a3e',
    overflow: 'hidden',
    borderWidth: 1.3,
    borderColor: '#6172F3',
  },
  friendText: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  friendActivity: {
    fontSize: 15,
    color: '#858699',
  },
  friendXP: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFC42A',
  },
  inviteText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#F093FB',
    textAlign: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#14141C',
    borderTopWidth: 1,
    borderTopColor: '#1C1C26',
    paddingTop: 12,
    paddingBottom: 20,
    backdropFilter: 'blur(25px)',
  },
  navItem: {
    alignItems: 'center',
    gap: 2,
    width: 46,
  },
  navIcon: {
    fontSize: 22,
    opacity: 0.6,
  },
  navIconActive: {
    fontSize: 22,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#858699',
    letterSpacing: -0.24,
  },
  navLabelActive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7A5AF8',
    letterSpacing: -0.24,
  },

  // Estilos de Pricing
  pricingContainer: {
    gap: 12,
    marginBottom: 20,
    width: '100%',
  },
  planCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  annualPlanCard: {
    backgroundColor: 'rgba(0, 204, 102, 0.08)',
    borderColor: '#00CC66',
    shadowColor: '#00CC66',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  monthlyPlanCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  discountTag: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#FF6B00',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  discountTagText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  planHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00CC66',
    marginRight: 12,
    borderWidth: 3,
    borderColor: '#141422',
  },
  radioUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#555577',
    marginRight: 12,
  },
  planTitleCol: {
    flex: 1,
  },
  annualPlanTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  monthlyPlanTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ddddee',
  },
  planBilledText: {
    fontSize: 11,
    color: '#8888aa',
    marginTop: 2,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  annualPriceMain: {
    fontSize: 22,
    fontWeight: '900',
    color: '#00CC66',
  },
  monthlyPriceMain: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  pricePeriod: {
    fontSize: 11,
    color: '#8888aa',
  },

  // Modal base styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#141422',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  socialProof: {
    backgroundColor: 'rgba(0, 204, 102, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 204, 102, 0.3)',
  },
  socialProofText: {
    color: '#00CC66',
    fontWeight: '700',
    fontSize: 13,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#aaaaaa',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 20,
  },
  premiumButton: {
    backgroundColor: '#00CC66',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#00CC66',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 4,
  },
  premiumButtonText: {
    color: '#0d0d1a',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  urgency: {
    color: '#FF6B00',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 12,
  },
  closeText: {
    color: '#666688',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
  },
});

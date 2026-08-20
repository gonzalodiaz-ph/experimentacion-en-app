import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const CARD_LEFT = require('../../assets/images/card_left.png');
const CARD_CENTER = require('../../assets/images/card_center.png');
const CARD_RIGHT = require('../../assets/images/card_right.png');

export default function ClassicOnboarding({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={[StyleSheet.absoluteFillObject, styles.bgGradient] as any} />

      <View style={styles.hero}>
        <View style={styles.titleSection}>
          <Text style={styles.logo}>HEEAL</Text>
          <View style={styles.subtitleWrap}>
            <Text style={styles.subtitle}>Track your progress</Text>
            <View style={styles.purpleBar} />
            <Text style={styles.subtitleSub}>and level up with your personalized avatar</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
          style={styles.cardsScroll}
        >
          <View style={[styles.card, styles.cardSmall]}>
            <Image source={CARD_LEFT} style={{ width: '100%', height: '100%' }} resizeMode="cover" borderRadius={20} />
            <Text style={styles.cardName}>Legacy</Text>
            <View style={styles.ratingBadge}><Text style={styles.ratingText}>4.7 ⭐</Text></View>
          </View>
          <View style={[styles.card, styles.cardLarge]}>
            <Image source={CARD_CENTER} style={{ width: '100%', height: '100%' }} resizeMode="cover" borderRadius={20} />
            <Text style={styles.cardName}>Legacy</Text>
            <View style={styles.ratingBadge}><Text style={styles.ratingText}>4.7 ⭐</Text></View>
          </View>
          <View style={[styles.card, styles.cardSmall]}>
            <Image source={CARD_RIGHT} style={{ width: '100%', height: '100%' }} resizeMode="cover" borderRadius={20} />
            <Text style={styles.cardName}>Peak</Text>
            <View style={styles.ratingBadge}><Text style={styles.ratingText}>3.4 ⭐</Text></View>
          </View>
        </ScrollView>
      </View>

      <View style={styles.bottom}>
        <View style={styles.dotsContainer}>
          <View style={styles.dotBase} />
          <View style={styles.dotActive} />
        </View>
        <TouchableOpacity
          style={styles.ctaButton as any}
          onPress={() => navigation.navigate('CreateAccount')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Get Started</Text>
        </TouchableOpacity>
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
    backgroundImage: 'radial-gradient(ellipse at -2% 9%, rgba(120,119,198,0.85) 0%, rgba(90,89,149,0.5) 18%, rgba(60,60,99,0.25) 36%, transparent 70%)',
  } as any,
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 0,
  },
  logo: {
    fontSize: 64,
    fontWeight: '900',
    color: '#F093FB',
    letterSpacing: 12.8,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitleWrap: {
    alignItems: 'center',
    gap: 6,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
  },
  purpleBar: {
    alignSelf: 'flex-end',
    width: 165,
    height: 6,
    backgroundColor: '#4C007B',
    marginTop: -10,
    marginBottom: 4,
  },
  subtitleSub: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  cardsScroll: {
    marginTop: 32,
    marginBottom: 32,
    flexGrow: 0,
  },
  cardsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 8,
    paddingVertical: 8,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.48,
    shadowRadius: 16,
    elevation: 8,
    padding: 16,
    justifyContent: 'flex-end',
  },
  cardSmall: {
    width: 180,
    height: 220,
  },
  cardLarge: {
    width: 220,
    height: 240,
  },
  cardName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  ratingBadge: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 64,
    paddingTop: 40,
    alignItems: 'center',
    gap: 16,
  },
  dotsContainer: {
    width: 65,
    height: 5,
    position: 'relative',
    marginBottom: 8,
  },
  dotBase: {
    position: 'absolute',
    width: 65,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  dotActive: {
    position: 'absolute',
    left: 1,
    top: 1,
    width: 21,
    height: 3,
    borderRadius: 5,
    backgroundColor: '#4C007B',
  },
  ctaButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'linear-gradient(to top, #88C800, #BBF246)',
    backgroundColor: '#9ADA00',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
});

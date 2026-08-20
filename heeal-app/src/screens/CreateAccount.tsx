import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function CreateAccount({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View style={styles.container}>
      <View style={[StyleSheet.absoluteFillObject, styles.bgGradient] as any} />

      <View style={styles.content}>
        <View style={styles.topBar}>
          <Text style={styles.title}>Create Account</Text>
        </View>

        <View style={styles.fields}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={[styles.inputRow, styles.inputRowActive]}>
              <Text style={styles.inputIcon}>✉️</Text>
              <View style={styles.inputDivider} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="demo@email.com"
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Phone No</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>📱</Text>
              <View style={styles.inputDivider} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="+ 34 000-00-000"
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>🔒</Text>
              <View style={styles.inputDivider} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="*********"
                placeholderTextColor="rgba(255,255,255,0.4)"
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Confirm Password</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>🔒</Text>
              <View style={styles.inputDivider} />
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="*********"
                placeholderTextColor="rgba(255,255,255,0.4)"
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an Account ! </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.bottom}>
        <View style={styles.dotsContainer}>
          <View style={styles.dotBase} />
          <View style={styles.dotActive} />
        </View>
        <TouchableOpacity
          style={styles.ctaButton as any}
          onPress={() => navigation.replace('Dashboard')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Go!</Text>
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
    backgroundImage: 'radial-gradient(ellipse at -2% 9%, rgba(120,119,198,0.6) 0%, rgba(90,89,149,0.35) 18%, rgba(60,60,99,0.15) 36%, transparent 70%)',
  } as any,
  content: {
    flex: 1,
    paddingTop: 44,
  },
  topBar: {
    paddingTop: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
  },
  fields: {
    paddingHorizontal: 24,
    gap: 24,
  },
  field: {
    gap: 11,
    height: 68,
    justifyContent: 'flex-end',
    paddingBottom: 12,
    borderBottomWidth: 1.2,
    borderBottomColor: 'rgba(255,255,255,0.6)',
  },
  fieldLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    gap: 6,
  },
  inputRowActive: {
    borderBottomColor: '#FFC42A',
  },
  inputIcon: {
    fontSize: 14,
    opacity: 0.8,
  },
  inputDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    padding: 0,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginText: {
    fontSize: 15,
    color: '#fff',
  },
  loginLink: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFC42A',
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
    left: 22,
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

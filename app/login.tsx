import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Fingerprint, Mail, Lock, Globe, Eye, EyeOff, UserPlus } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getTranslation } from '@/utils/translations';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading, language, setLanguage } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError(getTranslation('fillAllFields', language));
      return;
    }

    setError('');
    const success = await login(email, password);
    if (success) {
      router.replace('/(tabs)');
    } else {
      setError(getTranslation('invalidCredentials', language));
    }
  };

  const handleBiometricLogin = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Biometric Login',
        'Biometric authentication is not available on web. Please use email and password.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const success = await login('teacher@ekdkn.org', 'password123');
      if (success) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('Error', 'Biometric authentication failed');
    }
  };

  const fillDemoCredentials = (role: 'admin' | 'teacher' | 'doctor') => {
    const credentials = {
      admin: 'admin@ekdkn.org',
      teacher: 'teacher@ekdkn.org',
      doctor: 'doctor@ekdkn.org',
    };
    setEmail(credentials[role]);
    setPassword('password123');
    setError('');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const t = (key: string) => getTranslation(key, language);

  const demoCredentials = [
    { 
      role: 'Admin', 
      email: 'admin@ekdkn.org', 
      features: 'Full access, manage all users & data',
      color: '#7C3AED'
    },
    { 
      role: 'Teacher', 
      email: 'teacher@ekdkn.org', 
      features: 'Student management, attendance, learning outcomes',
      color: '#059669'
    },
    { 
      role: 'Doctor', 
      email: 'doctor@ekdkn.org', 
      features: 'Patient management, OPD camps, prescriptions',
      color: '#DC2626'
    },
  ];

  return (
    <LinearGradient colors={['#059669', '#0284C7']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>🏥</Text>
              </View>
              <Text style={styles.title}>EKDKN</Text>
              <Text style={styles.subtitle}>{t('tagline')}</Text>
              
              <Button
                onPress={toggleLanguage}
                variant="secondary"
                size="small"
                style={styles.languageButton}
              >
                <Globe size={16} color="#ffffff" style={{ marginRight: 8 }} />
                {language === 'en' ? 'हिन्दी' : 'English'}
              </Button>
            </View>

            <Card style={styles.loginCard}>
              <Text style={styles.loginTitle}>{t('welcome')}</Text>
              <Text style={styles.loginSubtitle}>
                {t('loginToAccess')}
              </Text>
              
              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.inputContainer}>
                <Mail size={20} color="#6B7280" style={styles.inputIcon} />
                <Input
                  label={t('email')}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="admin@ekdkn.org"
                  containerStyle={styles.input}
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock size={20} color="#6B7280" style={styles.inputIcon} />
                <Input
                  label={t('password')}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError('');
                  }}
                  secureTextEntry={!showPassword}
                  placeholder="password123"
                  containerStyle={styles.input}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#6B7280" />
                  ) : (
                    <Eye size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>

              <Button
                onPress={handleLogin}
                disabled={isLoading}
                style={styles.loginButton}
              >
                {isLoading ? t('loading') : t('login')}
              </Button>

              {Platform.OS !== 'web' && (
                <Button
                  onPress={handleBiometricLogin}
                  variant="secondary"
                  style={styles.biometricButton}
                >
                  <Fingerprint size={20} color="#ffffff" style={{ marginRight: 8 }} />
                  {t('biometricLogin')}
                </Button>
              )}

              <View style={styles.signupSection}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/signup')}>
                  <Text style={styles.signupLink}>Sign up here</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.demoSection}>
                <Text style={styles.demoTitle}>{t('demoCredentials')}:</Text>
                {demoCredentials.map((cred, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.demoItem, { borderLeftColor: cred.color }]}
                    onPress={() => fillDemoCredentials(cred.role.toLowerCase() as any)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.demoHeader}>
                      <Text style={[styles.demoRole, { color: cred.color }]}>{cred.role}:</Text>
                      <Text style={styles.demoTap}>Tap to fill</Text>
                    </View>
                    <Text style={styles.demoEmail}>{cred.email}</Text>
                    <Text style={styles.demoFeatures}>{cred.features}</Text>
                  </TouchableOpacity>
                ))}
                <Text style={styles.demoPassword}>
                  {t('password')}: password123
                </Text>
              </View>
            </Card>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                © 2024 EKDKN. {t('allRightsReserved')}
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    fontSize: 42,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loginCard: {
    padding: 32,
    marginBottom: 20,
  },
  loginTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 40,
    zIndex: 1,
  },
  input: {
    paddingLeft: 48,
    marginBottom: 0,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 40,
    backgroundColor: 'transparent',
    padding: 0,
    minHeight: 20,
  },
  loginButton: {
    marginTop: 24,
    marginBottom: 16,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  signupSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  signupText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  signupLink: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  demoSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  demoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  demoItem: {
    marginBottom: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderLeftWidth: 4,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
  },
  demoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  demoRole: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  demoTap: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    fontStyle: 'italic',
  },
  demoEmail: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 4,
  },
  demoFeatures: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 16,
  },
  demoPassword: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
    textAlign: 'center',
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});
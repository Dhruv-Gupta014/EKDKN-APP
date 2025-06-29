import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mail, Lock, User, Phone, MapPin, GraduationCap, Stethoscope, Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getTranslation } from '@/utils/translations';

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'teacher' as 'admin' | 'teacher' | 'doctor',
    centerId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const { signup, isLoading, language } = useAuth();

  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError(getTranslation('fillAllFields', language));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setError('');
    const success = await signup(formData);
    if (success) {
      Alert.alert(
        'Success',
        'Account created successfully! You can now login.',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
    } else {
      setError('Failed to create account. Email might already exist.');
    }
  };

  const t = (key: string) => getTranslation(key, language);

  const roleOptions = [
    { value: 'teacher', label: 'Teacher', icon: GraduationCap, color: '#059669' },
    { value: 'doctor', label: 'Doctor', icon: Stethoscope, color: '#DC2626' },
    { value: 'admin', label: 'Admin', icon: Shield, color: '#7C3AED' },
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
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <ArrowLeft size={24} color="#ffffff" />
              </TouchableOpacity>
              
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>🏥</Text>
              </View>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join EKDKN Community</Text>
            </View>

            <Card style={styles.signupCard}>
              <Text style={styles.signupTitle}>Sign Up</Text>
              <Text style={styles.signupSubtitle}>
                Create your account to get started
              </Text>
              
              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.inputContainer}>
                <User size={20} color="#6B7280" style={styles.inputIcon} />
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChangeText={(text) => {
                    setFormData({...formData, name: text});
                    setError('');
                  }}
                  placeholder="Enter your full name"
                  containerStyle={styles.input}
                />
              </View>

              <View style={styles.inputContainer}>
                <Mail size={20} color="#6B7280" style={styles.inputIcon} />
                <Input
                  label="Email"
                  value={formData.email}
                  onChangeText={(text) => {
                    setFormData({...formData, email: text});
                    setError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="Enter your email"
                  containerStyle={styles.input}
                />
              </View>

              <View style={styles.inputContainer}>
                <Phone size={20} color="#6B7280" style={styles.inputIcon} />
                <Input
                  label="Phone Number"
                  value={formData.phone}
                  onChangeText={(text) => {
                    setFormData({...formData, phone: text});
                    setError('');
                  }}
                  keyboardType="phone-pad"
                  placeholder="+91 9876543210"
                  containerStyle={styles.input}
                />
              </View>

              <View style={styles.roleSection}>
                <Text style={styles.roleLabel}>Select Your Role</Text>
                <View style={styles.roleOptions}>
                  {roleOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.roleOption,
                        formData.role === option.value && styles.selectedRole,
                        { borderColor: option.color }
                      ]}
                      onPress={() => setFormData({...formData, role: option.value as any})}
                    >
                      <option.icon 
                        size={24} 
                        color={formData.role === option.value ? option.color : '#6B7280'} 
                      />
                      <Text style={[
                        styles.roleText,
                        formData.role === option.value && { color: option.color }
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {(formData.role === 'teacher' || formData.role === 'doctor') && (
                <View style={styles.inputContainer}>
                  <MapPin size={20} color="#6B7280" style={styles.inputIcon} />
                  <Input
                    label="Center ID (Optional)"
                    value={formData.centerId}
                    onChangeText={(text) => setFormData({...formData, centerId: text})}
                    placeholder="e.g., center1, center2"
                    containerStyle={styles.input}
                  />
                </View>
              )}

              <View style={styles.inputContainer}>
                <Lock size={20} color="#6B7280" style={styles.inputIcon} />
                <Input
                  label="Password"
                  value={formData.password}
                  onChangeText={(text) => {
                    setFormData({...formData, password: text});
                    setError('');
                  }}
                  secureTextEntry={!showPassword}
                  placeholder="Enter password (min 6 characters)"
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

              <View style={styles.inputContainer}>
                <Lock size={20} color="#6B7280" style={styles.inputIcon} />
                <Input
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChangeText={(text) => {
                    setFormData({...formData, confirmPassword: text});
                    setError('');
                  }}
                  secureTextEntry={!showConfirmPassword}
                  placeholder="Confirm your password"
                  containerStyle={styles.input}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#6B7280" />
                  ) : (
                    <Eye size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>

              <Button
                onPress={handleSignup}
                disabled={isLoading}
                style={styles.signupButton}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <View style={styles.loginSection}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.replace('/login')}>
                  <Text style={styles.loginLink}>Login here</Text>
                </TouchableOpacity>
              </View>
            </Card>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                © 2024 EKDKN. All rights reserved
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
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  signupCard: {
    padding: 32,
    marginBottom: 20,
  },
  signupTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  signupSubtitle: {
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
  roleSection: {
    marginBottom: 24,
  },
  roleLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  roleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  selectedRole: {
    backgroundColor: '#F0FDF4',
  },
  roleText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  signupButton: {
    marginTop: 24,
    marginBottom: 16,
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  loginLink: {
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
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Settings, 
  Globe, 
  Youtube, 
  LogOut,
  Bell,
  Shield,
  HelpCircle,
  Star
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getTranslation } from '@/utils/translations';

export default function ProfileScreen() {
  const { user, logout, language, setLanguage } = useAuth();

  const t = (key: string) => getTranslation(key, language);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const handleYouTubeLink = () => {
    Linking.openURL('https://youtube.com/@ekdkn');
  };

  const profileSections = [
    {
      title: 'Account Settings',
      items: [
        {
          icon: <Settings size={24} color="#6B7280" />,
          title: t('settings'),
          subtitle: 'App preferences and configuration',
          onPress: () => {},
        },
        {
          icon: <Bell size={24} color="#6B7280" />,
          title: 'Notifications',
          subtitle: 'Push notifications and alerts',
          onPress: () => {},
        },
        {
          icon: <Globe size={24} color="#6B7280" />,
          title: t('changeLanguage'),
          subtitle: `Current: ${language === 'en' ? 'English' : 'हिन्दी'}`,
          onPress: handleLanguageToggle,
        },
      ]
    },
    {
      title: 'Support & Help',
      items: [
        {
          icon: <Youtube size={24} color="#DC2626" />,
          title: 'YouTube Channel',
          subtitle: 'Watch our latest videos and updates',
          onPress: handleYouTubeLink,
        },
        {
          icon: <HelpCircle size={24} color="#6B7280" />,
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          onPress: () => {},
        },
        {
          icon: <Star size={24} color="#6B7280" />,
          title: 'Rate App',
          subtitle: 'Rate and review the app',
          onPress: () => {},
        },
      ]
    },
    {
      title: 'Security',
      items: [
        {
          icon: <Shield size={24} color="#6B7280" />,
          title: 'Privacy Settings',
          subtitle: 'Manage your privacy preferences',
          onPress: () => {},
        },
      ]
    }
  ];

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'teacher':
        return 'Teacher';
      case 'doctor':
        return 'Doctor';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return '#7C3AED';
      case 'teacher':
        return '#059669';
      case 'doctor':
        return '#DC2626';
      default:
        return '#6B7280';
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: getRoleColor(user.role) }]}>
              <User size={40} color="#ffffff" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={[styles.profileRole, { color: getRoleColor(user.role) }]}>
                {getRoleDisplayName(user.role)}
              </Text>
            </View>
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.detailItem}>
              <Mail size={20} color="#6B7280" />
              <Text style={styles.detailText}>{user.email}</Text>
            </View>
            <View style={styles.detailItem}>
              <Phone size={20} color="#6B7280" />
              <Text style={styles.detailText}>{user.phone}</Text>
            </View>
            <View style={styles.detailItem}>
              <MapPin size={20} color="#6B7280" />
              <Text style={styles.detailText}>
                {user.centerId ? `Center ID: ${user.centerId}` : 'All Centers'}
              </Text>
            </View>
          </View>
        </Card>

        {profileSections.map((section, sectionIndex) => (
          <Card key={sectionIndex} style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.settingItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.settingIcon}>
                  {item.icon}
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </Card>
        ))}

        <Card style={styles.aboutCard}>
          <Text style={styles.sectionTitle}>{t('aboutApp')}</Text>
          <Text style={styles.aboutText}>
            EKDKN (एक काम देश के नाम) is a comprehensive NGO management platform 
            designed to streamline education and healthcare initiatives. Our mission 
            is to empower communities through accessible education and quality healthcare services.
          </Text>
          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
            <Text style={styles.versionText}>© 2024 EKDKN. All rights reserved.</Text>
          </View>
        </Card>

        <View style={styles.logoutSection}>
          <Button
            onPress={handleLogout}
            variant="danger"
            style={styles.logoutButton}
          >
            <LogOut size={20} color="#ffffff" style={{ marginRight: 8 }} />
            {t('logout')}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#374151',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  profileCard: {
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  profileDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 12,
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  aboutCard: {
    marginBottom: 24,
  },
  aboutText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  versionInfo: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  logoutSection: {
    marginBottom: 32,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
  },
});
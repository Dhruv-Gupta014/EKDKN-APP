import { Tabs } from 'expo-router';
import { ChartBar as BarChart3, GraduationCap, Stethoscope, Award, User, Upload } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { getTranslation } from '@/utils/translations';

export default function TabLayout() {
  const { user, language } = useAuth();

  const t = (key: string) => getTranslation(key, language);

  if (!user) {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Loading...',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 
  const getTabsForRole = () => {
    switch (user.role) {
      case 'admin':
        return [
          { name: 'index', title: t('dashboard'), icon: BarChart3 },
          { name: 'education', title: t('education'), icon: GraduationCap },
          { name: 'medical', title: t('medical'), icon: Stethoscope },
          { name: 'scholarships', title: t('scholarships'), icon: Award },
          { name: 'upload', title: t('upload'), icon: Upload },
          { name: 'profile', title: t('profile'), icon: User },
        ];
      case 'teacher':
        return [
          { name: 'index', title: t('dashboard'), icon: BarChart3 },
          { name: 'education', title: t('education'), icon: GraduationCap },
          { name: 'upload', title: t('upload'), icon: Upload },
          { name: 'profile', title: t('profile'), icon: User },
        ];
      case 'doctor':
        return [
          { name: 'index', title: t('dashboard'), icon: BarChart3 },
          { name: 'medical', title: t('medical'), icon: Stethoscope },
          { name: 'upload', title: t('upload'), icon: Upload },
          { name: 'profile', title: t('profile'), icon: User },
        ];
      default:
        return [
          { name: 'index', title: t('dashboard'), icon: BarChart3 },
          { name: 'profile', title: t('profile'), icon: User },
        ];
    }
  };

  const allowedTabs = getTabsForRole();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
      }}
    >
      {/* Render all screens but hide unauthorized ones */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('dashboard'),
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="education"
        options={{
          title: t('education'),
          tabBarIcon: ({ size, color }) => (
            <GraduationCap size={size} color={color} />
          ),
          href: (user.role === 'admin' || user.role === 'teacher') ? undefined : null,
        }}
      />
      
      <Tabs.Screen
        name="medical"
        options={{
          title: t('medical'),
          tabBarIcon: ({ size, color }) => (
            <Stethoscope size={size} color={color} />
          ),
          href: (user.role === 'admin' || user.role === 'doctor') ? undefined : null,
        }}
      />
      
      <Tabs.Screen
        name="scholarships"
        options={{
          title: t('scholarships'),
          tabBarIcon: ({ size, color }) => (
            <Award size={size} color={color} />
          ),
          href: user.role === 'admin' ? undefined : null,
        }}
      />
      
      <Tabs.Screen
        name="upload"
        options={{
          title: t('upload'),
          tabBarIcon: ({ size, color }) => (
            <Upload size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile'),
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
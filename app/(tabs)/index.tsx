import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Users, 
  GraduationCap, 
  Stethoscope, 
  Heart, 
  DollarSign, 
  Building2,
  Award,
  TrendingUp,
  FileText,
  Settings,
  Bell,
  Calendar,
  Activity
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getTranslation } from '@/utils/translations';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { user, language } = useAuth();
  const { dashboardStats } = useData();

  const t = (key: string) => getTranslation(key, language);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getRoleBasedStats = () => {
    switch (user?.role) {
      case 'admin':
        return [
          {
            title: t('totalStudents'),
            value: dashboardStats.totalStudents,
            icon: <GraduationCap size={24} color="#059669" />,
            color: '#059669',
            subtitle: `+${dashboardStats.monthlyGrowth.students}% ${t('thisMonth')}`,
          },
          {
            title: t('totalTeachers'),
            value: dashboardStats.totalTeachers,
            icon: <Users size={24} color="#0284C7" />,
            color: '#0284C7',
          },
          {
            title: t('totalDoctors'),
            value: dashboardStats.totalDoctors,
            icon: <Stethoscope size={24} color="#DC2626" />,
            color: '#DC2626',
          },
          {
            title: t('totalVolunteers'),
            value: dashboardStats.totalVolunteers,
            icon: <Heart size={24} color="#7C3AED" />,
            color: '#7C3AED',
          },
          {
            title: t('totalDonations'),
            value: formatCurrency(dashboardStats.totalDonations),
            icon: <DollarSign size={24} color="#EA580C" />,
            color: '#EA580C',
            subtitle: `+${dashboardStats.monthlyGrowth.donations}% ${t('thisMonth')}`,
          },
          {
            title: t('totalCenters'),
            value: dashboardStats.totalCenters,
            icon: <Building2 size={24} color="#059669" />,
            color: '#059669',
          },
        ];
      case 'teacher':
        return [
          {
            title: 'My Students',
            value: 25,
            icon: <GraduationCap size={24} color="#059669" />,
            color: '#059669',
          },
          {
            title: 'Classes Today',
            value: 4,
            icon: <Users size={24} color="#0284C7" />,
            color: '#0284C7',
          },
          {
            title: 'Attendance Rate',
            value: '92%',
            icon: <TrendingUp size={24} color="#7C3AED" />,
            color: '#7C3AED',
            subtitle: t('thisWeek'),
          },
          {
            title: 'Learning Outcomes',
            value: 18,
            icon: <Award size={24} color="#EA580C" />,
            color: '#EA580C',
            subtitle: 'Recorded this month',
          },
        ];
      case 'doctor':
        return [
          {
            title: 'Patients Today',
            value: 18,
            icon: <Users size={24} color="#DC2626" />,
            color: '#DC2626',
          },
          {
            title: 'Total Patients',
            value: 342,
            icon: <Stethoscope size={24} color="#0284C7" />,
            color: '#0284C7',
          },
          {
            title: 'OPD Camps',
            value: 12,
            icon: <Building2 size={24} color="#059669" />,
            color: '#059669',
            subtitle: t('thisMonth'),
          },
          {
            title: 'Prescriptions',
            value: 156,
            icon: <FileText size={24} color="#7C3AED" />,
            color: '#7C3AED',
            subtitle: 'Total issued',
          },
        ];
      default:
        return [];
    }
  };

  const getQuickActions = () => {
    switch (user?.role) {
      case 'admin':
        return [
          {
            title: t('manageUsers'),
            icon: <Users size={24} color="#ffffff" />,
            color: '#059669',
            onPress: () => {},
          },
          {
            title: 'Centers',
            icon: <Building2 size={24} color="#ffffff" />,
            color: '#0284C7',
            onPress: () => {},
          },
          {
            title: t('generateReport'),
            icon: <FileText size={24} color="#ffffff" />,
            color: '#7C3AED',
            onPress: () => {},
          },
          {
            title: 'Analytics',
            icon: <TrendingUp size={24} color="#ffffff" />,
            color: '#EA580C',
            onPress: () => {},
          },
        ];
      case 'teacher':
        return [
          {
            title: t('markAttendance'),
            icon: <Users size={24} color="#ffffff" />,
            color: '#059669',
            onPress: () => {},
          },
          {
            title: 'Add Learning Outcome',
            icon: <Award size={24} color="#ffffff" />,
            color: '#0284C7',
            onPress: () => {},
          },
          {
            title: 'View Students',
            icon: <GraduationCap size={24} color="#ffffff" />,
            color: '#7C3AED',
            onPress: () => {},
          },
          {
            title: 'Daily Activity',
            icon: <Activity size={24} color="#ffffff" />,
            color: '#EA580C',
            onPress: () => {},
          },
        ];
      case 'doctor':
        return [
          {
            title: t('addPatient'),
            icon: <Users size={24} color="#ffffff" />,
            color: '#DC2626',
            onPress: () => {},
          },
          {
            title: 'OPD Camp',
            icon: <Building2 size={24} color="#ffffff" />,
            color: '#0284C7',
            onPress: () => {},
          },
          {
            title: 'Prescriptions',
            icon: <FileText size={24} color="#ffffff" />,
            color: '#059669',
            onPress: () => {},
          },
          {
            title: 'Patient History',
            icon: <Activity size={24} color="#ffffff" />,
            color: '#7C3AED',
            onPress: () => {},
          },
        ];
      default:
        return [];
    }
  };

  const stats = getRoleBasedStats();
  const quickActions = getQuickActions();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return language === 'hi' ? 'सुप्रभात' : 'Good Morning';
    if (hour < 17) return language === 'hi' ? 'नमस्ते' : 'Good Afternoon';
    return language === 'hi' ? 'शुभ संध्या' : 'Good Evening';
  };

  const getRoleDisplayName = () => {
    switch (user?.role) {
      case 'admin':
        return language === 'hi' ? 'प्रशासक' : 'Administrator';
      case 'teacher':
        return language === 'hi' ? 'शिक्षक' : 'Teacher';
      case 'doctor':
        return language === 'hi' ? 'डॉक्टर' : 'Doctor';
      default:
        return user?.role || '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#059669', '#0284C7']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.greetingSection}>
              <Text style={styles.greeting}>
                {getGreeting()}, {user?.name?.split(' ')[0]}!
              </Text>
              <Text style={styles.role}>
                {getRoleDisplayName()}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Bell size={24} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Settings size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.dateSection}>
            <Calendar size={16} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View 
              key={index} 
              style={[
                styles.statCard,
                { width: (width - 48) / 2 - 8 }
              ]}
            >
              <StatCard
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
                color={stat.color}
                icon={stat.icon}
              />
            </View>
          ))}
        </View>

        <Card style={styles.quickActionsCard}>
          <Text style={styles.sectionTitle}>{t('quickActions')}</Text>
          <View style={styles.actionGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionItem}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  {action.icon}
                </View>
                <Text style={styles.actionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.recentActivityCard}>
          <View style={styles.activityHeader}>
            <Text style={styles.sectionTitle}>{t('recentActivity')}</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>{t('viewAll')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#059669' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New student enrolled</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
              <View style={styles.activityBadge}>
                <GraduationCap size={16} color="#059669" />
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#0284C7' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Attendance marked for Class 5A</Text>
                <Text style={styles.activityTime}>4 hours ago</Text>
              </View>
              <View style={styles.activityBadge}>
                <Users size={16} color="#0284C7" />
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#DC2626' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>OPD camp scheduled</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
              <View style={styles.activityBadge}>
                <Stethoscope size={16} color="#DC2626" />
              </View>
            </View>
          </View>
        </Card>

        {user?.role === 'admin' && (
          <Card style={styles.insightsCard}>
            <Text style={styles.sectionTitle}>Key Insights</Text>
            <View style={styles.insightsList}>
              <View style={styles.insightItem}>
                <TrendingUp size={20} color="#059669" />
                <Text style={styles.insightText}>
                  Student enrollment increased by 15% this month
                </Text>
              </View>
              <View style={styles.insightItem}>
                <Heart size={20} color="#DC2626" />
                <Text style={styles.insightText}>
                  3 new OPD camps scheduled for next week
                </Text>
              </View>
              <View style={styles.insightItem}>
                <Award size={20} color="#7C3AED" />
                <Text style={styles.insightText}>
                  12 scholarships awarded this quarter
                </Text>
              </View>
            </View>
          </Card>
        )}
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
    paddingTop: 20,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 16,
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: -16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    marginBottom: 16,
  },
  quickActionsCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    alignItems: 'center',
    width: '22%',
    marginBottom: 16,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  recentActivityCard: {
    marginBottom: 24,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#059669',
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  activityBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightsCard: {
    marginBottom: 32,
  },
  insightsList: {
    gap: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  insightText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    flex: 1,
  },
});
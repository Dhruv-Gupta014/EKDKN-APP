import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus, Award, Search, Calendar, DollarSign, FileText, CircleCheck as CheckCircle, Clock, Circle as XCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getTranslation } from '@/utils/translations';

export default function ScholarshipsScreen() {
  const { user, language } = useAuth();
  const { scholars, addScholar } = useData();
  const [showAddScholar, setShowAddScholar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'awarded' | 'pending' | 'completed'>('all');

  // Route guard - redirect if user doesn't have access to scholarships
  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.replace('/(tabs)');
      return;
    }
  }, [user]);

  // Form state
  const [scholarForm, setScholarForm] = useState({
    name: '',
    age: '',
    education: '',
    amount: '',
    status: 'pending' as 'awarded' | 'pending' | 'completed',
  });

  const t = (key: string) => getTranslation(key, language);

  // Don't render if user doesn't have access
  if (!user || user.role !== 'admin') {
    return null;
  }

  const filteredScholars = scholars.filter(scholar => {
    const matchesSearch = scholar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scholar.education.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || scholar.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAddScholar = () => {
    if (scholarForm.name && scholarForm.education && scholarForm.amount) {
      addScholar({
        ...scholarForm,
        age: parseInt(scholarForm.age),
        amount: parseFloat(scholarForm.amount),
        awardedDate: new Date().toISOString().split('T')[0],
        documents: [],
      });
      setScholarForm({
        name: '',
        age: '',
        education: '',
        amount: '',
        status: 'pending',
      });
      setShowAddScholar(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'awarded':
        return <CheckCircle size={20} color="#22C55E" />;
      case 'pending':
        return <Clock size={20} color="#F59E0B" />;
      case 'completed':
        return <Award size={20} color="#8B5CF6" />;
      default:
        return <XCircle size={20} color="#EF4444" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'awarded':
        return '#22C55E';
      case 'pending':
        return '#F59E0B';
      case 'completed':
        return '#8B5CF6';
      default:
        return '#EF4444';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalScholarshipAmount = scholars.reduce((total, scholar) => 
    scholar.status === 'awarded' ? total + scholar.amount : total, 0
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('scholarships')}</Text>
        {user?.role === 'admin' && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddScholar(true)}
          >
            <Plus size={24} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Award size={32} color="#8B5CF6" />
              <View style={styles.statText}>
                <Text style={styles.statValue}>{scholars.length}</Text>
                <Text style={styles.statLabel}>Total Scholars</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <DollarSign size={32} color="#059669" />
              <View style={styles.statText}>
                <Text style={styles.statValue}>{formatCurrency(totalScholarshipAmount)}</Text>
                <Text style={styles.statLabel}>Total Amount</Text>
              </View>
            </View>
          </Card>
        </View>

        <Card style={styles.searchCard}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" style={styles.searchIcon} />
            <Input
              placeholder="Search scholars..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              containerStyle={styles.searchInput}
            />
          </View>
        </Card>

        <Card style={styles.filtersCard}>
          <Text style={styles.cardTitle}>Filter by Status</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterStatus === 'all' && styles.activeFilter
              ]}
              onPress={() => setFilterStatus('all')}
            >
              <Text style={[
                styles.filterText,
                filterStatus === 'all' && styles.activeFilterText
              ]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterStatus === 'pending' && styles.activeFilter
              ]}
              onPress={() => setFilterStatus('pending')}
            >
              <Text style={[
                styles.filterText,
                filterStatus === 'pending' && styles.activeFilterText
              ]}>Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterStatus === 'awarded' && styles.activeFilter
              ]}
              onPress={() => setFilterStatus('awarded')}
            >
              <Text style={[
                styles.filterText,
                filterStatus === 'awarded' && styles.activeFilterText
              ]}>Awarded</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterStatus === 'completed' && styles.activeFilter
              ]}
              onPress={() => setFilterStatus('completed')}
            >
              <Text style={[
                styles.filterText,
                filterStatus === 'completed' && styles.activeFilterText
              ]}>Completed</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.scholarsCard}>
          <Text style={styles.cardTitle}>Scholars List</Text>
          {filteredScholars.length === 0 ? (
            <View style={styles.emptyState}>
              <Award size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No scholars found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Add your first scholar to get started'
                }
              </Text>
            </View>
          ) : (
            filteredScholars.map((scholar) => (
              <View key={scholar.id} style={styles.scholarItem}>
                <View style={styles.scholarAvatar}>
                  <Text style={styles.scholarInitial}>
                    {scholar.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.scholarInfo}>
                  <Text style={styles.scholarName}>{scholar.name}</Text>
                  <Text style={styles.scholarEducation}>{scholar.education}</Text>
                  <Text style={styles.scholarAmount}>
                    Amount: {formatCurrency(scholar.amount)}
                  </Text>
                  <Text style={styles.scholarDate}>
                    Awarded: {new Date(scholar.awardedDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.scholarStatus}>
                  {getStatusIcon(scholar.status)}
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(scholar.status) }
                  ]}>
                    {scholar.status.charAt(0).toUpperCase() + scholar.status.slice(1)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </Card>

        {user?.role === 'admin' && (
          <Card style={styles.actionsCard}>
            <Text style={styles.cardTitle}>Quick Actions</Text>
            <View style={styles.actionButtons}>
              <Button
                onPress={() => setShowAddScholar(true)}
                variant="secondary"
                style={styles.actionButton}
              >
                <Award size={20} color="#ffffff" style={{ marginRight: 8 }} />
                Add Scholar
              </Button>
              <Button
                onPress={() => {}}
                style={styles.actionButton}
              >
                <FileText size={20} color="#ffffff" style={{ marginRight: 8 }} />
                Generate Report
              </Button>
            </View>
          </Card>
        )}
      </ScrollView>

      {/* Add Scholar Modal */}
      <Modal
        visible={showAddScholar}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Scholar</Text>
            <TouchableOpacity onPress={() => setShowAddScholar(false)}>
              <Text style={styles.cancelButton}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Input
              label="Scholar Name"
              value={scholarForm.name}
              onChangeText={(text) => setScholarForm({...scholarForm, name: text})}
              placeholder="Enter scholar name"
            />
            <Input
              label="Age"
              value={scholarForm.age}
              onChangeText={(text) => setScholarForm({...scholarForm, age: text})}
              keyboardType="numeric"
              placeholder="Enter age"
            />
            <Input
              label="Education Level"
              value={scholarForm.education}
              onChangeText={(text) => setScholarForm({...scholarForm, education: text})}
              placeholder="e.g., 10th Grade, Graduation, etc."
            />
            <Input
              label="Scholarship Amount (₹)"
              value={scholarForm.amount}
              onChangeText={(text) => setScholarForm({...scholarForm, amount: text})}
              keyboardType="numeric"
              placeholder="Enter scholarship amount"
            />
            <Button onPress={handleAddScholar}>
              {t('save')}
            </Button>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    backgroundColor: '#8B5CF6',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 16,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#374151',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  searchCard: {
    marginBottom: 16,
    padding: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  filtersCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 16,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#8B5CF6',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  scholarsCard: {
    marginBottom: 16,
  },
  scholarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  scholarAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  scholarInitial: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  scholarInfo: {
    flex: 1,
  },
  scholarName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  scholarEducation: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 2,
  },
  scholarAmount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#059669',
    marginBottom: 2,
  },
  scholarDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  scholarStatus: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    marginTop: 4,
  },
  actionsCard: {
    marginBottom: 32,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#374151',
  },
  cancelButton: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#059669',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
});
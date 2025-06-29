import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  Plus, 
  Users, 
  Stethoscope, 
  MapPin, 
  Calendar,
  Search,
  UserPlus,
  Truck
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getTranslation } from '@/utils/translations';

export default function MedicalScreen() {
  const { user, language } = useAuth();
  const { patients, addPatient, opdWheels, addOPDWheel } = useData();
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showOPDWheel, setShowOPDWheel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Route guard - redirect if user doesn't have access to medical
  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'doctor') {
      router.replace('/(tabs)');
      return;
    }
  }, [user]);

  // Form states
  const [patientForm, setPatientForm] = useState({
    name: '',
    age: '',
    gender: 'male',
    phone: '',
    address: '',
    diagnosis: '',
    prescription: '',
  });

  const [opdForm, setOPDForm] = useState({
    location: '',
    inchargeName: '',
    inchargePhone: '',
    patientsCount: '',
  });

  const t = (key: string) => getTranslation(key, language);

  // Don't render if user doesn't have access
  if (!user || (user.role !== 'admin' && user.role !== 'doctor')) {
    return null;
  }

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPatient = () => {
    if (patientForm.name && patientForm.age && patientForm.diagnosis && user) {
      addPatient({
        ...patientForm,
        age: parseInt(patientForm.age),
        gender: patientForm.gender as 'male' | 'female' | 'other',
        opdEventId: 'event1',
        visitDate: new Date().toISOString().split('T')[0],
        doctorId: user.id,
      });
      setPatientForm({
        name: '',
        age: '',
        gender: 'male',
        phone: '',
        address: '',
        diagnosis: '',
        prescription: '',
      });
      setShowAddPatient(false);
    }
  };

  const handleAddOPDWheel = () => {
    if (opdForm.location && opdForm.inchargeName && user) {
      addOPDWheel({
        ...opdForm,
        patientsCount: parseInt(opdForm.patientsCount) || 0,
        date: new Date().toISOString().split('T')[0],
        doctorId: user.id,
      });
      setOPDForm({
        location: '',
        inchargeName: '',
        inchargePhone: '',
        patientsCount: '',
      });
      setShowOPDWheel(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('medical')}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddPatient(true)}
        >
          <Plus size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Users size={32} color="#DC2626" />
              <View style={styles.statText}>
                <Text style={styles.statValue}>{patients.length}</Text>
                <Text style={styles.statLabel}>Total {t('patients')}</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Truck size={32} color="#0284C7" />
              <View style={styles.statText}>
                <Text style={styles.statValue}>{opdWheels.length}</Text>
                <Text style={styles.statLabel}>{t('opdOnWheels')}</Text>
              </View>
            </View>
          </Card>
        </View>

        <Card style={styles.searchCard}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" style={styles.searchIcon} />
            <Input
              placeholder={`${t('search')} ${t('patients')}...`}
              value={searchQuery}
              onChangeText={setSearchQuery}
              containerStyle={styles.searchInput}
            />
          </View>
        </Card>

        <Card style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <Button
              onPress={() => setShowAddPatient(true)}
              variant="secondary"
              style={styles.actionButton}
            >
              <UserPlus size={20} color="#ffffff" style={{ marginRight: 8 }} />
              {t('addPatient')}
            </Button>
            <Button
              onPress={() => setShowOPDWheel(true)}
              style={styles.actionButton}
            >
              <Truck size={20} color="#ffffff" style={{ marginRight: 8 }} />
              OPD on Wheels
            </Button>
          </View>
        </Card>

        <Card style={styles.patientsCard}>
          <Text style={styles.cardTitle}>Recent {t('patients')}</Text>
          {filteredPatients.length === 0 ? (
            <View style={styles.emptyState}>
              <Stethoscope size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No patients yet</Text>
              <Text style={styles.emptySubtext}>Add your first patient to get started</Text>
            </View>
          ) : (
            filteredPatients.map((patient) => (
              <View key={patient.id} style={styles.patientItem}>
                <View style={styles.patientAvatar}>
                  <Text style={styles.patientInitial}>
                    {patient.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.patientInfo}>
                  <Text style={styles.patientName}>{patient.name}</Text>
                  <Text style={styles.patientDetails}>
                    {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)} • Age {patient.age}
                  </Text>
                  <Text style={styles.patientDiagnosis}>
                    Diagnosis: {patient.diagnosis}
                  </Text>
                  <Text style={styles.patientDate}>
                    Visit: {new Date(patient.visitDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.patientStatus}>
                  <View style={styles.statusDot} />
                </View>
              </View>
            ))
          )}
        </Card>

        <Card style={styles.opdWheelCard}>
          <Text style={styles.cardTitle}>{t('opdOnWheels')} Instances</Text>
          {opdWheels.length === 0 ? (
            <View style={styles.emptyState}>
              <Truck size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No OPD on Wheels yet</Text>
              <Text style={styles.emptySubtext}>Schedule your first mobile clinic</Text>
            </View>
          ) : (
            opdWheels.map((opd) => (
              <View key={opd.id} style={styles.opdItem}>
                <View style={styles.opdIcon}>
                  <MapPin size={24} color="#0284C7" />
                </View>
                <View style={styles.opdInfo}>
                  <Text style={styles.opdLocation}>{opd.location}</Text>
                  <Text style={styles.opdDetails}>
                    In-charge: {opd.inchargeName}
                  </Text>
                  <Text style={styles.opdStats}>
                    Patients: {opd.patientsCount} • Date: {new Date(opd.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          )}
        </Card>
      </ScrollView>

      {/* Add Patient Modal */}
      <Modal
        visible={showAddPatient}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('addPatient')}</Text>
            <TouchableOpacity onPress={() => setShowAddPatient(false)}>
              <Text style={styles.cancelButton}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Input
              label="Patient Name"
              value={patientForm.name}
              onChangeText={(text) => setPatientForm({...patientForm, name: text})}
              placeholder="Enter patient name"
            />
            <Input
              label="Age"
              value={patientForm.age}
              onChangeText={(text) => setPatientForm({...patientForm, age: text})}
              keyboardType="numeric"
              placeholder="Enter age"
            />
            <Input
              label="Phone Number"
              value={patientForm.phone}
              onChangeText={(text) => setPatientForm({...patientForm, phone: text})}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
            />
            <Input
              label="Address"
              value={patientForm.address}
              onChangeText={(text) => setPatientForm({...patientForm, address: text})}
              placeholder="Enter address"
              multiline
            />
            <Input
              label="Diagnosis"
              value={patientForm.diagnosis}
              onChangeText={(text) => setPatientForm({...patientForm, diagnosis: text})}
              placeholder="Enter diagnosis"
              multiline
            />
            <Input
              label="Prescription"
              value={patientForm.prescription}
              onChangeText={(text) => setPatientForm({...patientForm, prescription: text})}
              placeholder="Enter prescription details"
              multiline
            />
            <Button onPress={handleAddPatient}>
              {t('save')}
            </Button>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* OPD on Wheels Modal */}
      <Modal
        visible={showOPDWheel}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add OPD on Wheels</Text>
            <TouchableOpacity onPress={() => setShowOPDWheel(false)}>
              <Text style={styles.cancelButton}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Input
              label="Location"
              value={opdForm.location}
              onChangeText={(text) => setOPDForm({...opdForm, location: text})}
              placeholder="Enter location/area"
            />
            <Input
              label="In-charge Name"
              value={opdForm.inchargeName}
              onChangeText={(text) => setOPDForm({...opdForm, inchargeName: text})}
              placeholder="Enter in-charge name"
            />
            <Input
              label="In-charge Phone"
              value={opdForm.inchargePhone}
              onChangeText={(text) => setOPDForm({...opdForm, inchargePhone: text})}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
            />
            <Input
              label="Expected Patients"
              value={opdForm.patientsCount}
              onChangeText={(text) => setOPDForm({...opdForm, patientsCount: text})}
              keyboardType="numeric"
              placeholder="Enter expected patient count"
            />
            <Button onPress={handleAddOPDWheel}>
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
    backgroundColor: '#DC2626',
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
    fontSize: 24,
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
  actionsCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 16,
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
  patientsCard: {
    marginBottom: 16,
  },
  patientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  patientInitial: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 2,
  },
  patientDiagnosis: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginBottom: 2,
  },
  patientDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  patientStatus: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  opdWheelCard: {
    marginBottom: 32,
  },
  opdItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  opdIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(2, 132, 199, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  opdInfo: {
    flex: 1,
  },
  opdLocation: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  opdDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 2,
  },
  opdStats: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
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
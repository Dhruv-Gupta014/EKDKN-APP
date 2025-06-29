import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  Plus, 
  Users, 
  UserCheck, 
  GraduationCap, 
  Search,
  Calendar,
  Award
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getTranslation } from '@/utils/translations';

export default function EducationScreen() {
  const { user, language } = useAuth();
  const { students, addStudent, markAttendance, addLearningOutcome } = useData();
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showLearningOutcome, setShowLearningOutcome] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Route guard - redirect if user doesn't have access to education
  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'teacher') {
      router.replace('/(tabs)');
      return;
    }
  }, [user]);

  // Form states
  const [studentForm, setStudentForm] = useState({
    name: '',
    age: '',
    grade: '',
    parentName: '',
    parentPhone: '',
    address: '',
  });

  const [outcomeForm, setOutcomeForm] = useState({
    studentId: '',
    subject: '',
    marks: '',
    maxMarks: '',
    examType: '',
  });

  const t = (key: string) => getTranslation(key, language);

  // Don't render if user doesn't have access
  if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
    return null;
  }

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStudent = () => {
    if (studentForm.name && studentForm.age && studentForm.grade) {
      addStudent({
        ...studentForm,
        age: parseInt(studentForm.age),
        centerId: user?.centerId || 'center1',
        enrollmentDate: new Date().toISOString().split('T')[0],
        isActive: true,
      });
      setStudentForm({
        name: '',
        age: '',
        grade: '',
        parentName: '',
        parentPhone: '',
        address: '',
      });
      setShowAddStudent(false);
    }
  };

  const handleMarkAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    if (user) {
      markAttendance({
        studentId,
        teacherId: user.id,
        date: new Date().toISOString().split('T')[0],
        status,
      });
    }
  };

  const handleAddLearningOutcome = () => {
    if (outcomeForm.studentId && outcomeForm.subject && outcomeForm.marks && user) {
      addLearningOutcome({
        ...outcomeForm,
        teacherId: user.id,
        marks: parseInt(outcomeForm.marks),
        maxMarks: parseInt(outcomeForm.maxMarks) || 100,
        date: new Date().toISOString().split('T')[0],
      });
      setOutcomeForm({
        studentId: '',
        subject: '',
        marks: '',
        maxMarks: '',
        examType: '',
      });
      setShowLearningOutcome(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('education')}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddStudent(true)}
        >
          <Plus size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Users size={32} color="#059669" />
              <View style={styles.statText}>
                <Text style={styles.statValue}>{students.length}</Text>
                <Text style={styles.statLabel}>{t('students')}</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <UserCheck size={32} color="#0284C7" />
              <View style={styles.statText}>
                <Text style={styles.statValue}>92%</Text>
                <Text style={styles.statLabel}>{t('attendance')}</Text>
              </View>
            </View>
          </Card>
        </View>

        <Card style={styles.searchCard}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" style={styles.searchIcon} />
            <Input
              placeholder={`${t('search')} ${t('students')}...`}
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
              onPress={() => setShowAttendance(true)}
              variant="secondary"
              style={styles.actionButton}
            >
              <UserCheck size={20} color="#ffffff" style={{ marginRight: 8 }} />
              {t('markAttendance')}
            </Button>
            <Button
              onPress={() => setShowLearningOutcome(true)}
              style={styles.actionButton}
            >
              <Award size={20} color="#ffffff" style={{ marginRight: 8 }} />
              Add Learning Outcome
            </Button>
          </View>
        </Card>

        <Card style={styles.studentsCard}>
          <Text style={styles.cardTitle}>{t('students')} List</Text>
          {filteredStudents.map((student) => (
            <View key={student.id} style={styles.studentItem}>
              <View style={styles.studentAvatar}>
                <Text style={styles.studentInitial}>
                  {student.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentDetails}>
                  Grade {student.grade} • Age {student.age}
                </Text>
                <Text style={styles.studentParent}>
                  Parent: {student.parentName}
                </Text>
              </View>
              <View style={styles.studentActions}>
                <TouchableOpacity
                  style={[styles.attendanceButton, styles.presentButton]}
                  onPress={() => handleMarkAttendance(student.id, 'present')}
                >
                  <UserCheck size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>

      {/* Add Student Modal */}
      <Modal
        visible={showAddStudent}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('addStudent')}</Text>
            <TouchableOpacity onPress={() => setShowAddStudent(false)}>
              <Text style={styles.cancelButton}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Input
              label="Student Name"
              value={studentForm.name}
              onChangeText={(text) => setStudentForm({...studentForm, name: text})}
              placeholder="Enter student name"
            />
            <Input
              label="Age"
              value={studentForm.age}
              onChangeText={(text) => setStudentForm({...studentForm, age: text})}
              keyboardType="numeric"
              placeholder="Enter age"
            />
            <Input
              label="Grade/Class"
              value={studentForm.grade}
              onChangeText={(text) => setStudentForm({...studentForm, grade: text})}
              placeholder="e.g., 5th, 6th"
            />
            <Input
              label="Parent Name"
              value={studentForm.parentName}
              onChangeText={(text) => setStudentForm({...studentForm, parentName: text})}
              placeholder="Enter parent name"
            />
            <Input
              label="Parent Phone"
              value={studentForm.parentPhone}
              onChangeText={(text) => setStudentForm({...studentForm, parentPhone: text})}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
            />
            <Input
              label="Address"
              value={studentForm.address}
              onChangeText={(text) => setStudentForm({...studentForm, address: text})}
              placeholder="Enter address"
              multiline
            />
            <Button onPress={handleAddStudent}>
              {t('save')}
            </Button>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Attendance Modal */}
      <Modal
        visible={showAttendance}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('markAttendance')}</Text>
            <TouchableOpacity onPress={() => setShowAttendance(false)}>
              <Text style={styles.cancelButton}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.dateText}>
              Date: {new Date().toLocaleDateString()}
            </Text>
            {students.map((student) => (
              <Card key={student.id} style={styles.attendanceItem}>
                <View style={styles.attendanceStudent}>
                  <View style={styles.studentAvatar}>
                    <Text style={styles.studentInitial}>
                      {student.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    <Text style={styles.studentDetails}>Grade {student.grade}</Text>
                  </View>
                </View>
                <View style={styles.attendanceButtons}>
                  <TouchableOpacity
                    style={[styles.attendanceButton, styles.presentButton]}
                    onPress={() => handleMarkAttendance(student.id, 'present')}
                  >
                    <Text style={styles.attendanceButtonText}>P</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.attendanceButton, styles.absentButton]}
                    onPress={() => handleMarkAttendance(student.id, 'absent')}
                  >
                    <Text style={styles.attendanceButtonText}>A</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.attendanceButton, styles.lateButton]}
                    onPress={() => handleMarkAttendance(student.id, 'late')}
                  >
                    <Text style={styles.attendanceButtonText}>L</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Learning Outcome Modal */}
      <Modal
        visible={showLearningOutcome}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Learning Outcome</Text>
            <TouchableOpacity onPress={() => setShowLearningOutcome(false)}>
              <Text style={styles.cancelButton}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Input
              label="Subject"
              value={outcomeForm.subject}
              onChangeText={(text) => setOutcomeForm({...outcomeForm, subject: text})}
              placeholder="e.g., Mathematics, English"
            />
            <Input
              label="Exam Type"
              value={outcomeForm.examType}
              onChangeText={(text) => setOutcomeForm({...outcomeForm, examType: text})}
              placeholder="e.g., Unit Test, Monthly Test"
            />
            <Input
              label="Marks Obtained"
              value={outcomeForm.marks}
              onChangeText={(text) => setOutcomeForm({...outcomeForm, marks: text})}
              keyboardType="numeric"
              placeholder="Enter marks obtained"
            />
            <Input
              label="Maximum Marks"
              value={outcomeForm.maxMarks}
              onChangeText={(text) => setOutcomeForm({...outcomeForm, maxMarks: text})}
              keyboardType="numeric"
              placeholder="Enter maximum marks"
            />
            <Button onPress={handleAddLearningOutcome}>
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
    backgroundColor: '#059669',
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
  studentsCard: {
    marginBottom: 32,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  studentInitial: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  studentDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 2,
  },
  studentParent: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  studentActions: {
    flexDirection: 'row',
  },
  attendanceButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  presentButton: {
    backgroundColor: '#059669',
  },
  absentButton: {
    backgroundColor: '#DC2626',
  },
  lateButton: {
    backgroundColor: '#EA580C',
  },
  attendanceButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
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
  dateText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  attendanceItem: {
    marginBottom: 12,
    padding: 16,
  },
  attendanceStudent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  attendanceButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Plus, 
  Upload as UploadIcon, 
  Camera, 
  Video,
  Image as ImageIcon,
  FileText,
  Calendar,
  Tag,
  Users,
  Activity,
  Stethoscope,
  GraduationCap
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getTranslation } from '@/utils/translations';

interface MediaUpload {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'photo' | 'video' | 'document';
  url: string;
  uploadedBy: string;
  uploadedDate: string;
  studentIds?: string[];
  patientIds?: string[];
}

export default function UploadScreen() {
  const { user, language } = useAuth();
  const { students, patients } = useData();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'photo' | 'video' | 'document'>('photo');
  const [uploads, setUploads] = useState<MediaUpload[]>([]);

  // Form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: '',
    studentIds: [] as string[],
    patientIds: [] as string[],
  });

  const t = (key: string) => getTranslation(key, language);

  // Role-based categories
  const getCategories = () => {
    switch (user?.role) {
      case 'teacher':
        return [
          { value: 'class_activity', label: 'Class Activity', color: '#059669' },
          { value: 'sports', label: 'Sports', color: '#EA580C' },
          { value: 'cultural', label: 'Cultural Event', color: '#8B5CF6' },
          { value: 'achievement', label: 'Student Achievement', color: '#F59E0B' },
          { value: 'daily_activity', label: 'Daily Activity', color: '#0284C7' },
          { value: 'assignment', label: 'Assignment/Test', color: '#DC2626' },
          { value: 'project', label: 'Project Work', color: '#059669' },
        ];
      case 'doctor':
        return [
          { value: 'opd_camp', label: 'OPD Camp', color: '#DC2626' },
          { value: 'medical_report', label: 'Medical Report', color: '#0284C7' },
          { value: 'prescription', label: 'Prescription', color: '#059669' },
          { value: 'health_checkup', label: 'Health Checkup', color: '#8B5CF6' },
          { value: 'vaccination', label: 'Vaccination Drive', color: '#F59E0B' },
          { value: 'awareness', label: 'Health Awareness', color: '#EA580C' },
        ];
      case 'admin':
        return [
          { value: 'class_activity', label: 'Class Activity', color: '#059669' },
          { value: 'sports', label: 'Sports', color: '#EA580C' },
          { value: 'cultural', label: 'Cultural Event', color: '#8B5CF6' },
          { value: 'achievement', label: 'Achievement', color: '#F59E0B' },
          { value: 'opd_camp', label: 'OPD Camp', color: '#DC2626' },
          { value: 'medical_report', label: 'Medical Report', color: '#0284C7' },
          { value: 'center_activity', label: 'Center Activity', color: '#7C3AED' },
          { value: 'donation_event', label: 'Donation Event', color: '#059669' },
        ];
      default:
        return [];
    }
  };

  const categories = getCategories();

  const handleCameraCapture = () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Camera Not Available',
        'Camera functionality is not available on web. Please use the file upload option.',
        [{ text: 'OK' }]
      );
      return;
    }
    // Camera implementation would go here for mobile
    Alert.alert('Camera', 'Camera functionality will be implemented for mobile app');
  };

  const handleFileUpload = () => {
    // Simulate file upload with different mock URLs based on type and role
    let mockUrl = '';
    
    if (uploadType === 'photo') {
      mockUrl = user?.role === 'doctor' 
        ? 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400'
        : 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400';
    } else if (uploadType === 'video') {
      mockUrl = 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4';
    } else {
      mockUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    }
    
    if (uploadForm.title && uploadForm.description && uploadForm.category && user) {
      const newUpload: MediaUpload = {
        id: Date.now().toString(),
        title: uploadForm.title,
        description: uploadForm.description,
        category: uploadForm.category,
        type: uploadType,
        url: mockUrl,
        uploadedBy: user.id,
        uploadedDate: new Date().toISOString().split('T')[0],
        studentIds: uploadForm.studentIds,
        patientIds: uploadForm.patientIds,
      };
      
      setUploads(prev => [newUpload, ...prev]);
      setUploadForm({
        title: '',
        description: '',
        category: '',
        studentIds: [],
        patientIds: [],
      });
      setShowUploadModal(false);
      
      Alert.alert('Success', `${uploadType === 'photo' ? 'Photo' : uploadType === 'video' ? 'Video' : 'Document'} uploaded successfully!`);
    } else {
      Alert.alert('Error', 'Please fill in all required fields');
    }
  };

  const getCategoryColor = (category: string) => {
    return categories.find(cat => cat.value === category)?.color || '#6B7280';
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(cat => cat.value === category)?.label || category;
  };

  const thisMonthUploads = uploads.filter(upload => {
    const uploadDate = new Date(upload.uploadedDate);
    const now = new Date();
    return uploadDate.getMonth() === now.getMonth() && uploadDate.getFullYear() === now.getFullYear();
  });

  const photoUploads = thisMonthUploads.filter(upload => upload.type === 'photo');
  const videoUploads = thisMonthUploads.filter(upload => upload.type === 'video');
  const documentUploads = thisMonthUploads.filter(upload => upload.type === 'document');

  const getUploadTitle = () => {
    switch (user?.role) {
      case 'teacher':
        return 'Educational Content';
      case 'doctor':
        return 'Medical Reports & Documentation';
      case 'admin':
        return 'All Content Management';
      default:
        return 'Upload Content';
    }
  };

  const getUploadSubtitle = () => {
    switch (user?.role) {
      case 'teacher':
        return 'Share photos and videos of your classes and activities with donors';
      case 'doctor':
        return 'Upload medical reports, prescriptions, and OPD camp documentation';
      case 'admin':
        return 'Manage all educational and medical content across centers';
      default:
        return 'Upload and manage content';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{getUploadTitle()}</Text>
          <Text style={styles.headerSubtitle}>
            {user?.role === 'teacher' ? 'Teacher' : user?.role === 'doctor' ? 'Doctor' : 'Administrator'} Panel
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: user?.role === 'doctor' ? '#DC2626' : user?.role === 'teacher' ? '#059669' : '#8B5CF6' }]}
          onPress={() => setShowUploadModal(true)}
        >
          <Plus size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <ImageIcon size={32} color="#059669" />
              <View style={styles.statText}>
                <Text style={styles.statValue}>{photoUploads.length}</Text>
                <Text style={styles.statLabel}>Photos Uploaded</Text>
                <Text style={styles.statSubtext}>This month</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Video size={32} color="#8B5CF6" />
              <View style={styles.statText}>
                <Text style={styles.statValue}>{videoUploads.length}</Text>
                <Text style={styles.statLabel}>Videos Uploaded</Text>
                <Text style={styles.statSubtext}>This month</Text>
              </View>
            </View>
          </Card>

          {user?.role === 'doctor' && (
            <Card style={styles.statCard}>
              <View style={styles.statContent}>
                <FileText size={32} color="#DC2626" />
                <View style={styles.statText}>
                  <Text style={styles.statValue}>{documentUploads.length}</Text>
                  <Text style={styles.statLabel}>Documents</Text>
                  <Text style={styles.statSubtext}>This month</Text>
                </View>
              </View>
            </Card>
          )}
        </View>

        <Card style={styles.uploadCard}>
          <View style={styles.uploadCardHeader}>
            {user?.role === 'teacher' && <GraduationCap size={24} color="#059669" />}
            {user?.role === 'doctor' && <Stethoscope size={24} color="#DC2626" />}
            {user?.role === 'admin' && <Activity size={24} color="#8B5CF6" />}
            <View style={styles.uploadCardText}>
              <Text style={styles.cardTitle}>Quick Upload</Text>
              <Text style={styles.cardSubtitle}>{getUploadSubtitle()}</Text>
            </View>
          </View>
          
          <View style={styles.uploadButtons}>
            <Button
              onPress={() => {
                setUploadType('photo');
                setShowUploadModal(true);
              }}
              variant="secondary"
              style={styles.uploadButton}
            >
              <ImageIcon size={20} color="#ffffff" style={{ marginRight: 8 }} />
              Upload Photos
            </Button>
            <Button
              onPress={() => {
                setUploadType('video');
                setShowUploadModal(true);
              }}
              style={styles.uploadButton}
            >
              <Video size={20} color="#ffffff" style={{ marginRight: 8 }} />
              Upload Videos
            </Button>
            {user?.role === 'doctor' && (
              <Button
                onPress={() => {
                  setUploadType('document');
                  setShowUploadModal(true);
                }}
                variant="secondary"
                style={[styles.uploadButton, { backgroundColor: '#DC2626' }]}
              >
                <FileText size={20} color="#ffffff" style={{ marginRight: 8 }} />
                Documents
              </Button>
            )}
          </View>
        </Card>

        <Card style={styles.recentUploads}>
          <Text style={styles.cardTitle}>Recent Uploads</Text>
          {uploads.length === 0 ? (
            <View style={styles.emptyState}>
              <UploadIcon size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No uploads yet</Text>
              <Text style={styles.emptySubtext}>
                {user?.role === 'teacher' 
                  ? 'Start sharing your classroom activities'
                  : user?.role === 'doctor'
                  ? 'Start uploading medical documentation'
                  : 'Start managing content uploads'
                }
              </Text>
            </View>
          ) : (
            uploads.map((upload) => (
              <View key={upload.id} style={styles.uploadItem}>
                <View style={[styles.uploadIcon, { backgroundColor: getCategoryColor(upload.category) + '20' }]}>
                  {upload.type === 'photo' ? (
                    <ImageIcon size={24} color={getCategoryColor(upload.category)} />
                  ) : upload.type === 'video' ? (
                    <Video size={24} color={getCategoryColor(upload.category)} />
                  ) : (
                    <FileText size={24} color={getCategoryColor(upload.category)} />
                  )}
                </View>
                <View style={styles.uploadInfo}>
                  <Text style={styles.uploadTitle}>{upload.title}</Text>
                  <Text style={styles.uploadCategory}>
                    {getCategoryLabel(upload.category)}
                  </Text>
                  <Text style={styles.uploadDescription} numberOfLines={2}>
                    {upload.description}
                  </Text>
                  <Text style={styles.uploadDate}>
                    {new Date(upload.uploadedDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={[styles.typeBadge, { backgroundColor: getCategoryColor(upload.category) }]}>
                  <Text style={styles.typeBadgeText}>
                    {upload.type === 'photo' ? 'Photo' : upload.type === 'video' ? 'Video' : 'Doc'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </Card>

        <Card style={styles.guidelinesCard}>
          <Text style={styles.cardTitle}>Upload Guidelines</Text>
          <View style={styles.guidelinesList}>
            {user?.role === 'teacher' && (
              <>
                <View style={styles.guidelineItem}>
                  <View style={styles.guidelineDot} />
                  <Text style={styles.guidelineText}>
                    Ensure all photos/videos show educational activities
                  </Text>
                </View>
                <View style={styles.guidelineItem}>
                  <View style={styles.guidelineDot} />
                  <Text style={styles.guidelineText}>
                    Get proper consent before including students in media
                  </Text>
                </View>
                <View style={styles.guidelineItem}>
                  <View style={styles.guidelineDot} />
                  <Text style={styles.guidelineText}>
                    Upload class activities, assignments, and student achievements
                  </Text>
                </View>
              </>
            )}
            {user?.role === 'doctor' && (
              <>
                <View style={styles.guidelineItem}>
                  <View style={styles.guidelineDot} />
                  <Text style={styles.guidelineText}>
                    Maintain patient confidentiality in all uploads
                  </Text>
                </View>
                <View style={styles.guidelineItem}>
                  <View style={styles.guidelineDot} />
                  <Text style={styles.guidelineText}>
                    Upload medical reports, prescriptions, and OPD documentation
                  </Text>
                </View>
                <View style={styles.guidelineItem}>
                  <View style={styles.guidelineDot} />
                  <Text style={styles.guidelineText}>
                    Ensure all medical documents are properly categorized
                  </Text>
                </View>
              </>
            )}
            {user?.role === 'admin' && (
              <>
                <View style={styles.guidelineItem}>
                  <View style={styles.guidelineDot} />
                  <Text style={styles.guidelineText}>
                    Review and approve all content before public sharing
                  </Text>
                </View>
                <View style={styles.guidelineItem}>
                  <View style={styles.guidelineDot} />
                  <Text style={styles.guidelineText}>
                    Manage both educational and medical content uploads
                  </Text>
                </View>
              </>
            )}
            <View style={styles.guidelineItem}>
              <View style={styles.guidelineDot} />
              <Text style={styles.guidelineText}>
                Add descriptive titles and categories for better organization
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <View style={styles.guidelineDot} />
              <Text style={styles.guidelineText}>
                Upload regularly to keep stakeholders engaged
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      {/* Upload Modal */}
      <Modal
        visible={showUploadModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Upload {uploadType === 'photo' ? 'Photos' : uploadType === 'video' ? 'Videos' : 'Documents'}
            </Text>
            <TouchableOpacity onPress={() => setShowUploadModal(false)}>
              <Text style={styles.cancelButton}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Input
              label="Title *"
              value={uploadForm.title}
              onChangeText={(text) => setUploadForm({...uploadForm, title: text})}
              placeholder={user?.role === 'doctor' ? "e.g., OPD Camp Report" : "e.g., Math Class Activity"}
            />
            
            <View style={styles.categorySection}>
              <Text style={styles.categoryLabel}>Category *</Text>
              <View style={styles.categoryOptions}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.value}
                    style={[
                      styles.categoryOption,
                      uploadForm.category === category.value && styles.selectedCategory,
                      { borderColor: category.color }
                    ]}
                    onPress={() => setUploadForm({...uploadForm, category: category.value})}
                  >
                    <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                    <Text style={[
                      styles.categoryText,
                      uploadForm.category === category.value && { color: category.color }
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Input
              label="Description *"
              value={uploadForm.description}
              onChangeText={(text) => setUploadForm({...uploadForm, description: text})}
              placeholder={
                user?.role === 'doctor' 
                  ? "Describe the medical activity or report details..."
                  : "Describe what's happening in these photos/videos..."
              }
              multiline
              numberOfLines={4}
            />

            <View style={styles.uploadMethodSection}>
              <Text style={styles.uploadMethodLabel}>Upload Method</Text>
              <View style={styles.uploadMethods}>
                {uploadType !== 'document' && (
                  <Button
                    onPress={handleCameraCapture}
                    variant="secondary"
                    style={styles.uploadMethodButton}
                  >
                    <Camera size={20} color="#ffffff" style={{ marginRight: 8 }} />
                    Camera
                  </Button>
                )}
                <Button
                  onPress={handleFileUpload}
                  style={styles.uploadMethodButton}
                >
                  <FileText size={20} color="#ffffff" style={{ marginRight: 8 }} />
                  Choose Files
                </Button>
              </View>
            </View>
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
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#374151',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 2,
  },
  addButton: {
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
  statSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  uploadCard: {
    marginBottom: 16,
  },
  uploadCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadCardText: {
    marginLeft: 12,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  uploadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  uploadButton: {
    flex: 1,
    minWidth: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentUploads: {
    marginBottom: 16,
  },
  uploadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  uploadInfo: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  uploadCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  uploadDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  uploadDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  guidelinesCard: {
    marginBottom: 32,
  },
  guidelinesList: {
    gap: 12,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  guidelineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
    marginTop: 6,
    marginRight: 12,
  },
  guidelineText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    flex: 1,
    lineHeight: 20,
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
  categorySection: {
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: '#F0FDF4',
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  uploadMethodSection: {
    marginTop: 16,
  },
  uploadMethodLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  uploadMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  uploadMethodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
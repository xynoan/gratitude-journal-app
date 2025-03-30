import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { GratitudeEntry } from '../utils/types';
import { getEntries, deleteEntry } from '../utils/storage';
import { format, parseISO } from 'date-fns';

const EntryDetailScreen: React.FC = () => {
  const theme = useTheme();
  const params = useLocalSearchParams();
  const [entry, setEntry] = useState<GratitudeEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const entryId = params.id as string;

  useEffect(() => {
    loadEntry();
  }, [entryId]);

  const loadEntry = async () => {
    try {
      setLoading(true);
      const entries = await getEntries();
      const foundEntry = entries.find(e => e.id === entryId);
      setEntry(foundEntry || null);
    } catch (error) {
      console.error('Error loading entry:', error);
      Alert.alert('Error', 'Failed to load entry details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              if (entry) {
                await deleteEntry(entry.id);
                router.back();
              }
            } catch (error) {
              console.error('Error deleting entry:', error);
              Alert.alert('Error', 'Failed to delete entry.');
            }
          }
        },
      ]
    );
  };

  const handleEdit = () => {
    if (entry) {
      router.push({
        pathname: '/new-entry',
        params: { id: entry.id }
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'EEEE, MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!entry) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          Entry not found or has been deleted.
        </Text>
        <TouchableOpacity 
          style={[styles.errorButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.back()}
        >
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Gratitude Entry
        </Text>
        <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={22} color={theme.colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dateContainer}>
          <Text style={[styles.date, { color: theme.colors.primary }]}>
            {formatDate(entry.date)}
          </Text>
          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleEdit}
          >
            <Ionicons name="create-outline" size={16} color="#FFFFFF" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {entry.tags && entry.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {entry.tags.map((tag, index) => (
              <View 
                key={index} 
                style={[styles.tag, { backgroundColor: theme.colors.secondary }]}
              >
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.entriesContainer}>
          {entry.entries.map((item, index) => (
            <View 
              key={index} 
              style={[
                styles.entryItem, 
                { 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                }
              ]}
            >
              <Text style={[styles.entryNumber, { color: theme.colors.primary }]}>
                {index + 1}
              </Text>
              <Text style={[styles.entryText, { color: theme.colors.text }]}>
                {item}
              </Text>
            </View>
          ))}
        </View>

        {entry.photos && entry.photos.length > 0 && (
          <View style={styles.photosSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Photos
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photosContainer}
            >
              {entry.photos.map((photo, index) => (
                <Image 
                  key={index} 
                  source={{ uri: photo }} 
                  style={styles.photo} 
                />
              ))}
            </ScrollView>
          </View>
        )}

        {entry.notes && (
          <View style={styles.notesSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Additional Notes
            </Text>
            <View 
              style={[
                styles.notesContainer, 
                { 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                }
              ]}
            >
              <Text style={[styles.notesText, { color: theme.colors.text }]}>
                {entry.notes}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  actionButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  date: {
    fontSize: 22,
    fontWeight: '700',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  entriesContainer: {
    marginBottom: 24,
  },
  entryItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  entryNumber: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 12,
    marginTop: 2,
  },
  entryText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  photosSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  photosContainer: {
    paddingBottom: 8,
  },
  photo: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginRight: 12,
  },
  notesSection: {
    marginBottom: 24,
  },
  notesContainer: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default EntryDetailScreen; 
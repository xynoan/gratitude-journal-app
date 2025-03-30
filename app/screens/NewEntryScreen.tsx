import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import themeUtils from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import EntryForm from '../components/EntryForm';
import { getEntryByDate, getEntries } from '../utils/storage';
import { GratitudeEntry } from '../utils/types';
import { format } from 'date-fns';

const NewEntryScreen: React.FC = () => {
  const theme = themeUtils.useTheme();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [existingEntry, setExistingEntry] = useState<GratitudeEntry | undefined>(undefined);
  const entryId = params.id as string | undefined;

  useEffect(() => {
    if (entryId) {
      loadExistingEntry();
    } else {
      checkTodayEntry();
    }
  }, [entryId]);

  const loadExistingEntry = async () => {
    try {
      setLoading(true);
      const entries = await getEntries();
      const entry = entries.find(e => e.id === entryId);
      setExistingEntry(entry);
    } catch (error) {
      console.error('Error loading existing entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkTodayEntry = async () => {
    try {
      setLoading(true);
      const today = format(new Date(), 'yyyy-MM-dd');
      const entry = await getEntryByDate(today);
      setExistingEntry(entry || undefined);
    } catch (error) {
      console.error('Error checking today entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
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
          {existingEntry ? 'Edit Entry' : 'New Entry'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <EntryForm 
        onComplete={handleComplete}
        existingEntry={existingEntry}
      />
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
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
});

export default NewEntryScreen; 
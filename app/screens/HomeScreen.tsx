import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../utils/theme';
import { useAppContext } from '../context/AppContext';
import EntryCard from '../components/EntryCard';
import StreakCounter from '../components/StreakCounter';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { GratitudeEntry } from '../utils/types';
import { getEntries, updateStreak } from '../utils/storage';
import { format } from 'date-fns';

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const { streak, isAuthenticated, authenticate } = useAppContext();
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasEntryForToday, setHasEntryForToday] = useState(false);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        const success = await authenticate();
        if (!success) {
          router.replace('/auth');
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, authenticate]);

  // Load entries
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      
      // Get all entries and sort by date (newest first)
      const allEntries = await getEntries();
      const sortedEntries = allEntries.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setEntries(sortedEntries);
      
      // Check if there's an entry for today
      const today = format(new Date(), 'yyyy-MM-dd');
      const hasTodayEntry = sortedEntries.some(entry => entry.date === today);
      setHasEntryForToday(hasTodayEntry);
      
      // Update streak based on current date
      await updateStreak();
      
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEntries();
    setRefreshing(false);
  };

  const handleEntryPress = (entry: GratitudeEntry) => {
    router.push({
      pathname: '/entry/[id]',
      params: { id: entry.id }
    });
  };

  const handleNewEntry = () => {
    router.push('/new-entry');
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name="journal-outline" 
        size={80} 
        color={theme.colors.textSecondary} 
      />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        Start Your Gratitude Journey
      </Text>
      <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
        Add your first gratitude entry to begin reflecting on the positive aspects of your life.
      </Text>
      <Button 
        title="Add Your First Entry" 
        onPress={handleNewEntry}
        style={styles.emptyButton}
      />
    </View>
  );

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
        <Text style={[styles.title, { color: theme.colors.text }]}>Gratitude Journal</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <StreakCounter streak={streak} />

      <View style={styles.listHeader}>
        <Text style={[styles.listTitle, { color: theme.colors.text }]}>
          Your Grateful Moments
        </Text>
        {entries.length > 0 && (
          <TouchableOpacity 
            style={[
              styles.newEntryButton, 
              { 
                backgroundColor: hasEntryForToday ? 
                  theme.colors.secondary : 
                  theme.colors.primary 
              }
            ]}
            onPress={handleNewEntry}
          >
            <Ionicons 
              name={hasEntryForToday ? "create-outline" : "add"} 
              size={24} 
              color="#FFFFFF" 
            />
            <Text style={styles.newEntryText}>
              {hasEntryForToday ? 'Edit Today\'s Entry' : 'New Entry'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EntryCard entry={item} onPress={handleEntryPress} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  newEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  newEntryText: {
    color: '#FFFFFF',
    marginLeft: 4,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyButton: {
    marginTop: 8,
  },
});

export default HomeScreen; 
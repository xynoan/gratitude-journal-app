import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

interface StreakCounterProps {
  streak: number;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ streak }) => {
  const theme = useTheme();

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          ...theme.shadows.small
        }
      ]}
    >
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name="flame" 
            size={24} 
            color={streak > 0 ? '#FF8C42' : theme.colors.textSecondary} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.streakCount, { color: theme.colors.text }]}>
            {streak}
          </Text>
          <Text style={[styles.streakLabel, { color: theme.colors.textSecondary }]}>
            {streak === 1 ? 'Day' : 'Days'}
          </Text>
        </View>
      </View>
      <Text style={[styles.streakMessage, { color: theme.colors.textSecondary }]}>
        {getStreakMessage(streak)}
      </Text>
    </View>
  );
};

const getStreakMessage = (streak: number): string => {
  if (streak === 0) return 'Start your gratitude streak today!';
  if (streak === 1) return 'You started your gratitude journey!';
  if (streak < 5) return 'Keep the momentum going!';
  if (streak < 10) return 'You\'re building a great habit!';
  if (streak < 30) return 'Impressive streak! Keep it up!';
  if (streak < 100) return 'Wow! You\'re a gratitude master!';
  return 'Incredible! Your positivity is inspiring!';
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  streakCount: {
    fontSize: 22,
    fontWeight: '700',
    marginRight: 6,
  },
  streakLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  streakMessage: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default StreakCounter; 
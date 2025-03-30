import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import themeUtils from '../utils/theme';
import { GratitudeEntry } from '../utils/types';
import { format, parseISO } from 'date-fns';

interface EntryCardProps {
  entry: GratitudeEntry;
  onPress: (entry: GratitudeEntry) => void;
}

const EntryCard: React.FC<EntryCardProps> = ({ entry, onPress }) => {
  const theme = themeUtils.useTheme();

  const formattedDate = () => {
    try {
      const date = parseISO(entry.date);
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      return entry.date;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          ...theme.shadows.small 
        }
      ]}
      onPress={() => onPress(entry)}
      activeOpacity={0.8}
    >
      <View style={styles.dateContainer}>
        <Text style={[styles.date, { color: theme.colors.primary }]}>
          {formattedDate()}
        </Text>
        {entry.tags && entry.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {entry.tags.slice(0, 2).map((tag, index) => (
              <View 
                key={index} 
                style={[
                  styles.tag, 
                  { backgroundColor: theme.colors.secondary }
                ]}
              >
                <Text style={[styles.tagText, { color: '#FFF' }]}>
                  {tag}
                </Text>
              </View>
            ))}
            {entry.tags.length > 2 && (
              <Text style={[styles.moreTag, { color: theme.colors.textSecondary }]}>
                +{entry.tags.length - 2}
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.entriesContainer}>
        {entry.entries.map((item, index) => (
          <Text 
            key={index} 
            style={[styles.entryText, { color: theme.colors.text }]}
            numberOfLines={2}
          >
            • {item}
          </Text>
        ))}
      </View>

      {entry.photos && entry.photos.length > 0 && (
        <View style={styles.photosContainer}>
          {entry.photos.slice(0, 3).map((photo, index) => (
            <Image 
              key={index} 
              source={{ uri: photo }} 
              style={styles.photo} 
            />
          ))}
          {entry.photos.length > 3 && (
            <View style={[styles.morePhotos, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
              <Text style={styles.morePhotosText}>+{entry.photos.length - 3}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    fontWeight: '600',
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moreTag: {
    fontSize: 12,
    marginLeft: 2,
  },
  entriesContainer: {
    marginBottom: 12,
  },
  entryText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  photosContainer: {
    flexDirection: 'row',
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 8,
  },
  morePhotos: {
    width: 70,
    height: 70,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  morePhotosText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default EntryCard; 
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import Button from './Button';
import { GratitudeEntry } from '../utils/types';
import { DEFAULT_PROMPTS, DEFAULT_TAGS } from '../utils/types';
import { format } from 'date-fns';
import { saveEntry } from '../utils/storage';

interface EntryFormProps {
  onComplete: () => void;
  existingEntry?: GratitudeEntry;
}

const EntryForm: React.FC<EntryFormProps> = ({ onComplete, existingEntry }) => {
  const theme = useTheme();
  const [entries, setEntries] = useState<string[]>(['', '', '']);
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prompts, setPrompts] = useState(DEFAULT_PROMPTS);

  // Initialize with existing entry if provided
  useEffect(() => {
    if (existingEntry) {
      setEntries(existingEntry.entries);
      setPhotos(existingEntry.photos || []);
      setSelectedTags(existingEntry.tags || []);
      setNotes(existingEntry.notes || '');
    }
  }, [existingEntry]);

  // Shuffle prompts to keep it fresh
  useEffect(() => {
    const shuffledPrompts = [...DEFAULT_PROMPTS]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    setPrompts(shuffledPrompts);
  }, []);

  const handleSave = async () => {
    // Validate entries
    const filledEntries = entries.filter(entry => entry.trim().length > 0);
    if (filledEntries.length === 0) {
      Alert.alert('Oops!', 'Please add at least one gratitude entry.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Create entry object
      const entryData: GratitudeEntry = {
        id: existingEntry?.id || Date.now().toString(),
        date: existingEntry?.date || format(new Date(), 'yyyy-MM-dd'),
        entries: filledEntries,
        photos,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        notes: notes.trim().length > 0 ? notes : undefined,
      };
      
      // Save to storage
      await saveEntry(entryData);
      
      // Notify completion
      onComplete();
    } catch (error) {
      console.error('Error saving entry:', error);
      Alert.alert('Error', 'Failed to save your gratitude entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoSelection = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photo library to add photos.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.heading, { color: theme.colors.text }]}>
        What are you grateful for today?
      </Text>
      
      {/* Entry inputs */}
      {entries.map((entry, index) => (
        <View key={index} style={styles.entryContainer}>
          <Text style={[styles.prompt, { color: theme.colors.textSecondary }]}>
            {prompts[index % prompts.length]?.text || `Entry ${index + 1}`}
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                color: theme.colors.text,
              }
            ]}
            value={entry}
            onChangeText={(text) => {
              const newEntries = [...entries];
              newEntries[index] = text;
              setEntries(newEntries);
            }}
            placeholder={`I'm grateful for...`}
            placeholderTextColor={theme.colors.textSecondary}
            multiline
          />
        </View>
      ))}
      
      {/* Photo section */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Photos (Optional)
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
          Add photos that represent what you're grateful for
        </Text>
        
        <View style={styles.photosContainer}>
          {photos.map((photo, index) => (
            <View key={index} style={styles.photoContainer}>
              <Image source={{ uri: photo }} style={styles.photo} />
              <TouchableOpacity
                style={[styles.removePhoto, { backgroundColor: theme.colors.error }]}
                onPress={() => handleRemovePhoto(index)}
              >
                <Ionicons name="close" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
          
          {photos.length < 5 && (
            <TouchableOpacity
              style={[
                styles.addPhotoButton,
                { 
                  borderColor: theme.colors.primary,
                  backgroundColor: theme.colors.surface 
                }
              ]}
              onPress={handlePhotoSelection}
            >
              <Ionicons name="add" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Tags section */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Tags (Optional)
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
          Tag your entry to help you track what you're grateful for
        </Text>
        
        <View style={styles.tagsContainer}>
          {DEFAULT_TAGS.map((tag, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tagButton,
                {
                  backgroundColor: selectedTags.includes(tag)
                    ? theme.colors.primary
                    : theme.colors.surface,
                  borderColor: theme.colors.border,
                }
              ]}
              onPress={() => toggleTag(tag)}
            >
              <Text
                style={[
                  styles.tagText,
                  {
                    color: selectedTags.includes(tag)
                      ? '#FFFFFF'
                      : theme.colors.text,
                  }
                ]}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Notes section */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Additional Notes (Optional)
        </Text>
        <TextInput
          style={[
            styles.notesInput,
            { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.text,
            }
          ]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add any other thoughts..."
          placeholderTextColor={theme.colors.textSecondary}
          multiline
        />
      </View>
      
      {/* Submit button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Save Gratitude Entry"
          onPress={handleSave}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  entryContainer: {
    marginBottom: 20,
  },
  prompt: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  sectionContainer: {
    marginTop: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  photoContainer: {
    margin: 4,
    position: 'relative',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removePhoto: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagButton: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 24,
  },
});

export default EntryForm; 
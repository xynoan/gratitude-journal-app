import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch, 
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import themeUtils from '../utils/theme';
import { useAppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

type SettingItemProps = {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  toggle?: boolean;
  onToggle?: (value: boolean) => void;
  rightText?: string;
};

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  toggle,
  onToggle,
  rightText,
}) => {
  const theme = themeUtils.useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.settingItem, 
        { borderBottomColor: theme.colors.border }
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingIconContainer}>
        <Ionicons name={icon as any} size={22} color={theme.colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {toggle !== undefined && onToggle && (
        <Switch
          value={toggle}
          onValueChange={onToggle}
          trackColor={{ false: '#767577', true: theme.colors.primary }}
          thumbColor={'#f4f3f4'}
        />
      )}
      {rightText && (
        <Text style={[styles.settingRightText, { color: theme.colors.textSecondary }]}>
          {rightText}
        </Text>
      )}
      {onPress && !toggle && !rightText && (
        <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
};

const SettingsScreen: React.FC = () => {
  const theme = themeUtils.useTheme();
  const { 
    theme: themeMode, 
    setTheme, 
    fontSize, 
    setFontSize, 
    isBiometricEnabled, 
    toggleBiometric 
  } = useAppContext();

  const handleThemeChange = () => {
    Alert.alert(
      'Select Theme',
      'Choose your preferred theme',
      [
        { text: 'Light', onPress: () => setTheme('light') },
        { text: 'Dark', onPress: () => setTheme('dark') },
        { text: 'System', onPress: () => setTheme('system') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleFontSizeChange = () => {
    Alert.alert(
      'Select Font Size',
      'Choose your preferred font size',
      [
        { text: 'Small', onPress: () => setFontSize('small') },
        { text: 'Medium', onPress: () => setFontSize('medium') },
        { text: 'Large', onPress: () => setFontSize('large') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getThemeName = () => {
    switch (themeMode) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
      default: return 'System';
    }
  };

  const getFontSizeName = () => {
    switch (fontSize) {
      case 'small': return 'Small';
      case 'medium': return 'Medium';
      case 'large': return 'Large';
      default: return 'Medium';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            Appearance
          </Text>
          <SettingItem 
            icon="color-palette-outline"
            title="Theme"
            subtitle="Change the app's appearance"
            onPress={handleThemeChange}
            rightText={getThemeName()}
          />
          <SettingItem 
            icon="text-outline"
            title="Font Size"
            subtitle="Adjust text size throughout the app"
            onPress={handleFontSizeChange}
            rightText={getFontSizeName()}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            Security
          </Text>
          <SettingItem 
            icon="finger-print-outline"
            title="Biometric Authentication"
            subtitle="Secure your journal with fingerprint or face ID"
            toggle={isBiometricEnabled}
            onToggle={toggleBiometric}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            About
          </Text>
          <SettingItem 
            icon="information-circle-outline"
            title="About Gratitude Journal"
            subtitle="Learn about the app and its features"
            onPress={() => Alert.alert('About', 'Gratitude Journal v1.0\n\nA simple app to help you practice gratitude daily.')}
          />
          <SettingItem 
            icon="heart-outline"
            title="Rate the App"
            subtitle="If you enjoy using the app, please rate it"
            onPress={() => Alert.alert('Rate', 'This would open the app store rating page in a real app.')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  settingRightText: {
    fontSize: 14,
    marginRight: 8,
  },
});

export default SettingsScreen; 
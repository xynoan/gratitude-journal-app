import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import themeUtils from '../utils/theme';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const AuthScreen: React.FC = () => {
  const theme = themeUtils.useTheme();
  const { isAuthenticated, authenticate } = useAppContext();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated]);

  const handleAuthenticate = async () => {
    const success = await authenticate();
    if (success) {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={[styles.logoBackground, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="heart" size={60} color="#FFFFFF" />
          </View>
          <Text style={[styles.appName, { color: theme.colors.text }]}>
            Gratitude Journal
          </Text>
        </View>

        <View style={styles.messageContainer}>
          <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
            Welcome to Your Gratitude Journey
          </Text>
          <Text style={[styles.descriptionText, { color: theme.colors.textSecondary }]}>
            Take a moment each day to reflect on the things you're grateful for. 
            Track your progress and build a positive mindset.
          </Text>
        </View>

        <Button 
          title="Get Started" 
          onPress={handleAuthenticate}
          size="large"
          icon={<Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />}
        />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
          "Gratitude turns what we have into enough."
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  messageContainer: {
    marginBottom: 48,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontStyle: 'italic',
    fontSize: 16,
  },
});

export default AuthScreen;

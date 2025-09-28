import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from '@workspace/ui';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { t } = useTranslation('chat');
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('newChat')}</Text>
        <Text style={styles.subtitle}>{t('startNewChat')}</Text>
        
        <View style={styles.buttonContainer}>
          <Button
            title={t('newChat')}
            onPress={() => router.push('/(tabs)/chat')}
            variant="primary"
            size="large"
            style={styles.button}
          />
          
          <Button
            title={t('chatHistory')}
            onPress={() => router.push('/(tabs)/history')}
            variant="outline"
            size="large"
            style={styles.button}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
  },
});

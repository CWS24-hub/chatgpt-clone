import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Button } from '@workspace/ui';
import { useTranslation } from 'react-i18next';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:3000';
const scheme = process.env.EXPO_PUBLIC_DEEPLINK_SCHEME || 'myapp';
const callbackPath = process.env.EXPO_PUBLIC_DEEPLINK_HOST || 'billing/callback';

export default function BillingScreen() {
  const { t } = useTranslation('billing');
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const sub = Linking.addEventListener('url', async ({ url }) => {
      if (url.startsWith(`${scheme}://`)) {
        Alert.alert('Payment', 'Returning from payment...');
        // Refresh subscription status
        fetchSubscriptionStatus();
      }
    });
    return () => sub?.remove();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      // This would typically fetch from your backend
      // For now, we'll simulate it
      setSubscriptionStatus({ status: 'unpaid', daysLeft: 0 });
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
    }
  };

  const startCheckout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/billing/checkout`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ planId: 'basic-monthly' })
      });
      
      if (!res.ok) {
        throw new Error('Checkout failed');
      }
      
      const { redirectUrl } = await res.json();
      await WebBrowser.openBrowserAsync(redirectUrl, { showTitle: true });
    } catch (error) {
      Alert.alert('Error', 'Failed to start checkout process');
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('subscription')}</Text>
        
        {subscriptionStatus && (
          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>{t('status')}</Text>
            <Text style={styles.statusValue}>
              {t(subscriptionStatus.status)}
              {subscriptionStatus.daysLeft > 0 && ` (${subscriptionStatus.daysLeft} ${t('daysLeft')})`}
            </Text>
          </View>
        )}

        <View style={styles.planCard}>
          <Text style={styles.planTitle}>{t('plan')}</Text>
          <Text style={styles.planName}>Basic Monthly</Text>
          <Text style={styles.planPrice}>99,000 IRR/month</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={isLoading ? t('buttons.loading') : t('subscribe')}
            onPress={startCheckout}
            variant="primary"
            size="large"
            disabled={isLoading}
            style={styles.subscribeButton}
          />
          
          <Button
            title={t('manage')}
            onPress={() => Alert.alert('Info', 'Manage subscription feature coming soon')}
            variant="outline"
            size="large"
            style={styles.manageButton}
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Features</Text>
          <Text style={styles.infoText}>• Unlimited AI conversations</Text>
          <Text style={styles.infoText}>• File upload support</Text>
          <Text style={styles.infoText}>• Chat history</Text>
          <Text style={styles.infoText}>• Multi-language support</Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  statusTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  planCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  planTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  subscribeButton: {
    width: '100%',
  },
  manageButton: {
    width: '100%',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});

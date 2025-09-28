import { db } from '@workspace/db';

export async function assertActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await db.subscription.findUnique({
    where: { userId }
  });

  if (!subscription) {
    return false;
  }

  const now = new Date();
  
  // Check if subscription is active and not expired
  if (subscription.status === 'active' && subscription.currentPeriodEnd && subscription.currentPeriodEnd > now) {
    return true;
  }

  // Check if in grace period
  if (subscription.graceUntil && subscription.graceUntil > now) {
    return true;
  }

  return false;
}

export async function getSubscriptionStatus(userId: string) {
  const subscription = await db.subscription.findUnique({
    where: { userId }
  });

  if (!subscription) {
    return { status: 'unpaid', daysLeft: 0 };
  }

  const now = new Date();
  
  if (subscription.status === 'active' && subscription.currentPeriodEnd && subscription.currentPeriodEnd > now) {
    const daysLeft = Math.ceil((subscription.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return { status: 'active', daysLeft };
  }

  if (subscription.graceUntil && subscription.graceUntil > now) {
    const daysLeft = Math.ceil((subscription.graceUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return { status: 'past_due', daysLeft };
  }

  return { status: 'locked', daysLeft: 0 };
}

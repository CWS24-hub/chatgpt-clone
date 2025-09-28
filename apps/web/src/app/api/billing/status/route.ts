import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getSubscriptionStatus } from '@workspace/core';

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const status = await getSubscriptionStatus(session.user.id);
    return NextResponse.json(status);
  } catch (error) {
    console.error('Billing status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@workspace/db';
import { getPaymentProvider } from '@workspace/core';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { planId } = await req.json();
  const userId = session.user.id;
  const amountIrr = Number(process.env.BILLING_AMOUNT_IRR || 0);

  const invoice = await db.invoice.create({
    data: { 
      userId, 
      planId: planId || process.env.BILLING_PLAN_MONTHLY_ID!, 
      amountIrr, 
      status: 'pending' 
    },
  });

  const provider = getPaymentProvider();
  const callbackUrl = `${process.env.NEXTAUTH_URL}/billing/callback?invoiceId=${invoice.id}`;
  
  const init = await provider.initPayment({
    userId,
    planId: invoice.planId,
    amountIrr,
    callbackUrl,
    description: `Subscription ${invoice.planId} for ${session.user.email}`,
    metadata: { email: session.user.email || '' },
  });

  await db.invoice.update({ 
    where: { id: invoice.id }, 
    data: { authority: init.authorityOrToken } 
  });
  
  return NextResponse.json({ redirectUrl: init.redirectUrl });
}

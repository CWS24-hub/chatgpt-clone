import { NextResponse } from 'next/server';
import { db } from '@workspace/db';
import { getPaymentProvider } from '@workspace/core';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const authority = url.searchParams.get('Authority') || url.searchParams.get('authority') || '';
  const status = (url.searchParams.get('Status') || url.searchParams.get('status') || '').toLowerCase();
  const invoiceId = url.searchParams.get('invoiceId') || '';

  if (!authority || status !== 'ok') {
    if (invoiceId) {
      await db.invoice.update({ 
        where: { id: invoiceId }, 
        data: { status: 'failed' } 
      });
    }
    return NextResponse.redirect(new URL('/billing/failed', process.env.NEXTAUTH_URL));
  }

  const invoice = await db.invoice.findUnique({ 
    where: { id: invoiceId } 
  });
  
  if (!invoice) {
    return NextResponse.redirect(new URL('/billing/failed', process.env.NEXTAUTH_URL));
  }

  const provider = getPaymentProvider();
  const result = await provider.verifyPayment({ 
    authorityOrToken: authority, 
    amountIrr: invoice.amountIrr 
  });

  if (!result.success) {
    await db.invoice.update({ 
      where: { id: invoice.id }, 
      data: { status: 'failed' } 
    });
    return NextResponse.redirect(new URL('/billing/failed', process.env.NEXTAUTH_URL));
  }

  const now = new Date(); 
  const next = new Date(now); 
  next.setMonth(now.getMonth() + 1);
  
  await db.invoice.update({ 
    where: { id: invoice.id }, 
    data: { status: 'paid', refId: result.refId } 
  });

  await db.subscription.upsert({
    where: { userId: invoice.userId },
    create: { 
      userId: invoice.userId, 
      status: 'active', 
      currentPeriodEnd: next, 
      planId: invoice.planId, 
      lastPaymentRef: result.refId ?? undefined 
    },
    update: { 
      status: 'active', 
      currentPeriodEnd: next, 
      graceUntil: null, 
      lastPaymentRef: result.refId ?? undefined 
    },
  });

  return NextResponse.redirect(new URL('/app', process.env.NEXTAUTH_URL));
}

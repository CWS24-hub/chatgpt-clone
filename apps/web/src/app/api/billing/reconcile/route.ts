import { NextResponse } from 'next/server';
import { db } from '@workspace/db';

export async function POST(req: Request) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const now = new Date();
  const graceDays = Number(process.env.BILLING_GRACE_DAYS || 0);

  const subs = await db.subscription.findMany({});
  
  for (const s of subs) {
    if (!s.currentPeriodEnd) continue;
    
    if (s.currentPeriodEnd < now) {
      const graceUntil = s.graceUntil ?? new Date(now.getTime() + graceDays * 86400000);
      const status = graceUntil > now ? 'past_due' : 'locked';
      
      await db.subscription.update({ 
        where: { userId: s.userId }, 
        data: { status, graceUntil } 
      });
    }
  }
  
  return NextResponse.json({ ok: true });
}

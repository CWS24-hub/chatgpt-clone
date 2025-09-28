import type {
  PaymentInitPayload, PaymentInitResult,
  PaymentVerifyPayload, PaymentVerifyResult, PaymentProvider,
} from './types';

const BASE = 'https://api.zarinpal.com/pg/v4/payment';

function getCurrency(): 'IRR' | 'IRT' {
  return (process.env.ZARINPAL_CURRENCY || 'IRR').toUpperCase() === 'IRT' ? 'IRT' : 'IRR';
}

export class ZarinpalAdapter implements PaymentProvider {
  constructor(private merchantId: string) {}

  async initPayment(p: PaymentInitPayload): Promise<PaymentInitResult> {
    const currency = getCurrency();
    const amount = currency === 'IRT' ? Math.round(p.amountIrr / 10) : p.amountIrr;

    const body = {
      merchant_id: this.merchantId,
      amount,
      callback_url: p.callbackUrl,
      description: p.description || `Subscription ${p.planId}`,
      currency,
      metadata: p.metadata || {},
    };

    const res = await fetch(`${BASE}/request.json`, {
      method: 'POST', 
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();

    if (json?.data?.code !== 100) {
      throw new Error(`Zarinpal error: ${JSON.stringify(json)}`);
    }

    const authority = json.data.authority;
    return {
      authorityOrToken: authority,
      redirectUrl: `https://www.zarinpal.com/pg/StartPay/${authority}`,
    };
  }

  async verifyPayment(p: PaymentVerifyPayload): Promise<PaymentVerifyResult> {
    const currency = getCurrency();
    const amount = currency === 'IRT' ? Math.round(p.amountIrr / 10) : p.amountIrr;

    const body = { 
      merchant_id: this.merchantId, 
      amount, 
      authority: p.authorityOrToken 
    };
    
    const res = await fetch(`${BASE}/verify.json`, {
      method: 'POST', 
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();

    return {
      success: json?.data?.code === 100,
      refId: json?.data?.ref_id?.toString(),
      cardMask: json?.data?.card_mask,
      raw: json,
    };
  }

  webhookSecret() { 
    return process.env.PAYMENT_WEBHOOK_SECRET; 
  }
}

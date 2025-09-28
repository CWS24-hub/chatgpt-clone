import { ZarinpalAdapter } from './zarinpal';

export function getPaymentProvider() {
  const name = (process.env.PAYMENT_PROVIDER || 'zarinpal').toLowerCase();
  switch (name) {
    case 'zarinpal':
      return new ZarinpalAdapter(process.env.ZARINPAL_MERCHANT_ID!);
    default:
      throw new Error(`Unsupported payment provider: ${name}`);
  }
}

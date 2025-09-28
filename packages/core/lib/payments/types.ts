export type PaymentInitPayload = {
  userId: string;
  planId: string;
  amountIrr: number;
  description?: string;
  callbackUrl: string;
  metadata?: { mobile?: string; email?: string; card_pan?: string };
};

export type PaymentInitResult = { 
  authorityOrToken: string; 
  redirectUrl: string; 
};

export type PaymentVerifyPayload = { 
  authorityOrToken: string; 
  amountIrr: number; 
};

export type PaymentVerifyResult = { 
  success: boolean; 
  refId?: string; 
  cardMask?: string; 
  raw?: any; 
};

export interface PaymentProvider {
  initPayment(payload: PaymentInitPayload): Promise<PaymentInitResult>;
  verifyPayment(payload: PaymentVerifyPayload): Promise<PaymentVerifyResult>;
  createPortalUrl?(userId: string): Promise<string>; // optional
  webhookSecret?(): string | undefined;              // optional
}

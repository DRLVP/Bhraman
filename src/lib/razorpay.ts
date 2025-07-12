import Razorpay from 'razorpay';

/**
 * Initialize Razorpay instance with API keys
 */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

/**
 * Create a new Razorpay order
 * @param options - Order options
 * @returns The created order
 */
export const createOrder = async (options: {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}) => {
  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
};

/**
 * Verify Razorpay payment signature
 * @param orderId - The Razorpay order ID
 * @param paymentId - The Razorpay payment ID
 * @param signature - The Razorpay signature
 * @returns Boolean indicating if the signature is valid
 */
export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string,
) => {
  const crypto = require('crypto');
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};

export default razorpay;
import api from './api';
import { dummyPayments, dummyOrders } from '../data/dummyData';

export const processPayment = async (paymentRequest) => {
  try {
    const response = await api.post('/payments/process', paymentRequest);
    return response;
  } catch (error) {
    console.warn('Backend unavailable, falling back to dummy processPayment simulation', error);
    const orderIdx = dummyOrders.findIndex(o => o.id === Number(paymentRequest.orderId));
    if (orderIdx === -1) throw new Error('Order not found');
    
    const order = dummyOrders[orderIdx];
    order.status = 'CONFIRMED'; // Payment success confirms the order

    const newPayment = {
      id: dummyPayments.length + 1,
      orderId: order.id,
      method: paymentRequest.method,
      transactionId: 'TXN' + Math.floor(100000 + Math.random() * 900000) + 'SIM',
      amount: order.totalAmount,
      status: 'COMPLETED',
      paidAt: new Date().toISOString(),
    };
    
    dummyPayments.push(newPayment);
    return {
      success: true,
      message: 'Payment processed successfully (Simulated)',
      data: newPayment,
    };
  }
};

export const getPaymentByOrderId = async (orderId) => {
  try {
    const response = await api.get(`/payments/${orderId}`);
    return response;
  } catch (error) {
    console.warn(`Backend unavailable, falling back to dummy getPaymentByOrderId simulation for order ${orderId}`, error);
    const payment = dummyPayments.find(p => p.orderId === Number(orderId));
    if (payment) {
      return {
        success: true,
        message: 'Payment retrieved successfully (Simulated)',
        data: payment,
      };
    }
    throw new Error('Payment not found');
  }
};

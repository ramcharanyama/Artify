export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  ARTIST: 'ARTIST',
  ADMIN: 'ADMIN',
};

export const ORDER_STATUSES = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const PAYMENT_STATUSES = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

export const PRODUCT_STATUSES = {
  ACTIVE: 'ACTIVE',
  SOLD: 'SOLD',
  DRAFT: 'DRAFT',
};

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD',
  UPI: 'UPI',
  NET_BANKING: 'NET_BANKING',
  WALLET: 'WALLET',
};

export const PAYMENT_METHOD_LABELS = {
  CREDIT_CARD: 'Credit Card',
  DEBIT_CARD: 'Debit Card',
  UPI: 'UPI',
  NET_BANKING: 'Net Banking',
  WALLET: 'Wallet',
};

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 12,
  SIZES: [6, 12, 24, 48],
};

export const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: 'Newest First' },
  { value: 'createdAt,asc', label: 'Oldest First' },
  { value: 'price,asc', label: 'Price: Low to High' },
  { value: 'price,desc', label: 'Price: High to Low' },
  { value: 'title,asc', label: 'Name: A-Z' },
  { value: 'title,desc', label: 'Name: Z-A' },
];

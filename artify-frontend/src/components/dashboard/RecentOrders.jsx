import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/formatters';

export const RecentOrders = ({ orders = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white border p-4 rounded-0 text-center py-5">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading orders...</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border p-5 rounded-0 text-center">
        <p className="text-muted mb-0">No recent orders found.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive bg-white border rounded-0">
      <table className="table table-hover table-striped align-middle mb-0 text-xs">
        <thead className="table-dark-gray text-white text-uppercase fs-8 letter-spacing-1">
          <tr>
            <th className="py-3 ps-4">Order ID</th>
            <th className="py-3">Date</th>
            <th className="py-3">Shipping Address</th>
            <th className="py-3">Total Amount</th>
            <th className="py-3 text-center">Status</th>
            <th className="py-3 text-center pe-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="ps-4 py-3 font-weight-bold">#{order.id}</td>
              <td className="py-3 text-muted">{formatDate(order.createdAt)}</td>
              <td className="py-3 text-truncate" style={{ maxWidth: '200px' }}>
                {order.shippingAddress}
              </td>
              <td className="py-3 font-weight-bold text-dark">
                {formatCurrency(order.totalAmount)}
              </td>
              <td className="py-3 text-center">
                <span className={`badge rounded-0 bg-${getStatusBadgeClass(order.status)} text-uppercase px-2 py-1 fs-8`}>
                  {order.status}
                </span>
              </td>
              <td className="py-3 text-center pe-4">
                <Link 
                  to={`/orders?id=${order.id}`} 
                  className="btn btn-outline-dark btn-sm rounded-0 text-uppercase font-weight-bold text-xs"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;

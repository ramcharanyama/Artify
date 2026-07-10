import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as orderService from '../services/orderService';
import StatsCard from '../components/dashboard/StatsCard';
import RecentOrders from '../components/dashboard/RecentOrders';
import { FaBox, FaClock, FaRupeeSign, FaHeart } from 'react-icons/fa';
import { formatCurrency } from '../utils/formatters';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const list = await orderService.getOrders();
        setOrders(list || []);
      } catch (err) {
        console.error('Failed to load customer dashboard details', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING' || o.status === 'CONFIRMED').length;
  
  const totalSpent = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="ajio-dashboard bg-light-gray py-4">
      <div className="container py-3">
        
        {/* Welcome greeting */}
        <div className="bg-white border p-4 mb-4 rounded-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h1 className="h4 text-uppercase font-weight-black text-dark mb-1 letter-spacing-1">
              WELCOME BACK, {user?.name?.toUpperCase()}
            </h1>
            <span className="text-muted fs-7">Manage your orders and account settings from your dashboard.</span>
          </div>
          
          <div className="d-flex gap-2">
            <Link to="/products" className="btn btn-ajio-red rounded-0 px-4 py-2 text-uppercase font-weight-bold text-xs letter-spacing-1">
              Browse Artworks
            </Link>
            <Link to="/profile" className="btn btn-outline-dark rounded-0 px-4 py-2 text-uppercase font-weight-bold text-xs letter-spacing-1">
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Stats KPIs row */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-6">
            <StatsCard
              icon={FaBox}
              label="Total Orders"
              value={totalOrdersCount}
              change="12%"
              changeType="success"
            />
          </div>
          <div className="col-md-3 col-6">
            <StatsCard
              icon={FaClock}
              label="Pending Orders"
              value={pendingOrdersCount}
              change="-2%"
              changeType="danger"
            />
          </div>
          <div className="col-md-3 col-6">
            <StatsCard
              icon={FaRupeeSign}
              label="Total Spent"
              value={formatCurrency(totalSpent)}
              change="8%"
              changeType="success"
            />
          </div>
          <div className="col-md-3 col-6">
            <StatsCard
              icon={FaHeart}
              label="Wishlist Items"
              value="0"
            />
          </div>
        </div>

        {/* Recent orders details */}
        <div className="bg-white border p-4 rounded-0 mb-4">
          <h2 className="fs-6 font-weight-bold text-uppercase pb-3 border-bottom mb-4 letter-spacing-1">
            RECENT ORDERS
          </h2>
          <RecentOrders orders={orders.slice(0, 5)} isLoading={isLoading} />
        </div>

      </div>
    </div>
  );
};

export default CustomerDashboard;

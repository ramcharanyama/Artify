import React from 'react';

export const StatsCard = ({ icon: Icon, label, value, change, changeType = 'success' }) => {
  return (
    <div className="card ajio-stats-card border-0 rounded-0 bg-white shadow-sm p-4 d-flex align-items-center flex-row mb-3">
      {Icon && (
        <div className="stats-icon-container bg-light-gray text-ajio-red p-3 me-4 d-flex align-items-center justify-content-center">
          <Icon size={24} />
        </div>
      )}
      <div className="stats-info">
        <div className="text-muted text-uppercase text-xs font-weight-bold letter-spacing-1 mb-1">
          {label}
        </div>
        <h3 className="h4 font-weight-bold text-dark mb-1">
          {value}
        </h3>
        {change && (
          <div className={`stats-change fs-8 text-${changeType} font-weight-bold`}>
            {changeType === 'success' ? '+' : ''}{change} <span className="text-muted font-weight-normal">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;

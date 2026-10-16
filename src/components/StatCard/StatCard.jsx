import React from "react";

import {
  Car,
  UserRound,
  Users,
  Activity,
  TrendingUp,
} from "lucide-react";

import "../../styles/StatCard.css";

function StatCard({
  title,
  value,
  percentage,
  icon,
  type,
}) {
  const getIcon = () => {
    switch (icon) {
      case "car":
        return <Car size={23} />;

      case "active":
        return <Activity size={23} />;

      case "driver":
        return <UserRound size={23} />;

      case "customer":
        return <Users size={23} />;

      default:
        return <Car size={23} />;
    }
  };

  return (
    <div className="stat-card">

      <div className={`stat-icon ${type}`}>
        {getIcon()}
      </div>

      <div className="stat-content">

        <p className="stat-title">
          {title}
        </p>

        <h2 className="stat-value">
          {value}
        </h2>

        <div className="stat-growth">
          <TrendingUp size={14} />

          <span>
            ↑ {percentage}
          </span>

          <small>
            vs. last week
          </small>
        </div>

      </div>

    </div>
  );
}

export default StatCard;
import React from "react";
import MiniLineChart from "./MiniLineChart";
import styles from "/src/styles/statistic/StatisticsCard.module.css";
import PropTypes from "prop-types";

const StatisticsCard = ({
  icon,
  label,
  value,
  percentageChange,
  chartData,
  color,
}) => {
  const isPositive = percentageChange >= 0;

  return (
    <div className={styles.card} style={{ color }}>
      <div className={styles.header}>
        <div
          className={styles.iconContainer}
          style={{ backgroundColor: `${color}15` }}
        >
          {React.cloneElement(icon, { style: { color } })}
        </div>
        <div
          className={`${styles.percentageChange} ${
            isPositive ? styles.positive : styles.negative
          }`}
        >
          {isPositive ? "↗" : "↘"} {Math.abs(percentageChange).toFixed(1)}%
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.label}>{label}</div>
        <div className={styles.value}>{value.toLocaleString()}</div>
      </div>

      <div className={styles.chartContainer}>
        <MiniLineChart data={chartData} color={color} />
      </div>
    </div>
  );
};

StatisticsCard.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  percentageChange: PropTypes.number.isRequired,
  chartData: PropTypes.array.isRequired,
  color: PropTypes.string.isRequired,
};

export default StatisticsCard;

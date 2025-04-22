// src/components/PieChart/PieChart.js
import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import styles from "/src/styles/statistic/PieChart.module.css";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{data.name}</p>
        <p className={styles.tooltipValue}>
          <span style={{ color: data.color }}>
            {data.value.toLocaleString()}
          </span>
          {` (${(data.payload.percent * 100).toFixed(1)}%)`}
        </p>
      </div>
    );
  }
  return null;
};

const PieChart = ({
  data,
  title,
  colors,
  innerRadius = 60,
  outerRadius = 80,
}) => {
  // Tính tổng để tính phần trăm
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Thêm phần trăm vào dữ liệu
  const dataWithPercent = data.map((item) => ({
    ...item,
    percent: item.value / total,
  }));

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart>
            <Pie
              data={dataWithPercent}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey="value"
            >
              {dataWithPercent.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              formatter={(value, entry) => {
                const item = dataWithPercent.find((d) => d.name === value);
                return (
                  <span className={styles.legendItem}>
                    {value}:{" "}
                    <span style={{ color: entry.color }}>
                      {item.value.toLocaleString()}
                    </span>
                  </span>
                );
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>

        <div className={styles.totalValue}>
          <div className={styles.totalLabel}>Tổng</div>
          <div className={styles.total}>{total.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default PieChart;

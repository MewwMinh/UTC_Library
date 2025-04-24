import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "/src/styles/statistic/BarChart.module.css";
import PropTypes from "prop-types";

const CustomBarChart = ({
  data,
  xDataKey,
  bars,
  title,
  subtitle,
  height = 400,
  showGrid = true,
  showLegend = true,
}) => {
  return (
    <div className={styles.chartContainer}>
      {title && <h1 className={styles.chartTitle}>{title}</h1>}
      {subtitle && <p className={styles.chartSubtitle}>{subtitle}</p>}

      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" className={styles.chartGrid} />
          )}
          <XAxis
            dataKey={xDataKey}
            tick={{ fill: "#666", fontSize: 12, fontWeight: "bold" }}
          />
          <YAxis tick={{ fill: "#666", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              border: "none",
              padding: "10px",
            }}
            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
          />
          {showLegend && <Legend wrapperStyle={{ paddingTop: "10px" }} />}

          {bars.map((bar, index) => (
            <Bar
              key={index}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={bar.color}
              radius={[4, 4, 0, 0]}
              barSize={bar.barSize || 40}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

CustomBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  xDataKey: PropTypes.string.isRequired,
  bars: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      name: PropTypes.string,
      color: PropTypes.string,
      barSize: PropTypes.number,
    })
  ).isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  height: PropTypes.number,
  showGrid: PropTypes.bool,
  showLegend: PropTypes.bool,
};

export default CustomBarChart;

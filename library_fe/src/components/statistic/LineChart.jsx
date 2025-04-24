import PropTypes from "prop-types";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "/src/styles/statistic/LineChart.module.css";

const LineChart = ({
  data,
  lines,
  xAxisDataKey,
  xAxisLabel,
  yAxisLabel,
  height = 400,
  legendEnabled = true,
  tooltipFormatter,
  xAxisFormatter,
  yAxisFormatter,
}) => {
  const defaultTooltipFormatter = (value) => [value, ""];
  const defaultAxisFormatter = (value) => value;

  const tooltipFormat = tooltipFormatter || defaultTooltipFormatter;
  const formatXAxis = xAxisFormatter || defaultAxisFormatter;
  const formatYAxis = yAxisFormatter || defaultAxisFormatter;

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          {/* {gridEnabled && <CartesianGrid strokeDasharray="3 3" stroke="#eee" />} */}
          <XAxis
            dataKey={xAxisDataKey}
            tickFormatter={formatXAxis}
            label={
              xAxisLabel
                ? {
                    value: xAxisLabel,
                    position: "insideBottomRight",
                    offset: -10,
                  }
                : undefined
            }
          />
          <YAxis
            tickFormatter={formatYAxis}
            label={
              yAxisLabel
                ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: "insideLeft",
                  }
                : undefined
            }
          />
          <Tooltip
            formatter={tooltipFormat}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              border: "none",
              padding: "10px 14px",
            }}
          />
          {legendEnabled && (
            <Legend
              wrapperStyle={{
                paddingTop: "10px",
                paddingBottom: "10px",
              }}
            />
          )}

          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              activeDot={{ r: 8 }}
              strokeWidth={2}
              dot={{ stroke: line.color, strokeWidth: 2, fill: "#fff", r: 4 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

LineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  lines: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
  xAxisDataKey: PropTypes.string.isRequired,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  height: PropTypes.number,
  legendEnabled: PropTypes.bool,
  tooltipFormatter: PropTypes.func,
  xAxisFormatter: PropTypes.func,
  yAxisFormatter: PropTypes.func,
};

export default LineChart;

import { LineChart, Line, ResponsiveContainer } from "recharts";

// eslint-disable-next-line react/prop-types
const MiniLineChart = ({ data, color }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MiniLineChart;

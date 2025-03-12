import React from "react";
import { Card } from "antd";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "2024-02-18", users: 120 },
  { date: "2024-02-19", users: 200 },
  { date: "2024-02-20", users: 150 },
  { date: "2024-02-21", users: 250 },
  { date: "2024-02-22", users: 300 },
  { date: "2024-02-23", users: 400 },
  { date: "2024-02-24", users: 350 },
];

const UserStatisticsCard = () => {
  return (
    <Card title="Thống kê lượng người dùng" style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default UserStatisticsCard;

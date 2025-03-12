import { Card } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { week: "Week 1", borrowed: 30, returned: 20 },
  { week: "Week 2", borrowed: 50, returned: 40 },
  { week: "Week 3", borrowed: 45, returned: 35 },
  { week: "Week 4", borrowed: 60, returned: 50 },
  { week: "Week 5", borrowed: 80, returned: 70 },
];

const BookBorrowingStatisticsCard = () => {
  return (
    <Card
      title="Thống kê lượng sách mượn, trả theo tuần"
      style={{ width: "100%" }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="borrowed"
            stroke="#ff4d4f"
            name="Sách mượn"
          />
          <Line
            type="monotone"
            dataKey="returned"
            stroke="#52c41a"
            name="Sách trả"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default BookBorrowingStatisticsCard;

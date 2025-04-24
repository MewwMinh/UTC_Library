import { useState, useEffect } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Timeline,
  Empty,
  Spin,
  notification,
  Typography,
} from "antd";
import librarianService from "/src/services/librarianService";
import dayjs from "dayjs";

const { Text } = Typography;

export default function UserRecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentActivities = async () => {
    try {
      setLoading(true);
      const response = await librarianService.getRecentActivities();

      if (response.success) {
        setActivities(response.data);
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải hoạt động gần đây",
          placement: "bottomRight",
        });
      }
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  // Function to format timestamp to display time
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return dayjs(timestamp).format("HH:mm");
  };

  // Function to format timestamp to display date
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return dayjs(timestamp).format("DD/MM/YYYY");
  };

  // Group activities by date
  const groupActivitiesByDate = (activities) => {
    const groupedActivities = {};

    activities.forEach((activity) => {
      if (!activity.time) return;

      const date = formatDate(activity.time);
      if (!groupedActivities[date]) {
        groupedActivities[date] = [];
      }

      groupedActivities[date].push(activity);
    });

    return groupedActivities;
  };

  // Get action color based on activity type
  const getActionColor = (action) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes("mượn")) return "green";
    if (actionLower.includes("trả")) return "blue";
    if (actionLower.includes("đặt mượn")) return "orange";
    if (actionLower.includes("gia hạn")) return "purple";
    return "gray";
  };

  const handleRefresh = () => {
    fetchRecentActivities();
  };

  // Group activities by date
  const groupedActivities = groupActivitiesByDate(activities);

  // Prepare timeline items
  const timelineItems = [];

  Object.keys(groupedActivities)
    .sort((a, b) => {
      // Sort dates in descending order (newest first)
      return dayjs(b, "DD/MM/YYYY").unix() - dayjs(a, "DD/MM/YYYY").unix();
    })
    .forEach((date) => {
      // Add date header
      timelineItems.push({
        isDateHeader: true,
        date: date,
        key: `date-${date}`,
      });

      // Add activities for this date
      groupedActivities[date]
        .sort((a, b) => {
          // Sort activities by time (newest first)
          return dayjs(b.time).unix() - dayjs(a.time).unix();
        })
        .forEach((activity) => {
          timelineItems.push({
            ...activity,
            isDateHeader: false,
            key:
              activity.recordID ||
              `activity-${date}-${formatTime(activity.time)}-${
                activity.patronName
              }`,
          });
        });
    });

  return (
    <Col span={24}>
      <Card
        title={<div style={{ marginLeft: 15 }}>Hoạt động gần đây</div>}
        extra={
          <Button
            type="link"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Làm mới
          </Button>
        }
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin />
          </div>
        ) : activities.length === 0 ? (
          <Empty description="Không có hoạt động nào gần đây" />
        ) : (
          <Timeline mode="left" style={{ marginTop: 20 }}>
            {timelineItems.map((item) =>
              item.isDateHeader ? (
                <Timeline.Item
                  key={item.key}
                  color="red"
                  dot={
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "red",
                      }}
                    />
                  }
                >
                  <Text strong style={{ fontSize: "14px" }}>
                    {item.date}
                  </Text>
                </Timeline.Item>
              ) : (
                <Timeline.Item
                  key={item.key}
                  color={getActionColor(item.action)}
                >
                  <p>
                    <strong>{formatTime(item.time)}</strong> - {item.patronName}
                  </p>
                  <p>
                    Đã {item.action}: <strong>{item.bookName}</strong>
                  </p>
                </Timeline.Item>
              )
            )}
          </Timeline>
        )}
      </Card>
    </Col>
  );
}

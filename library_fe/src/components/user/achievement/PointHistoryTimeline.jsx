// src/components/PointHistoryTable.jsx
import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Table,
  Tag,
  Skeleton,
  Empty,
  notification,
  Row,
  Col,
  Statistic,
  Input,
  Select,
  DatePicker,
  Button,
  Tooltip,
} from "antd";
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import pointHistoryService from "/src/services/patron/achievementService.js";

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Styled components
const PointHistoryCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  border: none;

  .ant-card-head {
    background: linear-gradient(90deg, #8b4513 0%, #a0522d 100%);
    border-bottom: none;
    padding: 16px 24px;
    text-align: center;
  }

  .ant-card-head-title {
    font-size: 20px !important;
    font-weight: 700 !important;
    color: white;
  }
`;

const ContentContainer = styled.div`
  padding: 20px;

  .point-stats {
    background: #fafafa;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .filter-section {
    margin-bottom: 20px;
    padding: 16px;
    background: #f5f5f5;
    border-radius: 8px;
  }

  .ant-table-wrapper {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .ant-table-thead > tr > th {
    background: #f0f0f0;
    font-weight: 600;
  }

  .reason-column {
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const PointTag = styled(Tag)`
  font-weight: bold;
  font-size: 14px;
  padding: 3px 10px;
  border-radius: 10px;
`;

const EmptyContainer = styled(Empty)`
  margin: 40px 0;

  .ant-empty-image {
    height: 100px;
  }
`;

function PointHistoryTable() {
  const [pointHistory, setPointHistory] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [stats, setStats] = useState({
    totalPoints: 0,
    totalPositive: 0,
    totalNegative: 0,
  });

  // Filter states
  const [searchText, setSearchText] = useState("");
  const [pointType, setPointType] = useState("all");
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    fetchPointHistory();
  }, []);

  // This effect will run when filters change
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, pointType, dateRange, pointHistory]);

  const fetchPointHistory = async () => {
    try {
      setLoading(true);
      const response = await pointHistoryService.getPointHistory();

      if (response.success) {
        // Add a unique key for Table
        const dataWithKeys = response.data.map((item, index) => ({
          ...item,
          key: index,
        }));

        setPointHistory(dataWithKeys);
        setFilteredData(dataWithKeys);
        setPagination({
          ...pagination,
          total: dataWithKeys.length,
        });

        // Calculate stats
        calculateStats(dataWithKeys);
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải lịch sử điểm",
        });
      }
    } catch (error) {
      console.error("Error fetching point history:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (data) => {
    let totalPoints = 0;
    let totalPositive = 0;
    let totalNegative = 0;

    data.forEach((item) => {
      if (item.points >= 0) {
        totalPositive += item.points;
      } else {
        totalNegative += Math.abs(item.points);
      }
      totalPoints += item.points;
    });

    setStats({
      totalPoints,
      totalPositive,
      totalNegative,
    });
  };

  // Apply all filters to data
  const applyFilters = () => {
    let result = [...pointHistory];

    // Search filter
    if (searchText) {
      const lowerCaseSearch = searchText.toLowerCase();
      result = result.filter(
        (item) =>
          item.reason.toLowerCase().includes(lowerCaseSearch) ||
          (item.updatedBy &&
            item.updatedBy.toLowerCase().includes(lowerCaseSearch))
      );
    }

    // Point type filter
    if (pointType === "positive") {
      result = result.filter((item) => item.points > 0);
    } else if (pointType === "negative") {
      result = result.filter((item) => item.points < 0);
    }

    // Date range filter
    if (dateRange) {
      const [startDate, endDate] = dateRange;
      result = result.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    setFilteredData(result);
    setPagination({
      ...pagination,
      current: 1, // Reset to first page when filter changes
      total: result.length,
    });
  };

  // Handle table pagination change
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Handle point type filter change
  const handlePointTypeChange = (value) => {
    setPointType(value);
  };

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchText("");
    setPointType("all");
    setDateRange(null);
    setFilteredData(pointHistory);
    setPagination({
      ...pagination,
      current: 1,
      total: pointHistory.length,
    });
  };

  // Format date to Vietnamese format (DD/MM/YYYY)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Format time (HH:MM)
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  // Table columns
  const columns = [
    {
      title: "Điểm",
      dataIndex: "points",
      key: "points",
      width: 100,
      align: "center",
      render: (points) => {
        const isPositive = points >= 0;
        return (
          <PointTag color={isPositive ? "success" : "error"}>
            {isPositive ? "+" : ""}
            {points}
          </PointTag>
        );
      },
      sorter: (a, b) => a.points - b.points,
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      render: (text) => (
        <Tooltip title={text}>
          <div className="reason-column">{text}</div>
        </Tooltip>
      ),
    },
    {
      title: "Cập nhật bởi",
      dataIndex: "updatedBy",
      key: "updatedBy",
      render: (text) => {
        if (!text || text.trim() === "") {
          return (
            <Text type="secondary">
              <RobotOutlined style={{ marginRight: 4 }} /> Hệ thống
            </Text>
          );
        }
        return text;
      },
    },
    {
      title: "Ngày",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (text) => formatDate(text),
      sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      defaultSortOrder: "descend",
    },
    {
      title: "Giờ",
      dataIndex: "createdAt",
      key: "time",
      width: 80,
      render: (text) => formatTime(text),
    },
  ];

  return (
    <PointHistoryCard title="Lịch sử điểm thành viên">
      <ContentContainer>
        {/* Stats Section */}
        <div className="point-stats">
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8}>
              <Statistic
                title="Tổng điểm"
                value={stats.totalPoints}
                suffix="điểm"
                valueStyle={{
                  color: stats.totalPoints >= 0 ? "#52c41a" : "#f5222d",
                  fontSize: "28px",
                }}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="Điểm cộng"
                value={stats.totalPositive}
                valueStyle={{ color: "#52c41a" }}
                prefix={<PlusCircleOutlined />}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="Điểm trừ"
                value={stats.totalNegative}
                valueStyle={{ color: "#f5222d" }}
                prefix={<MinusCircleOutlined />}
              />
            </Col>
          </Row>
        </div>

        {/* Filter Section */}
        <div className="filter-section">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={24} md={8} lg={7}>
              <Input
                placeholder="Tìm kiếm theo lý do hoặc người cập nhật"
                value={searchText}
                onChange={handleSearchChange}
                prefix={<SearchOutlined />}
                allowClear
              />
            </Col>
            <Col xs={12} sm={12} md={5} lg={4}>
              <Select
                style={{ width: "100%" }}
                placeholder="Loại điểm"
                value={pointType}
                onChange={handlePointTypeChange}
              >
                <Option value="all">Tất cả</Option>
                <Option value="positive">Điểm cộng</Option>
                <Option value="negative">Điểm trừ</Option>
              </Select>
            </Col>
            <Col xs={24} sm={24} md={8} lg={9}>
              <RangePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                value={dateRange}
                onChange={handleDateRangeChange}
                placeholder={["Từ ngày", "Đến ngày"]}
              />
            </Col>
            <Col xs={12} sm={12} md={3} lg={4}>
              <Button
                icon={<ReloadOutlined />}
                onClick={resetFilters}
                style={{ width: "100%" }}
              >
                Đặt lại
              </Button>
            </Col>
          </Row>
        </div>

        {/* Table Section */}
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : filteredData.length === 0 ? (
          <EmptyContainer
            description="Không có dữ liệu lịch sử điểm"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={pagination}
            onChange={handleTableChange}
            rowKey="key"
            size="middle"
            scroll={{ x: 800 }}
          />
        )}
      </ContentContainer>
    </PointHistoryCard>
  );
}

export default PointHistoryTable;

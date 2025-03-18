import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Typography,
  Empty,
  Skeleton,
  Avatar,
  notification,
  Input,
  DatePicker,
  Select,
  Space,
  Button,
  Tooltip,
  Row,
  Col,
  Divider,
} from "antd";
import {
  HistoryOutlined,
  BookOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  CalendarOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import borrowReturnService from "/src/services/patron/borrowReturnService";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

function BorrowHistory() {
  // Data states
  const [historyData, setHistoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchText, setSearchText] = useState("");
  const [borrowDateRange, setBorrowDateRange] = useState(null);
  const [returnDateRange, setReturnDateRange] = useState(null);
  const [statusFilter, setStatusFilter] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const navigate = useNavigate();

  useEffect(() => {
    fetchBorrowHistory();
  }, []);

  // Apply all filters whenever any filter changes
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, borrowDateRange, returnDateRange, statusFilter, historyData]);

  const fetchBorrowHistory = async () => {
    try {
      setLoading(true);
      const response = await borrowReturnService.getBorrowHistory();

      if (response.success) {
        setHistoryData(response.data || []);
        setFilteredData(response.data || []);
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải lịch sử mượn sách",
          placement: "bottomRight",
        });
      }
    } catch (error) {
      console.error("Error fetching borrow history:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...historyData];

    // Apply search filter
    if (searchText) {
      result = result.filter((item) =>
        item.bookName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply borrow date filter
    if (borrowDateRange && borrowDateRange[0] && borrowDateRange[1]) {
      const startDate = borrowDateRange[0].startOf("day");
      const endDate = borrowDateRange[1].endOf("day");

      result = result.filter((item) => {
        const borrowDate = dayjs(item.borrowDate);
        return borrowDate.isAfter(startDate) && borrowDate.isBefore(endDate);
      });
    }

    // Apply return date filter
    if (returnDateRange && returnDateRange[0] && returnDateRange[1]) {
      const startDate = returnDateRange[0].startOf("day");
      const endDate = returnDateRange[1].endOf("day");

      result = result.filter((item) => {
        // Skip items that haven't been returned yet if filtering by return date
        if (!item.returnDate) return false;

        const returnDate = dayjs(item.returnDate);
        return returnDate.isAfter(startDate) && returnDate.isBefore(endDate);
      });
    }

    // Apply status filter
    if (statusFilter && statusFilter.length > 0) {
      result = result.filter((item) => {
        const status = getBookStatus(item);
        return statusFilter.includes(status);
      });
    }

    setFilteredData(result);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setSearchText("");
    setBorrowDateRange(null);
    setReturnDateRange(null);
    setStatusFilter([]);
  };

  // Format date string to display in a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Check if book was returned late
  const isReturnedLate = (dueDate, returnDate) => {
    if (!dueDate || !returnDate) return false;
    return new Date(returnDate) > new Date(dueDate);
  };

  // Get the status of a book for filtering purposes
  const getBookStatus = (record) => {
    if (!record.returnDate) {
      return "borrowing";
    }
    return isReturnedLate(record.dueDate, record.returnDate)
      ? "late"
      : "ontime";
  };

  const getReturnStatus = (record) => {
    if (!record.returnDate) {
      return <Tag color="processing">Đang mượn</Tag>;
    }

    const late = isReturnedLate(record.dueDate, record.returnDate);

    if (late) {
      return (
        <Tag color="error" icon={<CloseCircleOutlined />}>
          Trả muộn
        </Tag>
      );
    } else {
      return (
        <Tag color="success" icon={<CheckCircleOutlined />}>
          Đúng hạn
        </Tag>
      );
    }
  };

  const historyColumns = [
    {
      title: "Sách",
      dataIndex: "bookName",
      key: "bookName",
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/user/bookDetails/${record.bookID}`)}
        >
          <Avatar
            shape="square"
            size={64}
            src={record.bookImage}
            icon={!record.bookImage && <BookOutlined />}
            style={{ marginRight: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
          />
          <div>
            <Text strong style={{ display: "block", color: "#1890ff" }}>
              {text}
            </Text>
            <Text type="secondary">{record.author}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Ngày mượn",
      dataIndex: "borrowDate",
      key: "borrowDate",
      render: (date) => formatDate(date),
    },
    {
      title: "Ngày đến hạn",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => formatDate(date),
    },
    {
      title: "Ngày trả",
      dataIndex: "returnDate",
      key: "returnDate",
      render: (date) => (date ? formatDate(date) : <Tag>Chưa trả</Tag>),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => getReturnStatus(record),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HistoryOutlined style={{ marginRight: 8, color: "#722ed1" }} />
            <Title level={4} style={{ margin: 0, color: "#722ed1" }}>
              Lịch sử mượn sách
            </Title>
          </div>
        }
        style={{
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          borderRadius: 8,
          background: "linear-gradient(135deg, #ffffff 0%, #f9f0ff 100%)",
        }}
        styles={{ body: { padding: "12px 16px" } }}
      >
        {/* Filter section */}
        <div className="filter-section" style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <Input
                placeholder="Tìm kiếm tên sách..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
                allowClear
              />
            </Col>
            <Col xs={24} sm={24} md={16} lg={16} xl={16}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={8}>
                  <Tooltip title="Lọc theo ngày mượn">
                    <RangePicker
                      placeholder={["Từ ngày", "Đến ngày"]}
                      value={borrowDateRange}
                      onChange={(dates) => setBorrowDateRange(dates)}
                      format="DD/MM/YYYY"
                      style={{ width: "100%" }}
                      allowClear
                      presets={[
                        {
                          label: "Tháng này",
                          value: [
                            dayjs().startOf("month"),
                            dayjs().endOf("month"),
                          ],
                        },
                        {
                          label: "Quý này",
                          value: [
                            dayjs().startOf("quarter"),
                            dayjs().endOf("quarter"),
                          ],
                        },
                        {
                          label: "Năm nay",
                          value: [
                            dayjs().startOf("year"),
                            dayjs().endOf("year"),
                          ],
                        },
                      ]}
                      prefix={<CalendarOutlined />}
                    />
                  </Tooltip>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8}>
                  <Tooltip title="Lọc theo ngày trả">
                    <RangePicker
                      placeholder={["Từ ngày", "Đến ngày"]}
                      value={returnDateRange}
                      onChange={(dates) => setReturnDateRange(dates)}
                      format="DD/MM/YYYY"
                      style={{ width: "100%" }}
                      allowClear
                      presets={[
                        {
                          label: "Tháng này",
                          value: [
                            dayjs().startOf("month"),
                            dayjs().endOf("month"),
                          ],
                        },
                        {
                          label: "Quý này",
                          value: [
                            dayjs().startOf("quarter"),
                            dayjs().endOf("quarter"),
                          ],
                        },
                        {
                          label: "Năm nay",
                          value: [
                            dayjs().startOf("year"),
                            dayjs().endOf("year"),
                          ],
                        },
                      ]}
                      prefix={<CalendarOutlined />}
                    />
                  </Tooltip>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8}>
                  <Space style={{ width: "100%" }}>
                    <Select
                      mode="multiple"
                      placeholder="Trạng thái"
                      value={statusFilter}
                      onChange={setStatusFilter}
                      style={{ minWidth: "180px", flexGrow: 1 }}
                      allowClear
                      maxTagCount="responsive"
                      popupMatchSelectWidth={false}
                    >
                      <Option value="borrowing">
                        <ClockCircleOutlined style={{ color: "#1890ff" }} />{" "}
                        Đang mượn
                      </Option>
                      <Option value="ontime">
                        <CheckCircleOutlined style={{ color: "#52c41a" }} /> Trả
                        đúng hạn
                      </Option>
                      <Option value="late">
                        <CloseCircleOutlined style={{ color: "#f5222d" }} /> Trả
                        muộn
                      </Option>
                    </Select>
                    <Tooltip title="Đặt lại bộ lọc">
                      <Button
                        icon={<ReloadOutlined />}
                        onClick={resetFilters}
                        type="primary"
                        ghost
                      />
                    </Tooltip>
                  </Space>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Filter summary */}
          <div style={{ marginTop: 8 }}>
            <Space size="small">
              <Text type="secondary">
                <FilterOutlined /> Hiển thị {filteredData.length} /{" "}
                {historyData.length} kết quả
              </Text>
              {searchText && (
                <Tag color="blue" closable onClose={() => setSearchText("")}>
                  Tên sách: {searchText}
                </Tag>
              )}
              {borrowDateRange && borrowDateRange[0] && borrowDateRange[1] && (
                <Tag
                  color="green"
                  closable
                  onClose={() => setBorrowDateRange(null)}
                >
                  Ngày mượn: {borrowDateRange[0].format("DD/MM/YYYY")} -{" "}
                  {borrowDateRange[1].format("DD/MM/YYYY")}
                </Tag>
              )}
              {returnDateRange && returnDateRange[0] && returnDateRange[1] && (
                <Tag
                  color="orange"
                  closable
                  onClose={() => setReturnDateRange(null)}
                >
                  Ngày trả: {returnDateRange[0].format("DD/MM/YYYY")} -{" "}
                  {returnDateRange[1].format("DD/MM/YYYY")}
                </Tag>
              )}
              {statusFilter.length > 0 &&
                statusFilter.map((status) => (
                  <Tag
                    key={status}
                    color={
                      status === "borrowing"
                        ? "blue"
                        : status === "ontime"
                        ? "green"
                        : "red"
                    }
                    closable
                    onClose={() =>
                      setStatusFilter(statusFilter.filter((s) => s !== status))
                    }
                  >
                    {status === "borrowing"
                      ? "Đang mượn"
                      : status === "ontime"
                      ? "Trả đúng hạn"
                      : "Trả muộn"}
                  </Tag>
                ))}
            </Space>
          </div>
        </div>

        <Divider style={{ margin: "12px 0" }} />

        {/* Table section */}
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : filteredData.length > 0 ? (
          <Table
            columns={historyColumns}
            dataSource={filteredData.map((book, index) => ({
              ...book,
              key: index,
            }))}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              onChange: (page) => setCurrentPage(page),
              showSizeChanger: false,
              total: filteredData.length,
              showTotal: (total) => `Tổng ${total} sách`,
            }}
            rowKey="key"
            size="middle"
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              historyData.length > 0 ? (
                <Text strong style={{ fontSize: 16 }}>
                  Không tìm thấy kết quả nào phù hợp với bộ lọc
                </Text>
              ) : (
                <Text strong style={{ fontSize: 16 }}>
                  Bạn chưa mượn quyển sách nào từ thư viện
                </Text>
              )
            }
            style={{ padding: "20px 0" }}
          >
            {historyData.length > 0 && (
              <Button type="primary" onClick={resetFilters}>
                Xóa tất cả bộ lọc
              </Button>
            )}
          </Empty>
        )}
      </Card>
    </motion.div>
  );
}

export default BorrowHistory;

/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import {
  Input,
  Button,
  Avatar,
  Badge,
  Table,
  Spin,
  notification,
  Tag,
  Typography,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  BookOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import returnService from "/src/services/librarian/borrowReturnService.js";
import ViolationForm from "./ViolationForm";
import styles from "/src/styles/borrow/ReturnBooks.module.css";

const { Search } = Input;
const { Title } = Typography;

const ReturnBooks = () => {
  const [patronLoading, setPatronLoading] = useState(false);
  const [patronInfo, setPatronInfo] = useState(null);
  const [patronId, setPatronId] = useState("");
  const [violationModalVisible, setViolationModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const patronInputRef = useRef(null);

  // Focus on patron input when component mounts
  useEffect(() => {
    if (patronInputRef.current) {
      patronInputRef.current.focus();
    }
  }, []);

  // Search patron by ID
  const handlePatronSearch = async (value) => {
    if (!value) {
      notification.warning({
        message: "Vui lòng nhập mã bạn đọc",
        placement: "topRight",
      });
      return;
    }

    setPatronLoading(true);
    setPatronId(value);

    try {
      // Fetch patron information and their borrowed books
      const response = await returnService.getPatronReturnInfo(value);

      if (response.success) {
        setPatronInfo(response.data);
      } else {
        notification.error({
          message: "Không tìm thấy bạn đọc",
          description: response.message,
          placement: "topRight",
        });
        setPatronInfo(null);
      }
    } catch (error) {
      notification.error({
        message: "Lỗi hệ thống",
        description: "Không thể kết nối đến máy chủ",
        placement: "topRight",
      });
      setPatronInfo(null);
    } finally {
      setPatronLoading(false);
    }
  };

  // Handle reporting violation
  const handleReportViolation = (recordID) => {
    setSelectedRecord(recordID);
    setViolationModalVisible(true);
  };

  // Handle successful violation report
  const handleViolationSuccess = () => {
    setViolationModalVisible(false);
    notification.success({
      message: "Đã ghi nhận vi phạm",
      description: "Vi phạm đã được ghi nhận thành công",
      placement: "topRight",
    });
  };

  // Handle returning a book
  const handleReturnBook = async (recordID) => {
    try {
      const response = await returnService.returnBook(recordID);

      if (response.success) {
        notification.success({
          message: "Thành công",
          description: response.message || "Đã trả sách thành công",
          placement: "topRight",
        });

        // Refresh patron data
        handlePatronSearch(patronId);
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể trả sách",
          placement: "topRight",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi hệ thống",
        description: "Không thể kết nối đến máy chủ",
        placement: "topRight",
      });
    }
  };

  // Columns for the borrowed books table
  const borrowedBooksColumns = [
    {
      title: "Sách",
      dataIndex: "bookName",
      key: "bookName",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {record.bookImage ? (
            <img
              src={record.bookImage}
              alt={text}
              style={{
                width: 40,
                height: 56,
                objectFit: "cover",
                marginRight: 12,
                borderRadius: 4,
              }}
            />
          ) : (
            <BookOutlined style={{ fontSize: 24, marginRight: 12 }} />
          )}
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Ngày mượn",
      dataIndex: "borrowDate",
      key: "borrowDate",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hạn trả",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleReturnBook(record.borrowRecordID)}
        >
          Trả sách
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Title level={2} className={styles.header}>
        Quản lý trả sách
      </Title>

      {/* Patron Search Section */}
      <div className={styles.patronSearchSection}>
        <div className={styles.sectionTitle}>
          <IdcardOutlined /> Quét mã bạn đọc
        </div>
        <Search
          placeholder="Nhập hoặc quét mã bạn đọc"
          value={patronId}
          onChange={(e) => setPatronId(e.target.value)}
          onSearch={handlePatronSearch}
          enterButton={
            <Button type="primary" icon={<SearchOutlined />}>
              Tìm kiếm
            </Button>
          }
          size="large"
          loading={patronLoading}
          className={styles.barcodeInput}
          ref={patronInputRef}
        />

        {/* Display Patron Information */}
        {patronInfo && (
          <div className={styles.patronInfo}>
            <div className={styles.patronHeader}>
              <Avatar
                size={64}
                src={patronInfo.userImage}
                icon={!patronInfo.userImage && <UserOutlined />}
              />
              <div className={styles.patronName}>
                {patronInfo.fullName}
                <Badge
                  className={styles.patronBadge}
                  count={patronInfo.membershipType}
                  style={{
                    backgroundColor:
                      patronInfo.membershipType === "Vàng"
                        ? "#ffd700"
                        : patronInfo.membershipType === "Bạc"
                        ? "#c0c0c0"
                        : "#cd7f32",
                    color:
                      patronInfo.membershipType === "Vàng" ? "#5c3c00" : "#fff",
                  }}
                />
              </div>
            </div>

            <div className={styles.patronDetail}>
              <div className={styles.patronDetailItem}>
                <span className={styles.patronDetailLabel}>Mã bạn đọc:</span>
                <span className={styles.patronDetailValue}>
                  {patronInfo.userID}
                </span>
              </div>
              <div className={styles.patronDetailItem}>
                <span className={styles.patronDetailLabel}>Trạng thái:</span>
                <span className={styles.patronDetailValue}>
                  <Tag
                    color={patronInfo.status === "Hoạt động" ? "green" : "red"}
                  >
                    {patronInfo.status}
                  </Tag>
                </span>
              </div>
            </div>

            {/* Display Borrowed Books */}
            {patronInfo.borrowingBooks &&
            patronInfo.borrowingBooks.length > 0 ? (
              <div className={styles.booksList}>
                <div className={styles.booksHeader}>
                  <BookOutlined /> Sách đang mượn:{" "}
                  {patronInfo.borrowingBooks.length} cuốn
                </div>
                <Table
                  columns={borrowedBooksColumns}
                  dataSource={patronInfo.borrowingBooks}
                  rowKey="borrowRecordID"
                  pagination={{ pageSize: 5 }}
                  size="small"
                />
              </div>
            ) : (
              <div className={styles.noBooksMessage}>
                <BookOutlined /> Bạn đọc hiện không mượn sách nào
              </div>
            )}

            {/* Display Borrow History */}
            {patronInfo.borrowHistory &&
              patronInfo.borrowHistory.length > 0 && (
                <div className={styles.booksList} style={{ marginTop: "24px" }}>
                  <div className={styles.booksHeader}>
                    <BookOutlined /> Lịch sử mượn sách:{" "}
                    {patronInfo.borrowHistory.length} cuốn
                  </div>
                  <Table
                    columns={[
                      {
                        title: "Sách",
                        dataIndex: "bookName",
                        key: "bookName",
                        render: (text, record) => (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {record.bookImage ? (
                              <img
                                src={record.bookImage}
                                alt={text}
                                style={{
                                  width: 40,
                                  height: 56,
                                  objectFit: "cover",
                                  marginRight: 12,
                                  borderRadius: 4,
                                }}
                              />
                            ) : (
                              <BookOutlined
                                style={{ fontSize: 24, marginRight: 12 }}
                              />
                            )}
                            <span>{text}</span>
                          </div>
                        ),
                      },
                      {
                        title: "Ngày mượn",
                        dataIndex: "borrowDate",
                        key: "borrowDate",
                        render: (date) =>
                          new Date(date).toLocaleDateString("vi-VN"),
                      },
                      {
                        title: "Hạn trả",
                        dataIndex: "dueDate",
                        key: "dueDate",
                        render: (date) =>
                          new Date(date).toLocaleDateString("vi-VN"),
                      },
                      {
                        title: "Thao tác",
                        key: "action",
                        render: (_, record) => (
                          <Button
                            type="primary"
                            danger
                            size="small"
                            onClick={() =>
                              handleReportViolation(record.borrowRecordID)
                            }
                          >
                            Ghi nhận vi phạm
                          </Button>
                        ),
                      },
                      {
                        title: "Ngày trả",
                        dataIndex: "returnDate",
                        key: "returnDate",
                        render: (date) =>
                          date
                            ? new Date(date).toLocaleDateString("vi-VN")
                            : "Chưa trả",
                      },
                    ]}
                    dataSource={patronInfo.borrowHistory}
                    rowKey="borrowRecordID"
                    pagination={{ pageSize: 5 }}
                    size="small"
                  />
                </div>
              )}
          </div>
        )}
      </div>

      {/* Violation Recording Modal */}
      <ViolationForm
        visible={violationModalVisible}
        recordID={selectedRecord}
        onCancel={() => setViolationModalVisible(false)}
        onSuccess={handleViolationSuccess}
      />

      {/* Loading Overlay */}
      {patronLoading && (
        <div className={styles.loadingOverlay}>
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default ReturnBooks;

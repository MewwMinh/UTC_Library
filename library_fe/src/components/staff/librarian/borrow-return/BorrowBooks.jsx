// Remove book from selected books
const removeBook = (bookIndex) => {
  setSelectedBooks(selectedBooks.filter((_, index) => index !== bookIndex));
}; // src/components/BorrowBooks/BorrowBooks.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  Input,
  Button,
  Card,
  Avatar,
  Badge,
  Table,
  Spin,
  notification,
  Empty,
  Tag,
  Modal,
  Typography,
  List,
  Divider,
  Space,
  Alert,
  InputNumber,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  BookOutlined,
  ScanOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  IdcardOutlined,
  MinusOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import borrowReturnService from "/src/services/librarian/borrowReturnService.js";
import styles from "/src/styles/borrow/BorrowBooks.module.css";

const { Title, Text } = Typography;
const { Search } = Input;

const BorrowBooks = () => {
  const [patronLoading, setPatronLoading] = useState(false);
  const [patronInfo, setPatronInfo] = useState(null);
  const [patronId, setPatronId] = useState("");
  const [bookLoading, setBookLoading] = useState(false);
  const [bookCode, setBookCode] = useState("");
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [confirming, setConfirming] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [lendingResult, setLendingResult] = useState(null);

  const patronInputRef = useRef(null);
  const bookInputRef = useRef(null);

  // Focus on patron input when component mounts
  useEffect(() => {
    if (patronInputRef.current) {
      patronInputRef.current.focus();
    }
  }, []);

  // Reset book code input after adding a book
  useEffect(() => {
    if (!bookLoading && bookInputRef.current) {
      bookInputRef.current.focus();
    }
  }, [selectedBooks, bookLoading]);

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
      const response = await borrowReturnService.getPatronBorrowInfo(value);

      if (response.success) {
        setPatronInfo(response.data);

        // Switch focus to book input after finding patron
        setTimeout(() => {
          if (bookInputRef.current) {
            bookInputRef.current.focus();
          }
        }, 100);
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
    } finally {
      setPatronLoading(false);
    }
  };

  // Add book to selected books list
  const handleBookSearch = async (value) => {
    if (!value) {
      notification.warning({
        message: "Vui lòng nhập mã sách",
        placement: "topRight",
      });
      return;
    }

    if (!patronInfo) {
      notification.warning({
        message: "Vui lòng quét mã bạn đọc trước",
        placement: "topRight",
      });
      return;
    }

    // Check if the book is already added - if it is, increase quantity
    const existingBookIndex = selectedBooks.findIndex(
      (book) => book.bookID === value
    );
    if (existingBookIndex !== -1) {
      // Create a copy of selectedBooks array
      const updatedBooks = [...selectedBooks];
      // Increase quantity
      updatedBooks[existingBookIndex].quantity =
        (updatedBooks[existingBookIndex].quantity || 1) + 1;

      setSelectedBooks(updatedBooks);
      setBookCode("");

      notification.success({
        message: "Số lượng đã tăng",
        description: `Đã tăng số lượng sách "${selectedBooks[existingBookIndex].bookName}" lên ${updatedBooks[existingBookIndex].quantity}`,
        placement: "topRight",
      });
      return;
    }

    setBookLoading(true);
    setBookCode(value);

    try {
      // In a real scenario, you'd fetch book details from the API
      // For demonstration, we're mocking a response
      const bookResponse = await borrowReturnService.getBookByCode(value);

      if (bookResponse.success) {
        setSelectedBooks([
          ...selectedBooks,
          {
            ...bookResponse.data,
            key: selectedBooks.length,
            quantity: 1,
          },
        ]);
        setBookCode("");
      } else {
        notification.error({
          message: "Không tìm thấy sách",
          description: bookResponse.message,
          placement: "topRight",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi hệ thống",
        description: "Không thể kết nối đến máy chủ",
        placement: "topRight",
      });
    } finally {
      setBookLoading(false);
      setBookCode("");
    }
  };

  // Handle quantity change
  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity less than 1

    const updatedBooks = [...selectedBooks];
    updatedBooks[index].quantity = newQuantity;
    setSelectedBooks(updatedBooks);
  };

  // Reset all form fields
  const resetForm = () => {
    setPatronInfo(null);
    setPatronId("");
    setSelectedBooks([]);
    setBookCode("");
    setLendingResult(null);

    // Return focus to patron input
    if (patronInputRef.current) {
      patronInputRef.current.focus();
    }
  };

  // Confirm lending books
  const handleConfirmLending = async () => {
    if (!patronInfo) {
      notification.warning({
        message: "Vui lòng quét mã bạn đọc trước",
        placement: "topRight",
      });
      return;
    }

    if (selectedBooks.length === 0) {
      notification.warning({
        message: "Vui lòng thêm sách vào danh sách mượn",
        placement: "topRight",
      });
      return;
    }

    setConfirming(true);

    try {
      // Prepare data with book IDs and quantities
      const booksWithQuantities = selectedBooks.map((book) => ({
        bookID: book.bookID,
        quantity: book.quantity || 1,
      }));

      const response = await borrowReturnService.lendBooks({
        userID: patronInfo.userID,
        books: booksWithQuantities,
      });

      setLendingResult(response);
      setSuccessModalVisible(true);
    } catch (error) {
      notification.error({
        message: "Lỗi hệ thống",
        description: "Không thể kết nối đến máy chủ",
        placement: "topRight",
      });
    } finally {
      setConfirming(false);
    }
  };

  // Handle modal close and reset form if successful
  const handleModalClose = () => {
    setSuccessModalVisible(false);
    if (lendingResult?.success) {
      resetForm();
    }
  };

  // Check if patron has books that are near due date or overdue
  const hasNearOrOverdueBooks = patronInfo?.nearAndOverDueBooks?.length > 0;

  // Calculate days to due date
  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status tag and color based on days remaining
  const getDueStatusTag = (dueDate) => {
    const daysRemaining = getDaysRemaining(dueDate);

    if (daysRemaining < 0) {
      return <Tag color="error">Quá hạn {Math.abs(daysRemaining)} ngày</Tag>;
    } else if (daysRemaining <= 3) {
      return <Tag color="warning">Còn {daysRemaining} ngày</Tag>;
    } else {
      return <Tag color="success">Còn {daysRemaining} ngày</Tag>;
    }
  };

  // Columns for the near/overdue books table
  const booksColumns = [
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
      title: "Trạng thái",
      key: "status",
      render: (_, record) => getDueStatusTag(record.dueDate),
    },
  ];

  return (
    <div className={styles.container}>
      <Title level={2} className={styles.header}>
        Quản lý mượn sách
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

            {/* Display Near/Overdue Books Warning */}
            {hasNearOrOverdueBooks && (
              <div className={styles.booksList}>
                <div className={styles.booksWarning}>
                  <WarningOutlined /> Bạn đọc có{" "}
                  {patronInfo.nearAndOverDueBooks.length} sách sắp đến hạn hoặc
                  quá hạn trả
                </div>
                <Table
                  columns={booksColumns}
                  dataSource={patronInfo.nearAndOverDueBooks}
                  rowKey="borrowRecordID"
                  pagination={false}
                  size="small"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Book Scanning Section */}
      {patronInfo && (
        <div className={styles.bookScanSection}>
          <div className={styles.sectionTitle}>
            <ScanOutlined /> Quét mã sách
          </div>
          <Search
            placeholder="Nhập hoặc quét mã sách"
            value={bookCode}
            onChange={(e) => setBookCode(e.target.value)}
            onSearch={handleBookSearch}
            enterButton={
              <Button type="primary" icon={<PlusOutlined />}>
                Thêm sách
              </Button>
            }
            size="large"
            loading={bookLoading}
            className={styles.barcodeInput}
            ref={bookInputRef}
            disabled={!patronInfo}
          />

          {/* Selected Books List */}
          <div className={styles.selectedBooks}>
            {selectedBooks.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={selectedBooks}
                renderItem={(book, index) => (
                  <div className={styles.bookItem}>
                    <img
                      src={
                        book.coverImage ||
                        "https://via.placeholder.com/50x70?text=No+Image"
                      }
                      alt={book.bookName}
                      className={styles.bookImage}
                    />
                    <div className={styles.bookInfo}>
                      <div className={styles.bookTitle}>{book.bookName}</div>
                      <div className={styles.bookAuthor}>{book.author}</div>
                      <div className={styles.quantityInputWrapper}>
                        <Button
                          icon={<MinusCircleOutlined />}
                          size="small"
                          onClick={() =>
                            handleQuantityChange(
                              index,
                              Math.max(1, (book.quantity || 1) - 1)
                            )
                          }
                          disabled={(book.quantity || 1) <= 1}
                        />
                        <InputNumber
                          min={1}
                          className={styles.quantityInput}
                          value={book.quantity || 1}
                          onChange={(value) =>
                            handleQuantityChange(index, value)
                          }
                          size="small"
                          controls={false}
                        />
                        <Button
                          icon={<PlusCircleOutlined />}
                          size="small"
                          onClick={() =>
                            handleQuantityChange(
                              index,
                              (book.quantity || 1) + 1
                            )
                          }
                        />
                      </div>
                    </div>
                    <button
                      className={styles.removeBookBtn}
                      onClick={() => removeBook(index)}
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                )}
              />
            ) : (
              <div className={styles.emptyState}>
                <BookOutlined className={styles.emptyStateIcon} />
                <div>Quét mã sách để thêm vào danh sách mượn</div>
              </div>
            )}
          </div>

          {/* Actions Section */}
          <div className={styles.actionsSection}>
            <Button
              className={styles.clearBtn}
              onClick={resetForm}
              disabled={confirming}
            >
              Làm mới
            </Button>
            <Button
              type="primary"
              className={styles.goldenButton}
              icon={<CheckCircleOutlined />}
              loading={confirming}
              onClick={handleConfirmLending}
              disabled={selectedBooks.length === 0 || confirming}
            >
              Xác nhận cho mượn
            </Button>
          </div>
        </div>
      )}

      {/* Success/Error Modal */}
      <Modal
        title={
          lendingResult?.success
            ? "Cho mượn sách thành công"
            : "Cho mượn sách thất bại"
        }
        open={successModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="ok" type="primary" onClick={handleModalClose}>
            {lendingResult?.success ? "Hoàn tất" : "Đóng"}
          </Button>,
        ]}
      >
        {lendingResult?.success ? (
          <>
            <Alert
              message="Thành công"
              description="Sách đã được cho mượn thành công"
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <p>
              Bạn đọc: <strong>{patronInfo?.fullName}</strong>
            </p>
            <p>Sách được mượn:</p>
            <ul>
              {selectedBooks.map((book, index) => (
                <li key={index}>
                  {book.bookName}{" "}
                  <strong>(Số lượng: {book.quantity || 1})</strong>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <Alert
            message="Thất bại"
            description={
              lendingResult?.message || "Đã xảy ra lỗi khi cho mượn sách"
            }
            type="error"
            showIcon
          />
        )}
      </Modal>

      {/* Loading Overlay */}
      {(patronLoading || bookLoading || confirming) && (
        <div className={styles.loadingOverlay}>
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default BorrowBooks;

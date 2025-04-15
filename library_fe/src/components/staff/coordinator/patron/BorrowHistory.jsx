/* eslint-disable no-unused-vars */
// src/components/patron/BorrowHistory.jsx
import React, { useState, useEffect } from "react";
import { Table, Tag, Image, Empty, notification } from "antd";
import {
  BookOutlined,
  HistoryOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import patronService from "/src/services/coordinator/patronService.js";
import styles from "/src/styles/members/BorrowHistory.module.css";
import { useNavigate, useParams } from "react-router-dom";

const BorrowHistory = () => {
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { patronID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBorrowHistory = async () => {
      try {
        setLoading(true);
        const response = await patronService.getPatronBorrowHistory(patronID);

        if (response.success) {
          setBorrowRecords(response.data || []);
        } else {
          notification.error({
            message: "Lỗi",
            description: response.message || "Không thể tải lịch sử mượn sách",
          });
        }
      } catch (error) {
        notification.error({
          message: "Lỗi kết nối",
          description: "Không thể kết nối đến máy chủ",
        });
      } finally {
        setLoading(false);
      }
    };

    if (patronID) {
      fetchBorrowHistory();
    }
  }, [patronID]);

  // Xác định trạng thái của sách
  const getBookStatus = (record) => {
    if (record.returnDate) {
      return { status: "Đã trả", color: "success" };
    }

    const dueDate = moment(record.dueDate);
    const now = moment();

    if (now.isAfter(dueDate)) {
      return { status: "Quá hạn", color: "error" };
    }

    // Sắp đến hạn (còn 7 ngày hoặc ít hơn)
    if (dueDate.diff(now, "days") <= 7) {
      return { status: "Sắp đến hạn", color: "warning" };
    }

    return { status: "Đang mượn", color: "processing" };
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return moment(dateString).format("DD/MM/YYYY");
  };

  // Tính toán ngày còn lại
  const getDaysRemaining = (dueDate, returnDate) => {
    if (returnDate) return "0";

    const due = moment(dueDate);
    const now = moment();
    const days = due.diff(now, "days");

    if (days < 0) {
      return `Quá hạn ${Math.abs(days)} ngày`;
    }

    return `Còn ${days} ngày`;
  };

  const columns = [
    {
      title: "Sách",
      dataIndex: "bookName",
      key: "bookName",
      render: (text, record) => (
        <div
          className={styles.bookInfo}
          onClick={() => navigate(`/staff/books/details/${record.bookID}`)}
        >
          <Image
            width={50}
            height={70}
            src={record.bookImage}
            alt={text}
            className={styles.bookImage}
          />
          <div style={{ marginLeft: 20 }}>
            <div className={styles.bookTitle}>{text}</div>
            <div className={styles.bookId}>{record.author}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Ngày mượn",
      dataIndex: "borrowDate",
      key: "borrowDate",
      render: (date) => (
        <div className={styles.dateInfo}>
          <HistoryOutlined className={styles.dateIcon} />
          {formatDate(date)}
        </div>
      ),
    },
    {
      title: "Hạn trả",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => (
        <div className={styles.dateInfo}>
          <ClockCircleOutlined className={styles.dateIcon} />
          {formatDate(date)}
        </div>
      ),
    },
    {
      title: "Ngày trả",
      dataIndex: "returnDate",
      key: "returnDate",
      render: (date) => (
        <div className={styles.dateInfo}>
          {date ? (
            <>
              <HistoryOutlined className={styles.dateIcon} />
              {formatDate(date)}
            </>
          ) : (
            "—"
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (text, record) => {
        const { status, color } = getBookStatus(record);
        return (
          <div>
            <Tag color={color}>{status}</Tag>
            <div className={styles.daysRemaining}>
              {!record.returnDate && (
                <small>
                  {getDaysRemaining(record.dueDate, record.returnDate)}
                </small>
              )}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className={styles.borrowHistoryContainer}>
      <Table
        dataSource={borrowRecords}
        columns={columns}
        rowKey="borrowRecordID"
        loading={loading}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          showTotal: (total) => `Tổng cộng ${total} bản ghi`,
        }}
        locale={{
          emptyText: <Empty description="Không có lịch sử mượn sách" />,
        }}
        className={styles.borrowTable}
      />
    </div>
  );
};

export default BorrowHistory;

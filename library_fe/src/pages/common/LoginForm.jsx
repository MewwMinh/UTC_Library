import { useState, useEffect } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  login,
  selectAuthLoading,
  selectAuthError,
  selectAuthErrorCode,
} from "/src/redux/features/authSlice";
// import authService from "../api/authService";
import "./LoginForm.css";

const LoginForm = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy trạng thái từ Redux store
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const errorCode = useSelector(selectAuthErrorCode);

  // State cho hiệu ứng 3D
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [light, setLight] = useState({ x: 50, y: 50 });

  // Handle mouse move for 3D lighting effect
  const handleMouseMove = (e) => {
    const card = document.querySelector(".login-card");
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;

    setCardPosition({ x: rotateY, y: rotateX });
    setLight({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  // Reset position on mouse leave
  const handleMouseLeave = () => {
    setCardPosition({ x: 0, y: 0 });
    setLight({ x: 50, y: 50 });
  };

  // Handle form submission
  const onFinish = async (values) => {
    // Dispatch login action to Redux
    const result = await dispatch(
      login({
        username: values.username,
        password: values.password,
      })
    );

    // Kiểm tra kết quả dispatch
    if (login.fulfilled.match(result)) {
      message.success("Đăng nhập thành công!");

      // Lấy scope từ kết quả
      const scope = result.payload.scope;

      // Điều hướng dựa vào scope
      if (scope === "LIBRARIAN" || scope === "COORDINATOR") {
        navigate("/staff/dashboard");
      } else if (scope === "MANAGER") {
        navigate("/manager/dashboard");
      } else if (
        scope === "TEACHER" ||
        scope === "STUDENT" ||
        scope === "RESEARCHER" ||
        scope === "PATRON"
      ) {
        navigate("/user/dashboard");
      } else {
        // Default route if scope is not recognized
        navigate("/dashboard");
      }
    }
  };

  // Hiển thị thông báo lỗi khi có lỗi từ Redux
  useEffect(() => {
    if (error) {
      if (errorCode === 1001) {
        message.error("Tài khoản không tồn tại");
      } else if (errorCode === 1002) {
        message.error("Mật khẩu không đúng");
      } else {
        message.error(error);
      }
    }
  }, [error, errorCode]);

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="book-shape book1"></div>
        <div className="book-shape book2"></div>
        <div className="book-shape book3"></div>
        <div className="book-shape book4"></div>
        <div className="book-shape book5"></div>
      </div>

      <div
        className="login-card"
        style={{
          transform: `rotateX(${cardPosition.y}deg) rotateY(${cardPosition.x}deg)`,
          backgroundImage: `radial-gradient(circle at ${light.x}% ${light.y}%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="card-content">
          <div className="login-header">
            <div className="library-logo">
              <img src="/logo-utc.png" alt="Logo Trường ĐH GTVT" />
            </div>
            <h1>Đăng Nhập</h1>
            <p className="subtitle">
              Thư viện Trường Đại học Giao thông vận tải
            </p>
          </div>

          <Form
            form={form}
            name="login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mã sinh viên/giảng viên/bạn đọc!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Mã sinh viên/Mã giảng viên/Mã bạn đọc"
                className="login-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
                className="login-input"
              />
            </Form.Item>

            <Form.Item className="remember-forgot">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              </Form.Item>
              <a href="#" className="forgot-link">
                Quên mật khẩu?
              </a>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="login-button"
                block
              >
                Đăng Nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

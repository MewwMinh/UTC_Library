// src/components/user/event/Event.jsx
import { useEffect, useState, useRef } from "react";
import { ListEvent, RegisteredEvents } from "/src/components/user/event";
import { Card, Typography, Row, Col } from "antd";
import {
  CalendarOutlined,
  BookOutlined,
  ReadOutlined,
  TeamOutlined,
  BulbOutlined,
  StarOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

// Floating element component (bubbles and stars)
const FloatingElement = ({
  type,
  minSize = 20,
  maxSize = 70,
  minDuration = 8,
  maxDuration = 20,
}) => {
  // Generate random values
  const size = Math.floor(Math.random() * (maxSize - minSize)) + minSize;
  const left = Math.floor(Math.random() * 100); // random horizontal position
  const duration =
    Math.floor(Math.random() * (maxDuration - minDuration)) + minDuration;
  const delay = Math.random() * 5; // random delay between 0-5s
  const opacity = Math.random() * 0.4 + 0.1; // random opacity between 0.1-0.5

  let style = {
    position: "absolute",
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    bottom: "-50px",
    animation: `floatUp ${duration}s ease-in-out ${delay}s infinite`,
    opacity: opacity,
  };

  if (type === "bubble") {
    style = {
      ...style,
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(5px)",
    };
  } else if (type === "star") {
    // For stars, we'll keep the size reference but actually render an icon
    style = {
      ...style,
      fontSize: `${size}px`,
      color: "#FFD700",
      height: "auto",
      width: "auto",
      animation: `floatUp ${duration}s ease-in-out ${delay}s infinite, twinkle 2s ease-in-out ${
        delay % 2
      }s infinite`,
    };

    return <StarOutlined style={style} />;
  }

  return <div style={style} />;
};

// Animated event card for the header
const AnimatedEventCard = ({ icon, title, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered
          ? "rgba(255, 255, 255, 0.25)"
          : "rgba(255, 255, 255, 0.1)",
        padding: "12px 18px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 10px 20px rgba(0, 0, 0, 0.2)"
          : "0 0 0 rgba(0, 0, 0, 0)",
        cursor: "pointer",
        animation: `fadeIn 0.5s ease ${delay}s both`,
      }}
    >
      {icon}
      <Text
        style={{
          color: "white",
          margin: 0,
          marginLeft: "8px",
          fontWeight: isHovered ? "bold" : "normal",
        }}
      >
        {title}
      </Text>
    </div>
  );
};

export default function Event() {
  const [isVisible, setIsVisible] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);
  const headerRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

    // Create 15 random floating elements (10 bubbles and 5 stars)
    const elements = [];
    for (let i = 0; i < 10; i++) {
      elements.push({ id: `bubble-${i}`, type: "bubble" });
    }
    for (let i = 0; i < 5; i++) {
      elements.push({ id: `star-${i}`, type: "star" });
    }
    setFloatingElements(elements);

    // Create animations keyframes dynamically
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes floatUp {
        0% { 
          transform: translateY(0) rotate(0);
          opacity: 0; 
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 0.8;
        }
        100% { 
          transform: translateY(-800px) rotate(${
            Math.random() > 0.5 ? "+" : "-"
          }${Math.floor(Math.random() * 45)}deg);
          opacity: 0;
        }
      }
      
      @keyframes twinkle {
        0% { opacity: 0.4; }
        50% { opacity: 1; }
        100% { opacity: 0.4; }
      }
      
      @keyframes glow {
        0% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
        50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.8); }
        100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {/* Animated Hero Header */}
      <Card
        ref={headerRef}
        style={{
          borderRadius: "16px",
          marginBottom: "32px",
          background: "linear-gradient(120deg, #1d3557 0%, #457b9d 100%)",
          color: "white",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
          border: "none",
          position: "relative",
          minHeight: "280px",
        }}
        bodyStyle={{ padding: "0" }}
      >
        {/* Floating bubbles and stars */}
        {floatingElements.map((element) => (
          <FloatingElement
            key={element.id}
            type={element.type}
            minSize={element.type === "star" ? 12 : 20}
            maxSize={element.type === "star" ? 35 : 70}
            minDuration={element.type === "star" ? 12 : 8}
            maxDuration={element.type === "star" ? 25 : 20}
          />
        ))}

        <Row>
          <Col
            xs={24}
            md={16}
            style={{
              padding: "40px",
              position: "relative",
              zIndex: 5,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
                animation: isVisible ? "fadeIn 0.8s ease" : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.2)",
                  marginRight: "20px",
                  animation: isVisible
                    ? "glow 3s ease-in-out infinite"
                    : "none",
                }}
              >
                <ReadOutlined
                  style={{
                    fontSize: 32,
                    animation: isVisible
                      ? "rotate 10s linear infinite"
                      : "none",
                  }}
                />
              </div>
              <Title
                level={1}
                style={{
                  margin: 0,
                  color: "white",
                  fontSize: "2.5rem",
                  textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
                }}
              >
                Sự kiện thư viện
              </Title>
            </div>
            <Text
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: "16px",
                display: "block",
                marginBottom: "24px",
                animation: isVisible ? "fadeIn 1s ease 0.3s both" : "none",
              }}
            >
              Khám phá và tham gia các sự kiện hấp dẫn tại thư viện Đại học Giao
              thông Vận tải
            </Text>
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <AnimatedEventCard
                icon={
                  <CalendarOutlined
                    style={{ fontSize: "18px", color: "#FFD700" }}
                  />
                }
                title="Hội thảo"
                delay={0.5}
              />
              <AnimatedEventCard
                icon={
                  <BookOutlined
                    style={{ fontSize: "18px", color: "#FF6B6B" }}
                  />
                }
                title="Triển lãm sách"
                delay={0.7}
              />
              <AnimatedEventCard
                icon={
                  <TeamOutlined
                    style={{ fontSize: "18px", color: "#4ECDC4" }}
                  />
                }
                title="Giao lưu học thuật"
                delay={0.9}
              />
              <AnimatedEventCard
                icon={
                  <BulbOutlined
                    style={{ fontSize: "18px", color: "#FFE66D" }}
                  />
                }
                title="Chia sẻ kiến thức"
                delay={1.1}
              />
            </div>
          </Col>
          <Col xs={0} md={8} style={{ position: "relative" }}>
            {/* Background gradients */}
            <div
              style={{
                position: "absolute",
                right: "-100px",
                bottom: "-100px",
                width: "400px",
                height: "400px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
                opacity: 0.7,
              }}
            />
            <div
              style={{
                position: "absolute",
                right: "30px",
                top: "20px",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
                opacity: 0.6,
              }}
            />
          </Col>
        </Row>
      </Card>

      {/* Content Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          animation: isVisible ? "fadeIn 1s ease 0.5s both" : "none",
        }}
      >
        <ListEvent />
        <RegisteredEvents />
      </div>
    </div>
  );
}

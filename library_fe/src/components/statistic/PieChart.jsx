import { useState, useEffect, useRef } from "react";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Sector,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Typography, Card } from "antd";
import styles from "/src/styles/statistic/PieChart.module.css";

const { Title } = Typography;

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke={fill}
        strokeWidth={2}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 8}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <text
        x={cx}
        y={cy}
        dy={-20}
        textAnchor="middle"
        fill="#333"
        className="font-medium"
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill="#333"
        className="text-lg font-bold"
      >
        {value}
      </text>
      <text x={cx} y={cy} dy={32} textAnchor="middle" fill="#999" fontSize={14}>
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const ModernPieChart = ({
  data = [],
  title = "Biểu đồ",
  colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
  legendPosition = "bottom",
  showLegend = true,
  height = 400,
  backgroundColors = ["#f0f9ff", "#e6f7ff"], // Màu nền gradient mặc định
  autoAnimate = false, // Tắt tự động luân phiên theo mặc định
  decorations = true, // Hiển thị trang trí theo mặc định
}) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const animateRef = useRef(null);
  const chartRef = useRef(null);

  const hasData = data && data.length > 0;

  const totalValue = hasData
    ? data.reduce((sum, entry) => sum + entry.value, 0)
    : 0;

  // Preprocess data to include percent information
  const processedData = hasData
    ? data.map((item) => ({
        ...item,
        percent: item.value / totalValue,
      }))
    : [];

  useEffect(() => {
    if (hasData && autoAnimate) {
      // Reset animation when data changes or autoAnimate is enabled
      let currentIndex = -1;

      const animate = () => {
        currentIndex = (currentIndex + 1) % processedData.length;
        setActiveIndex(currentIndex);
      };

      // Start animation immediately
      animate();

      // Set interval for animation
      animateRef.current = setInterval(animate, 2500);

      return () => {
        if (animateRef.current) {
          clearInterval(animateRef.current);
        }
      };
    } else {
      setActiveIndex(null);
    }
  }, [hasData, processedData.length, autoAnimate]);

  const onPieEnter = (_, index) => {
    if (animateRef.current) {
      clearInterval(animateRef.current);
    }
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    if (!autoAnimate) {
      setActiveIndex(null);
      return;
    }

    let currentIndex = activeIndex !== null ? activeIndex : -1;

    const animate = () => {
      currentIndex = (currentIndex + 1) % processedData.length;
      setActiveIndex(currentIndex);
    };

    animate();
    animateRef.current = setInterval(animate, 2500);
  };

  // Chuyển hex sang rgba với opacity
  const hexToRGBA = (hex, alpha) => {
    let r = 0,
      g = 0,
      b = 0;
    if (hex.length === 4) {
      r = "0x" + hex[1] + hex[1];
      g = "0x" + hex[2] + hex[2];
      b = "0x" + hex[3] + hex[3];
    } else if (hex.length === 7) {
      r = "0x" + hex[1] + hex[2];
      g = "0x" + hex[3] + hex[4];
      b = "0x" + hex[5] + hex[6];
    }
    return `rgba(${+r},${+g},${+b},${alpha})`;
  };

  // Tạo gradient string cho background
  const gradientBackground = `linear-gradient(135deg, ${backgroundColors[0]} 0%, ${backgroundColors[1]} 100%)`;

  return (
    <Card
      className={`overflow-hidden ${styles.chartCard}`}
      style={{
        background: gradientBackground,
        borderRadius: "12px",
        position: "relative",
      }}
      bodyStyle={{
        padding: "24px",
        height: "100%",
      }}
      ref={chartRef}
    >
      {/* Trang trí nếu được bật */}
      {decorations && (
        <>
          <div className={styles.decorationCircle1}></div>
          <div className={styles.decorationCircle2}></div>
          <div className={styles.decorationCircle3}></div>
        </>
      )}

      <Title level={4} className="m-0 mb-4 relative z-10">
        {title}
      </Title>

      <div className="relative z-10">
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPie>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={processedData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={130}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              animationDuration={800}
              paddingAngle={2}
            >
              {processedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                  stroke={colors[index % colors.length]}
                  strokeWidth={activeIndex === index ? 2 : 0}
                />
              ))}
            </Pie>
            {showLegend && (
              <Legend
                layout={
                  legendPosition === "right" || legendPosition === "left"
                    ? "vertical"
                    : "horizontal"
                }
                align={
                  legendPosition === "top" || legendPosition === "bottom"
                    ? "center"
                    : "right"
                }
                verticalAlign={
                  legendPosition === "right" || legendPosition === "left"
                    ? "middle"
                    : legendPosition
                }
                iconType="circle"
                iconSize={10}
                wrapperStyle={{
                  paddingTop: legendPosition === "bottom" ? 16 : 0,
                  paddingBottom: legendPosition === "top" ? 16 : 0,
                }}
              />
            )}
          </RechartsPie>
        </ResponsiveContainer>
      </div>

      {hasData && (
        <div className={`${styles.container} relative z-10`}>
          {processedData.map((entry, index) => (
            <div
              key={`stat-${index}`}
              className={`${styles.item} ${
                activeIndex === index ? styles.activeItem : ""
              }`}
              style={{
                background: `linear-gradient(135deg, ${hexToRGBA(
                  colors[index % colors.length],
                  0.1
                )}, #ffffff)`,
              }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => !autoAnimate && setActiveIndex(null)}
            >
              <div
                className={styles.colorDot}
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <div className={styles.content}>
                <strong className={styles.name}>{entry.name}</strong>
                <span className={styles.value}>
                  {entry.value}
                  <span className={styles.percent}>
                    {` (${(entry.percent * 100).toFixed(1)}%)`}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ModernPieChart;

import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";

// Random star animation component for header
const AnimatedStar = ({ delay, size, duration, left }) => {
  const [position, setPosition] = useState({ y: 100, opacity: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setPosition({ y: 0, opacity: 1 });

      // Reset animation after it completes
      const resetTimer = setTimeout(() => {
        setPosition({ y: 100, opacity: 0 });
      }, duration * 1000);

      return () => clearTimeout(resetTimer);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay, duration]);

  return (
    <div
      className="absolute transition-all"
      style={{
        left: `${left}%`,
        bottom: `${position.y}%`,
        opacity: position.opacity,
        transition: `all ${duration}s ease-out`,
      }}
    >
      <Star size={size} fill="gold" color="gold" />
    </div>
  );
};

// Header Component - Không cần API, chỉ hiển thị giao diện
const Header = () => {
  const stars = Array.from({ length: 10 }).map((_, index) => ({
    id: index,
    size: Math.floor(Math.random() * 16) + 16, // 16px to 32px
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2, // 2-5 seconds
    left: Math.random() * 80 + 10, // 10% to 90% from left
  }));

  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg mb-6 overflow-hidden h-32">
      <h1 className="text-2xl font-bold">Thành Tích Của Bạn</h1>
      <p className="text-lg opacity-80">
        Theo dõi sự tiến bộ và thành tích của bạn
      </p>

      {/* Animated stars */}
      {stars.map((star) => (
        <AnimatedStar
          key={star.id}
          size={star.size}
          delay={star.delay}
          duration={star.duration}
          left={star.left}
        />
      ))}
    </div>
  );
};

export default Header;

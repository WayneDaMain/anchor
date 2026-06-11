import React, { useState, useEffect, useRef } from 'react';
import Icon from '../AppIcon';

export default function PullToRefresh({ onRefresh, children }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const startYRef = useRef(0);
  const isAtTopRef = useRef(true);

  useEffect(() => {
    const handleScroll = () => {
      isAtTopRef.current = window.scrollY === 0;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTouchStart = (e) => {
    if (!isAtTopRef.current || isRefreshing) return;
    startYRef.current = e.touches[0].pageY;
    setIsPulling(true);
  };

  const handleTouchMove = (e) => {
    if (!isAtTopRef.current || !isPulling || isRefreshing) return;
    const currentY = e.touches[0].pageY;
    const diff = currentY - startYRef.current;

    if (diff > 0) {
      // Prevent browser default pull-to-refresh on mobile if supported
      if (e.cancelable) e.preventDefault();
      // Apply exponential friction
      const friction = 0.4;
      const calculatedDistance = Math.min(diff * friction, 75);
      setPullDistance(calculatedDistance);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling || isRefreshing) return;
    setIsPulling(false);

    if (pullDistance >= 55) {
      setIsRefreshing(true);
      setPullDistance(50); // Lock it at loader height during refresh
      try {
        if (onRefresh) {
          await onRefresh();
        }
      } catch (err) {
        console.error("Refresh failed:", err);
      } finally {
        // Smooth snapback
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 600);
      }
    } else {
      setPullDistance(0);
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateY(${pullDistance}px)`,
        transition: isPulling ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
      className="relative min-h-screen"
    >
      {/* Pull Indicator */}
      <div
        className="absolute left-0 right-0 -top-10 flex justify-center pointer-events-none transition-opacity duration-200"
        style={{
          opacity: pullDistance > 10 ? 1 : 0,
          transform: `translateY(${Math.min(pullDistance, 45)}px)`,
        }}
      >
        <div className="w-9 h-9 rounded-full bg-card border border-border/80 shadow-md flex items-center justify-center text-accent">
          {isRefreshing ? (
            <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          ) : (
            <div
              style={{
                transform: `rotate(${Math.min(pullDistance * 4, 360)}deg)`,
                transition: isPulling ? 'none' : 'transform 0.1s linear',
              }}
            >
              <Icon name="ArrowDown" size={16} />
            </div>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}

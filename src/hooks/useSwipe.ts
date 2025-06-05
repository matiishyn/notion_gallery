import { useEffect, useRef, useState } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeReturn {
  touchProps: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
  mouseProps: {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
  };
}

const useSwipe = (handlers: SwipeHandlers, threshold = 50): SwipeReturn => {
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number, y: number } | null>(null);
  const [mouseDown, setMouseDown] = useState(false);

  // Reset if the user hasn't finished the swipe within a certain timeframe
  const resetTimerRef = useRef<number | null>(null);
  
  const resetTouch = () => {
    setTouchStart(null);
    setTouchEnd(null);
    setMouseDown(false);
    
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  };

  // Handle swipe detection
  useEffect(() => {
    if (!touchStart || !touchEnd) return;
    
    const distanceX = touchEnd.x - touchStart.x;
    const distanceY = touchEnd.y - touchStart.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    
    if (isHorizontalSwipe) {
      if (distanceX > threshold && handlers.onSwipeRight) {
        handlers.onSwipeRight();
      } else if (distanceX < -threshold && handlers.onSwipeLeft) {
        handlers.onSwipeLeft();
      }
    } else {
      if (distanceY > threshold && handlers.onSwipeDown) {
        handlers.onSwipeDown();
      } else if (distanceY < -threshold && handlers.onSwipeUp) {
        handlers.onSwipeUp();
      }
    }
    
    resetTouch();
  }, [touchStart, touchEnd, handlers, threshold]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
    
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(resetTouch, 500);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
    
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(resetTouch, 500);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.clientX,
      y: e.clientY
    });
    setMouseDown(true);
    
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(resetTouch, 500);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!mouseDown) return;
    
    setTouchEnd({
      x: e.clientX,
      y: e.clientY
    });
    
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(resetTouch, 500);
  };

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  return {
    touchProps: {
      onTouchStart,
      onTouchMove,
      onTouchEnd: resetTouch
    },
    mouseProps: {
      onMouseDown,
      onMouseMove,
      onMouseUp: resetTouch,
      onMouseLeave: resetTouch
    }
  };
};

export default useSwipe;
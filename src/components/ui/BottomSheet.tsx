import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

export type SnapPoint = 'peek' | 'half' | 'full';

interface BottomSheetProps {
  children: React.ReactNode;
  peekContent?: React.ReactNode;
  snap?: SnapPoint;
  onSnapChange?: (snap: SnapPoint) => void;
  peekHeight?: number;
  halfRatio?: number;
  fullRatio?: number;
  bottomOffset?: number;
  className?: string;
}

const SNAP_ORDER: SnapPoint[] = ['peek', 'half', 'full'];

export const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  peekContent,
  snap: controlledSnap,
  onSnapChange,
  peekHeight = 148,
  halfRatio = 0.48,
  fullRatio = 0.88,
  bottomOffset = 0,
  className = '',
}) => {
  const [internalSnap, setInternalSnap] = useState<SnapPoint>('half');
  const snap = controlledSnap ?? internalSnap;

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const startHeight = useRef(0);

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const usableHeight = Math.max(windowHeight - bottomOffset, peekHeight + 80);

  const getSnapHeight = useCallback((s: SnapPoint): number => {
    switch (s) {
      case 'peek': return peekHeight;
      case 'half': return Math.round(usableHeight * halfRatio);
      case 'full': return Math.round(usableHeight * fullRatio);
    }
  }, [usableHeight, peekHeight, halfRatio, fullRatio]);

  const currentHeight = getSnapHeight(snap);

  const updateSnap = useCallback((newSnap: SnapPoint) => {
    setInternalSnap(newSnap);
    onSnapChange?.(newSnap);
  }, [onSnapChange]);

  // Programmatic snap
  const snapTo = useCallback((target: SnapPoint) => {
    updateSnap(target);
  }, [updateSnap]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    startHeight.current = getSnapHeight(snap);
    setIsDragging(true);
    setDragOffset(0);
  }, [snap, getSnapHeight]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaY = touchStartY.current - e.touches[0].clientY; // positive = dragging up
    setDragOffset(deltaY);
  }, [isDragging]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    const deltaTime = Math.max(Date.now() - touchStartTime.current, 1);
    const velocity = deltaY / deltaTime; // px/ms, positive = up

    const finalHeight = Math.max(peekHeight, Math.min(
      getSnapHeight('full'),
      startHeight.current + deltaY
    ));

    // Find nearest snap point, considering velocity
    const currentIdx = SNAP_ORDER.indexOf(snap);
    let targetSnap: SnapPoint = snap;

    if (velocity > 0.4) {
      // Fast swipe up → next higher snap
      targetSnap = SNAP_ORDER[Math.min(currentIdx + 1, SNAP_ORDER.length - 1)];
    } else if (velocity < -0.4) {
      // Fast swipe down → next lower snap
      targetSnap = SNAP_ORDER[Math.max(currentIdx - 1, 0)];
    } else {
      // Slow drag → snap to nearest height
      let minDist = Infinity;
      SNAP_ORDER.forEach((s) => {
        const dist = Math.abs(finalHeight - getSnapHeight(s));
        if (dist < minDist) {
          minDist = dist;
          targetSnap = s;
        }
      });
    }

    setDragOffset(0);
    updateSnap(targetSnap);
  }, [isDragging, snap, peekHeight, getSnapHeight, updateSnap]);

  // Mouse drag support for desktop testing
  const mouseStartY = useRef(0);
  const isMouseDragging = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    mouseStartY.current = e.clientY;
    isMouseDragging.current = true;
    startHeight.current = getSnapHeight(snap);
    setIsDragging(true);
    setDragOffset(0);
    e.preventDefault();
  }, [snap, getSnapHeight]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDragging.current) return;
      const deltaY = mouseStartY.current - e.clientY;
      setDragOffset(deltaY);
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isMouseDragging.current) return;
      isMouseDragging.current = false;
      setIsDragging(false);

      const deltaY = mouseStartY.current - e.clientY;
      const finalHeight = Math.max(peekHeight, Math.min(
        getSnapHeight('full'),
        startHeight.current + deltaY
      ));

      let targetSnap: SnapPoint = snap;
      let minDist = Infinity;
      SNAP_ORDER.forEach((s) => {
        const dist = Math.abs(finalHeight - getSnapHeight(s));
        if (dist < minDist) {
          minDist = dist;
          targetSnap = s;
        }
      });

      setDragOffset(0);
      updateSnap(targetSnap);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [snap, peekHeight, getSnapHeight, updateSnap]);

  const displayHeight = isDragging
    ? Math.max(peekHeight, Math.min(getSnapHeight('full'), startHeight.current + dragOffset))
    : currentHeight;

  const isFullyExpanded = snap === 'full' && !isDragging;

  return (
    <motion.div
      className={`fixed left-0 right-0 z-30 bg-white rounded-t-[28px] shadow-[0_-8px_40px_rgba(0,0,0,0.15)] ${className}`}
      style={{
        bottom: bottomOffset,
        height: displayHeight,
        transition: isDragging ? 'none' : 'height 0.38s cubic-bezier(0.32, 0.72, 0, 1)',
        maxWidth: '430px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      {/* Drag Handle */}
      <div
        className="flex flex-col items-center pt-2 pb-1 cursor-grab active:cursor-grabbing select-none touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <div className="w-10 h-[5px] rounded-full bg-gray-300" />
      </div>

      {/* Peek Content (always visible) */}
      {peekContent && (
        <div
          className="px-4 pb-2"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          {peekContent}
        </div>
      )}

      {/* Scrollable Content */}
      <div
        className={`px-4 pb-4 ${isFullyExpanded ? 'overflow-y-auto overscroll-contain' : 'overflow-hidden'}`}
        style={{
          height: Math.max(displayHeight - (peekContent ? 96 : 36), 0),
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};

// Pill tabs for inside the bottom sheet
interface SheetTab {
  id: string;
  label: string;
  badge?: number;
}

interface SheetTabsProps {
  tabs: SheetTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const SheetTabs: React.FC<SheetTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 select-none ${
            activeTab === tab.id
              ? 'bg-primary text-white shadow-soft'
              : 'bg-gray-100 text-secondary hover:bg-gray-200'
          }`}
        >
          {tab.label}
          {tab.badge !== undefined && tab.badge > 0 && (
            <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] text-[10px] font-black rounded-full flex items-center justify-center px-1 ${
              activeTab === tab.id ? 'bg-accent text-primary' : 'bg-lemonRed text-white'
            }`}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

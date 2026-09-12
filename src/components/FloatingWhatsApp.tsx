import React, { useState, useRef, useEffect } from 'react';
import { useMinistry } from '../context/MinistryContext';
import { MessageCircle, Flame, Move } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { config } = useMinistry();
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0
  });
  const hasDraggedRef = useRef(false);

  const handleStart = (clientX: number, clientY: number) => {
    hasDraggedRef.current = false;
    const currentX = position ? position.x : Math.max(16, window.innerWidth - 220);
    const currentY = position ? position.y : Math.max(16, window.innerHeight - 140);

    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: currentX,
      initialY: currentY
    };
    setIsDragging(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;
      const deltaX = clientX - dragStartRef.current.startX;
      const deltaY = clientY - dragStartRef.current.startY;

      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        hasDraggedRef.current = true;
      }

      const newX = Math.max(10, Math.min(window.innerWidth - 180, dragStartRef.current.initialX + deltaX));
      const newY = Math.max(10, Math.min(window.innerHeight - 80, dragStartRef.current.initialY + deltaY));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  const handleClick = (e: React.MouseEvent) => {
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      style={
        position
          ? { position: 'fixed', left: `${position.x}px`, top: `${position.y}px`, zIndex: 9999, touchAction: 'none' }
          : { touchAction: 'none' }
      }
      className={position ? 'flex flex-col items-end gap-1.5 group select-none' : 'fixed bottom-24 sm:bottom-28 right-4 sm:right-6 z-40 flex flex-col items-end gap-1.5 group animate-fade-in-up select-none'}
    >
      {/* Draggable indicator handle */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="cursor-grab active:cursor-grabbing px-2.5 py-1 rounded-full bg-slate-900/90 text-amber-300 text-[10px] font-bold flex items-center gap-1 shadow-lg border border-amber-500/40 backdrop-blur-md hover:bg-slate-900 transition-colors"
        title="Click or touch and drag to move WhatsApp button"
      >
        <Move className="w-3 h-3 text-amber-400 animate-pulse" />
        <span>Drag to reposition</span>
      </div>

      {/* Tooltip bubble on hover */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-semibold shadow-xl border border-emerald-500/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 pointer-events-none">
        <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        <span>Join WhatsApp Prayer Altar</span>
      </div>

      <a
        href={config.whatsappPrayerChannelUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        id="floating-whatsapp-btn"
        className="relative flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-2xl transition-all duration-300 transform group-hover:scale-105 active:scale-95 border-2 border-emerald-300/60 cursor-grab active:cursor-grabbing"
        style={{
          backgroundColor: '#059669',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25), 0 0 16px rgba(16, 185, 129, 0.4)'
        }}
        aria-label="Join Pastor Best Eghosa WhatsApp Prayer Channel"
      >
        {/* Glowing pulse ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-30 animate-ping pointer-events-none" />

        <div className="relative flex items-center justify-center">
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-emerald-600" />
        </div>

        <div className="flex flex-col items-start leading-tight">
          <span className="text-[10px] uppercase font-semibold text-emerald-100 tracking-wider">
            WhatsApp Channel
          </span>
          <span className="font-bold text-white whitespace-nowrap">
            Prayer Fire Network
          </span>
        </div>
      </a>
    </div>
  );
};

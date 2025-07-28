import { useState, useCallback, useEffect } from 'react';

export interface GridNavigationOptions {
  itemsPerRow: number;
  totalItems: number;
  onSelect?: (index: number) => void;
  onBack?: () => void;
  disabled?: boolean;
}

export const useGridNavigation = (options: GridNavigationOptions) => {
  const { itemsPerRow, totalItems, onSelect, onBack, disabled = false } = options;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState({ x: 0, y: 0 });

  const totalRows = Math.ceil(totalItems / itemsPerRow);
  const currentRow = Math.floor(selectedIndex / itemsPerRow);
  const currentCol = selectedIndex % itemsPerRow;

  const handleNavigation = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (disabled) return;

    let newIndex = selectedIndex;

    switch (direction) {
      case 'up':
        if (currentRow > 0) {
          newIndex = selectedIndex - itemsPerRow;
        }
        break;
      case 'down':
        if (currentRow < totalRows - 1) {
          newIndex = Math.min(selectedIndex + itemsPerRow, totalItems - 1);
        }
        break;
      case 'left':
        if (currentCol > 0) {
          newIndex = selectedIndex - 1;
        }
        break;
      case 'right':
        if (currentCol < itemsPerRow - 1 && selectedIndex < totalItems - 1) {
          newIndex = selectedIndex + 1;
        }
        break;
    }

    if (newIndex !== selectedIndex) {
      setSelectedIndex(newIndex);
      
      // Calculate scroll offset to keep selected item visible
      const newRow = Math.floor(newIndex / itemsPerRow);
      const newCol = newIndex % itemsPerRow;
      
      // Auto-scroll logic for both axes
      const visibleRows = Math.floor(window.innerHeight / 200); // Assuming 200px per row
      const visibleCols = Math.floor(window.innerWidth / 200); // Assuming 200px per col
      
      let newScrollY = scrollOffset.y;
      let newScrollX = scrollOffset.x;
      
      // Vertical scrolling
      if (newRow < scrollOffset.y / 200) {
        newScrollY = newRow * 200;
      } else if (newRow >= (scrollOffset.y / 200) + visibleRows - 1) {
        newScrollY = (newRow - visibleRows + 2) * 200;
      }
      
      // Horizontal scrolling
      if (newCol < scrollOffset.x / 200) {
        newScrollX = newCol * 200;
      } else if (newCol >= (scrollOffset.x / 200) + visibleCols - 1) {
        newScrollX = (newCol - visibleCols + 2) * 200;
      }
      
      setScrollOffset({ x: Math.max(0, newScrollX), y: Math.max(0, newScrollY) });
    }
  }, [selectedIndex, currentRow, currentCol, totalRows, itemsPerRow, totalItems, scrollOffset, disabled]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        handleNavigation('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        handleNavigation('down');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        handleNavigation('left');
        break;
      case 'ArrowRight':
        event.preventDefault();
        handleNavigation('right');
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onSelect?.(selectedIndex);
        break;
      case 'Escape':
      case 'Backspace':
        event.preventDefault();
        onBack?.();
        break;
    }
  }, [handleNavigation, selectedIndex, onSelect, onBack, disabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    selectedIndex,
    setSelectedIndex,
    scrollOffset,
    currentRow,
    currentCol,
    isSelected: (index: number) => index === selectedIndex
  };
};

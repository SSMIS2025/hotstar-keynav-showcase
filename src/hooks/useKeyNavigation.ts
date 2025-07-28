import { useEffect, useCallback, useRef } from 'react';

export interface KeyNavigationOptions {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onSelect?: () => void;
  onBack?: () => void;
  onChannelUp?: () => void;
  onChannelDown?: () => void;
  onMenu?: () => void;
  onGuide?: () => void;
  onSearch?: () => void;
  disabled?: boolean;
}

export const useKeyNavigation = (options: KeyNavigationOptions) => {
  const {
    onUp, onDown, onLeft, onRight, onSelect, onBack,
    onChannelUp, onChannelDown, onMenu, onGuide, onSearch,
    disabled = false
  } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        onUp?.();
        break;
      case 'ArrowDown':
        event.preventDefault();
        onDown?.();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        onLeft?.();
        break;
      case 'ArrowRight':
        event.preventDefault();
        onRight?.();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onSelect?.();
        break;
      case 'Escape':
      case 'Backspace':
        event.preventDefault();
        onBack?.();
        break;
      case 'PageUp':
      case '+':
        event.preventDefault();
        onChannelUp?.();
        break;
      case 'PageDown':
      case '-':
        event.preventDefault();
        onChannelDown?.();
        break;
      case 'm':
      case 'M':
        event.preventDefault();
        onMenu?.();
        break;
      case 'g':
      case 'G':
        event.preventDefault();
        onGuide?.();
        break;
      case 's':
      case 'S':
        if (event.ctrlKey) return; // Allow Ctrl+S
        event.preventDefault();
        onSearch?.();
        break;
    }
  }, [onUp, onDown, onLeft, onRight, onSelect, onBack, onChannelUp, onChannelDown, onMenu, onGuide, onSearch, disabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export const useFocusManagement = () => {
  const focusableElements = useRef<HTMLElement[]>([]);

  const registerFocusable = useCallback((element: HTMLElement | null) => {
    if (element && !focusableElements.current.includes(element)) {
      focusableElements.current.push(element);
    }
  }, []);

  const unregisterFocusable = useCallback((element: HTMLElement | null) => {
    if (element) {
      focusableElements.current = focusableElements.current.filter(el => el !== element);
    }
  }, []);

  const focusElement = useCallback((index: number) => {
    const element = focusableElements.current[index];
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const getCurrentFocusIndex = useCallback(() => {
    const activeElement = document.activeElement as HTMLElement;
    return focusableElements.current.indexOf(activeElement);
  }, []);

  const focusNext = useCallback(() => {
    const currentIndex = getCurrentFocusIndex();
    const nextIndex = (currentIndex + 1) % focusableElements.current.length;
    focusElement(nextIndex);
  }, [getCurrentFocusIndex, focusElement]);

  const focusPrevious = useCallback(() => {
    const currentIndex = getCurrentFocusIndex();
    const prevIndex = currentIndex <= 0 ? focusableElements.current.length - 1 : currentIndex - 1;
    focusElement(prevIndex);
  }, [getCurrentFocusIndex, focusElement]);

  return {
    registerFocusable,
    unregisterFocusable,
    focusElement,
    getCurrentFocusIndex,
    focusNext,
    focusPrevious,
    focusableCount: focusableElements.current.length
  };
};
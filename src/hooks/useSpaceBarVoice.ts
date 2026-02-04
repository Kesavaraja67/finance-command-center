import { useEffect, useRef } from 'react';

/**
 * ROBUST Space bar voice control hook
 * 
 * Features:
 * - Prevents ALL Space bar interference with input
 * - Explicitly blurs input when activating voice
 * - Uses capture phase for priority event handling
 * - Prevents repeat key events
 * - Robust state management
 */
export function useSpaceBarVoice(onStart: () => void, onStop: () => void) {
  const isActiveRef = useRef(false);
  const isKeyDownRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle Space key
      if (e.code !== 'Space' && e.key !== ' ') {
        return;
      }

      // Get the currently focused element
      const activeElement = document.activeElement as HTMLElement;
      
      // Check if user is typing in an input field
      const isInInputField = 
        activeElement instanceof HTMLInputElement || 
        activeElement instanceof HTMLTextAreaElement ||
        activeElement?.isContentEditable === true ||
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA';

      // If in input field, let Space work normally
      if (isInInputField) {
        return;
      }

      // Prevent repeat key events (holding Space)
      if (isKeyDownRef.current) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return;
      }

      // CRITICAL: Prevent ALL default Space behavior
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // CRITICAL: Blur any focused element to prevent cursor movement
      if (activeElement && typeof activeElement.blur === 'function') {
        activeElement.blur();
      }

      // Mark as active
      isKeyDownRef.current = true;
      isActiveRef.current = true;

      // Activate voice
      try {
        onStart();
      } catch (error) {
        console.error('Error starting voice:', error);
        isKeyDownRef.current = false;
        isActiveRef.current = false;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Only handle Space key
      if (e.code !== 'Space' && e.key !== ' ') {
        return;
      }

      // Only process if we activated voice
      if (!isActiveRef.current) {
        return;
      }

      // Get the currently focused element
      const activeElement = document.activeElement as HTMLElement;
      
      // Check if user is typing in an input field
      const isInInputField = 
        activeElement instanceof HTMLInputElement || 
        activeElement instanceof HTMLTextAreaElement ||
        activeElement?.isContentEditable === true ||
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA';

      // If in input field, don't process
      if (isInInputField) {
        return;
      }

      // CRITICAL: Prevent ALL default Space behavior
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Reset state
      isKeyDownRef.current = false;
      isActiveRef.current = false;

      // Deactivate voice
      try {
        onStop();
      } catch (error) {
        console.error('Error stopping voice:', error);
      }
    };

    // CRITICAL: Use capture phase to intercept events FIRST
    document.addEventListener('keydown', handleKeyDown, { capture: true, passive: false });
    document.addEventListener('keyup', handleKeyUp, { capture: true, passive: false });

    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('keyup', handleKeyUp, { capture: true });
      
      // Cleanup state
      isKeyDownRef.current = false;
      isActiveRef.current = false;
    };
  }, [onStart, onStop]);
}

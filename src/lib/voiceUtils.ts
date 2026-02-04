import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for merging tailwind classes (standard in these projects)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Check if browser supports speech recognition
export const isSpeechSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};

// Request microphone permission
// Note: The browser usually requests this automatically when starting recognition,
// but we can check if it's already denied or prompt explicitly if using MediaRecorder constraints.
// For WebSpeech API, usually starting it triggers the prompt. This function checks general audio access.
export const requestMicPermission = async (): Promise<boolean> => {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
    return false;
  }
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Stop tracks right away as we just checked permission
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Microphone permission denied or error:', error);
    return false;
  }
};

// Format voice transcript (cleanup, capitalize)
export const formatTranscript = (text: string): string => {
  if (!text) return '';
  
  // Trim and basic cleanup
  let formatted = text.trim();
  
  // Capitalize first letter
  if (formatted.length > 0) {
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
  
  // Ensure it ends with punctuation if it looks like a complete sentence? 
  // (Optional, maybe not strictly needed for chat queries)
  
  return formatted;
};

// Detect command type from speech
export const detectCommandType = (text: string): 'query' | 'action' | 'unknown' => {
  const lowerText = text.toLowerCase();
  
  const actionKeywords = ['add', 'create', 'delete', 'remove', 'new', 'update', 'set'];
  const queryKeywords = ['show', 'what', 'how', 'when', 'list', 'display', 'get', 'chart', 'graph'];
  
  if (actionKeywords.some(keyword => lowerText.startsWith(keyword))) {
    return 'action';
  }
  
  if (queryKeywords.some(keyword => lowerText.startsWith(keyword))) {
    return 'query';
  }
  
  return 'unknown';
};

// Voice error types
export interface VoiceErrorType {
  code: string;
  message: string;
  canRetry: boolean;
}

// Helper to get friendly error message
export const getVoiceErrorMessage = (error: any): VoiceErrorType => {
  const errCode = error?.error || 'unknown';
  
  switch (errCode) {
    case 'not-allowed':
    case 'permission-denied':
      return {
        code: 'permission-denied',
        message: 'Microphone permission denied. Please allow access.',
        canRetry: false
      };
    case 'no-speech':
      return {
        code: 'no-speech',
        message: 'No speech detected. Please try again.',
        canRetry: true
      };
    case 'audio-capture':
      return {
        code: 'audio-capture',
        message: 'No microphone found.',
        canRetry: false
      };
    case 'network':
      return {
        code: 'network',
        message: 'Network error. Check connection.',
        canRetry: true
      };
    default:
      return {
        code: 'unknown',
        message: 'Could not understand. Try again.',
        canRetry: true
      };
  }
};

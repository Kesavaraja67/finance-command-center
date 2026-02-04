"use client";
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Mic } from 'lucide-react';

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

type VoiceState = 'idle' | 'listening' | 'processing';

/**
 * WARM VOICE BUTTON
 * Morning Coffee Shop aesthetic with coral orange gradients
 * 
 * Features:
 * - Coral orange gradient (not purple/pink)
 * - Warm glow effects
 * - Sound wave visualization
 * - Transcript preview with warm styling
 * - All functionality preserved
 */
const VoiceButton = forwardRef<any, VoiceButtonProps>(({ onTranscript, disabled, className = '' }, ref) => {
  const [state, setState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check browser support for Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Voice control requires Chrome or Edge browser');
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece + ' ';
        } else {
          interimTranscript += transcriptPiece;
        }
      }

      const currentTranscript = finalTranscript || interimTranscript;
      setTranscript(currentTranscript);

      // Auto-submit after 2 seconds of silence
      if (finalTranscript) {
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        
        silenceTimerRef.current = setTimeout(() => {
          if (currentTranscript.trim()) {
            handleStop(currentTranscript.trim());
          }
        }, 2000);
      }
    };

    recognition.onerror = (event: any) => {
      // Ignore 'aborted' error as it often happens on manual stop
      if (event.error === 'aborted') {
        setState('idle');
        return;
      }

      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        setError('No speech detected. Try again.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone permission denied');
      } else {
        setError('Voice recognition error');
      }
      setState('idle');
      setTimeout(() => setError(null), 3000);
    };

    recognition.onend = () => {
      if (state === 'listening') {
        setState('idle');
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, [state]);

  const handleStart = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (recognitionRef.current) {
        setTranscript('');
        setError(null);
        setState('listening');
        recognitionRef.current.start();
      }
    } catch (err) {
      setError('Microphone permission denied');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleStop = (finalText?: string) => {
    // Stop recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Error stopping recognition:', err);
      }
    }
    
    // Clear silence timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    
    setState('idle');
    
    // Use provided text or current transcript
    const textToSubmit = finalText || transcript;
    const trimmedText = textToSubmit.trim();
    
    // Clear transcript display
    setTranscript('');
    
    // CRITICAL: Only submit if we have actual text
    if (trimmedText && trimmedText.length > 0) {
      onTranscript(trimmedText);
    } else {
      // Show error if no speech was detected
      setError('No speech detected. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleClick = () => {
    if (disabled) return;
    
    if (state === 'listening') {
      handleStop(transcript);
    } else {
      handleStart();
    }
  };

  // Expose methods for keyboard shortcut integration
  useImperativeHandle(ref, () => ({
    handleStart,
    handleStop: () => handleStop(transcript)
  }));

  const isListening = state === 'listening';

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleClick}
        disabled={disabled || !!error}
        type="button"
        className={`
          relative group/voice
          w-14 h-14 rounded-2xl
          transition-all duration-300
          flex items-center justify-center
          ${isListening 
            ? 'bg-gradient-to-br from-[#EF4444] to-[#DC2626] shadow-2xl shadow-red scale-110' 
            : 'bg-gradient-to-br from-[#FF6B35] to-[#F55A24] hover:shadow-xl shadow-orange hover:scale-105'
          }
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/50 focus:ring-offset-2 focus:ring-offset-[#FFF8F0]
        `}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {/* Pulsing rings when listening */}
        {isListening && (
          <>
            <span className="absolute inset-0 rounded-2xl bg-[#EF4444] animate-ping opacity-75" />
            <span className="absolute inset-0 rounded-2xl bg-[#EF4444] animate-pulse opacity-50" />
          </>
        )}
        
        {/* Icon */}
        <div className="relative z-10">
          {isListening ? (
            <div className="flex items-center gap-1">
              <div className="w-1 h-4 bg-white rounded-full animate-sound-wave" style={{ animationDelay: '0ms' }} />
              <div className="w-1 h-6 bg-white rounded-full animate-sound-wave" style={{ animationDelay: '150ms' }} />
              <div className="w-1 h-4 bg-white rounded-full animate-sound-wave" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <Mic className="w-6 h-6 text-white" strokeWidth={2.5} />
          )}
        </div>
      </button>
      
      {/* Transcript preview tooltip */}
      {transcript && isListening && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-max max-w-xs px-4 py-3 bg-[#2D1B0E] border-2 border-[#5C4534] rounded-2xl shadow-2xl animate-fade-in-up z-50">
          <p className="text-sm text-white truncate">{transcript}</p>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#2D1B0E] border-r-2 border-b-2 border-[#5C4534] rotate-45" />
        </div>
      )}
      
      {/* Listening label */}
      {isListening && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-xs font-medium text-[#EF4444] animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#EF4444] rounded-full animate-pulse" />
            Listening...
          </span>
        </div>
      )}
      
      {/* Error message tooltip */}
      {error && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-max max-w-xs px-4 py-3 bg-[#EF4444] rounded-2xl shadow-2xl animate-fade-in-up z-50">
          <p className="text-sm text-white font-medium">{error}</p>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#EF4444] rotate-45" />
        </div>
      )}
    </div>
  );
});

VoiceButton.displayName = 'VoiceButton';

export default VoiceButton;

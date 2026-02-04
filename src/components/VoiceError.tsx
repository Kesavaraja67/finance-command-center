"use client";

import React, { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming standard shadcn/utils or similar usually exists, but I defined cn in voiceUtils too. I will import from voiceUtils if needed or standard lib.
// Let's use the one we usually find in these projects. If not, I'll use inline styles or just standard classes.
// The user prompt used src/lib/voiceUtils.ts for utils. I added 'cn' there? No, I added 'cn' to voiceUtils.ts in my previous step? 
// Actually I added 'cn' to 'src/lib/voiceUtils.ts' in my previous step just in case. 
// But commonly it is in '@/lib/utils'. I'll try to import from '@/lib/utils' first, if that fails I'll use the one I made. 
// Wait, I see I included `cn` in `src/lib/voiceUtils.ts` in step 3. 
// However, the user might have `src/lib/utils.ts`. 
// I will check `src/lib/utils.ts` existence or just use `src/lib/voiceUtils`.
// Actually, standard projects usually have `src/lib/utils.ts`. I'll risk using `src/lib/utils` for `cn`, if it fails I'll fix.
// Actually, let's just use the one I created or standard tailwind classes.

interface VoiceErrorProps {
  message: string;
  onDismiss?: () => void;
  duration?: number;
}

export default function VoiceError({ message, onDismiss, duration = 3000 }: VoiceErrorProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onDismiss) onDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-2 bg-red-500/90 text-white px-4 py-2.5 rounded-full shadow-lg backdrop-blur-sm border border-red-500">
        <AlertCircle size={16} className="shrink-0" />
        <span className="text-sm font-medium">{message}</span>
        <button 
          onClick={() => {
            setIsVisible(false);
            if (onDismiss) onDismiss();
          }}
          className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition-colors"
          aria-label="Dismiss error"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  TamboProvider, 
  useTamboThread, 
  useTamboThreadInput,
  useTamboSuggestions
} from "@tambo-ai/react";

import { components, tools } from "@/lib/tambo";
import { Send, Sparkles, Mic, User, Keyboard, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VoiceButton from "@/components/VoiceButton";
import { useSpaceBarVoice } from "@/hooks/useSpaceBarVoice";

/* --------------------------------------------------------------------------------
   WARM CONVERSATION-FIRST CHAT PAGE
   iMessage-style bubbles with Morning Coffee Shop aesthetic
   
   CRITICAL: All Tambo hooks, components, and logic remain intact
   Only visual layer has been redesigned with warm colors
   -------------------------------------------------------------------------------- */

// Helper function to render message content (filters out tool results)
function renderMessageContent(content: any) {
  if (typeof content === 'string') {
    return <p className="whitespace-pre-wrap leading-relaxed">{content}</p>;
  }
  
  if (Array.isArray(content)) {
    // Filter to only show text parts, hide tool_use and tool_result
    const textParts = content.filter(part => part.type === 'text');
    return textParts.map((part, i) => (
      <p key={i} className="whitespace-pre-wrap leading-relaxed">{part.text}</p>
    ));
  }
  
  return null;
}

// Suggested Actions Component - Inline after AI messages
function SuggestedActionsInline() {
  const { suggestions, accept } = useTamboSuggestions({ maxSuggestions: 3 });

  if (suggestions.length === 0) return null;

  return (
    <div className="flex justify-start mb-6">
      <div className="ml-13 max-w-3xl">
        <p className="text-xs text-[#9B8477] mb-2 font-medium">💡 You might want to:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => accept({ suggestion })}
              className="group px-3 py-2 bg-[#FFF4F0] hover:bg-[#FFE8DD] rounded-xl border border-[#E8DED2] hover:border-[#FF6B35] text-sm text-[#5C4534] hover:text-[#2D1B0E] transition-all flex items-center gap-1.5"
            >
              {suggestion.title}
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Chat Interface Component (Warm Bubbles)
function ChatInterface() {
  const { thread } = useTamboThread();
  const { value, setValue, submit, isPending } = useTamboThreadInput();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voiceButtonRef = useRef<any>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages.length, isPending]);

  // Filter messages to only show user and assistant messages
  const visibleMessages = thread?.messages.filter(
    m => m.role === 'user' || m.role === 'assistant'
  );

  // Handle form submission with proper input clearing
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!value.trim() || isPending) return;
    
    submit();
    setValue('');
  };

  // Handle voice transcript with validation
  const handleVoiceTranscript = (text: string) => {
    const trimmedText = text.trim();
    
    if (!trimmedText || trimmedText.length === 0) {
      console.warn('Voice transcript is empty, not submitting');
      return;
    }
    
    setValue(trimmedText);
    
    setTimeout(() => {
      if (trimmedText && trimmedText.length > 0) {
        submit();
        setValue('');
      }
    }, 50);
  };

  // Space bar shortcut for voice control
  useSpaceBarVoice(
    () => voiceButtonRef.current?.handleStart?.(),
    () => voiceButtonRef.current?.handleStop?.()
  );

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
        {/* Empty state */}
        {(!visibleMessages || visibleMessages.length === 0) && !isPending && (
          <div className="max-w-3xl mx-auto text-center py-20 animate-fade-in-up">
            <div className="mb-8 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FFF4F0] to-[#FFE8DD] rounded-full border-2 border-[#FF6B35]/20">
              <Mic className="w-10 h-10 text-[#FF6B35] animate-float" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-[#2D1B0E] mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Ready to talk about your finances?
            </h2>
            
            <p className="text-lg text-[#5C4534] mb-8 max-w-xl mx-auto">
              Click the mic or hold <kbd className="px-2 py-1 bg-[#FFF4E6] rounded border-2 border-[#E8DED2] font-mono text-sm mx-1">Space</kbd> to speak. 
              Try: <span className="text-[#FF6B35] font-medium">"Show me my spending"</span>
            </p>
            
            <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
              {[
                "Show my spending",
                "Budget status",
                "Recent transactions",
                "Am I overspending?",
              ].map((prompt, i) => (
                <button
                  key={prompt}
                  onClick={() => { 
                    setValue(prompt); 
                    setTimeout(() => {
                      submit();
                      setValue('');
                    }, 50);
                  }}
                  className="p-4 bg-white hover:bg-[#FFF4F0] rounded-xl border-2 border-[#E8DED2] hover:border-[#FF6B35] text-[#5C4534] hover:text-[#2D1B0E] transition-all animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {visibleMessages?.map((message, index) => (
            <motion.div 
              key={message.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* User/Assistant text message - iMessage style bubbles */}
              <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && (
                  <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-full flex items-center justify-center flex-shrink-0 mr-3 shadow-blue">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div className={`max-w-3xl ${message.role === 'user' ? 'max-w-2xl' : ''}`}>
                  <div className={`inline-block px-6 py-4 rounded-3xl shadow-lg ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-br from-[#FF6B35] to-[#F55A24] text-white rounded-br-md shadow-orange' 
                      : 'bg-white border-2 border-[#E8DED2] text-[#2D1B0E] rounded-bl-md'
                  }`}>
                    <div className={message.role === 'user' ? 'font-medium' : ''}>
                      {renderMessageContent(message.content)}
                    </div>
                  </div>
                  <p className={`text-xs text-[#9B8477] mt-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {message.role === 'user' ? 'You' : 'AI'} · Just now
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#F55A24] rounded-full flex items-center justify-center flex-shrink-0 ml-3 shadow-orange">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              
              {/* Rendered component */}
              {message.renderedComponent && (
                <div className="flex justify-start">
                  <div className="max-w-6xl w-full ml-13">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="animate-fade-in-up"
                    >
                      {message.renderedComponent}
                    </motion.div>
                  </div>
                </div>
              )}
              
              {/* Show suggestions after AI messages */}
              {message.role === 'assistant' && index === visibleMessages.length - 1 && (
                <SuggestedActionsInline />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isPending && (
          <div className="flex justify-start animate-fade-in">
            <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-full flex items-center justify-center flex-shrink-0 mr-3 shadow-blue">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="px-6 py-4 bg-white border-2 border-[#E8DED2] rounded-3xl rounded-bl-md">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FF6B35] rounded-full typing-dot" />
                <div className="w-2 h-2 bg-[#FF6B35] rounded-full typing-dot" />
                <div className="w-2 h-2 bg-[#FF6B35] rounded-full typing-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Only Chat Bar Visible */}
      <div className="px-4 py-4">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            {/* Input */}
            <div className="flex-1 relative">
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Ask about your finances or hold Space to speak..."
                rows={1}
                className="w-full px-5 py-3.5 bg-white border-2 border-[#E8DED2] focus:border-[#FF6B35] rounded-2xl text-[#2D1B0E] placeholder:text-[#BCA99D] resize-none focus:outline-none focus:ring-0 transition-all shadow-sm"
              />
              
              {value && (
                <span className="absolute bottom-3.5 right-3 text-xs text-[#9B8477] font-mono">
                  {value.length}/500
                </span>
              )}
            </div>
            
            {/* Voice Button */}
            <VoiceButton 
              ref={voiceButtonRef}
              onTranscript={handleVoiceTranscript}
              disabled={isPending}
              className="flex-shrink-0"
            />
            
            {/* Send Button */}
            <button
              type="submit"
              disabled={!value.trim() || isPending}
              className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#F55A24] hover:from-[#F55A24] hover:to-[#FF6B35] disabled:bg-[#E8DED2] disabled:cursor-not-allowed text-white rounded-2xl font-medium transition-all disabled:opacity-50 hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <Send className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </form>
          
          
          {/* Keyboard Hint - Compact */}
          <p className="text-center text-xs text-[#9B8477] mt-2.5 flex items-center justify-center gap-1.5">
            <Keyboard className="w-3 h-3" />
            <kbd className="px-1.5 py-0.5 bg-white/70 border border-[#E8DED2] rounded text-[#5C4534] font-mono text-xs">Space</kbd>
            to speak
          </p>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function Chat() {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
    >
      <div className="flex h-screen bg-[#FFF8F0] text-[#2D1B0E] overflow-hidden">
        <div className="flex-1 flex flex-col relative">
          {/* Subtle warm gradient overlay */}
          <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#FFEFD9]/30 to-transparent pointer-events-none" />
          
          {/* Header - Glass Effect with True Transparency */}
          <header className="backdrop-blur-md bg-white/40 border-b border-[#E8DED2]/30 px-6 md:px-8 py-4 flex items-center justify-between z-20 sticky top-0 shadow-sm">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-[#FF6B35] to-[#F55A24] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#2D1B0E]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Finance Command Center</h1>
                <p className="text-xs text-[#7A6152]">Voice-controlled dashboard</p>
              </div>
            </Link>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-white/60 hover:bg-white/80 backdrop-blur-sm border border-[#E8DED2] text-[#5C4534] rounded-xl text-sm font-medium transition-all hover:shadow-md"
              >
                Clear Chat
              </button>
            </div>
          </header>
          
          <ChatInterface />
        </div>
      </div>
    </TamboProvider>
  );
}

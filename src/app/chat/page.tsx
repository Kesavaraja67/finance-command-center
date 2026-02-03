"use client";
import React, { useRef, useEffect } from 'react';
import { 
  TamboProvider, 
  useTamboThread, 
  useTamboThreadInput,
  useTamboSuggestions
} from "@tambo-ai/react";

import { components, tools } from "@/lib/tambo";
import { Send, Sparkles, TrendingUp, DollarSign, PieChart, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function SuggestedActions() {
  const { suggestions, accept } = useTamboSuggestions({ maxSuggestions: 3 });

  if (suggestions.length === 0) return null;

  return (
      <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <p className="text-xs text-gray-500 mb-2 font-medium">Suggested actions:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => accept({ suggestion })}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gray-900/50 border border-gray-800 hover:bg-gray-800 hover:border-gray-600 hover:scale-[1.02] transition-all group text-center"
              >
                <div className="p-1.5 bg-gray-800 rounded-lg group-hover:bg-blue-500/10 transition-colors">
                  <Sparkles className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                </div>
                <span className="text-xs font-medium text-gray-300 group-hover:text-white line-clamp-2">{suggestion.title}</span>
              </button>
            ))}
        </div>
      </div>
  );
}

function ChatInterface() {
  const { thread } = useTamboThread();
  const { value, setValue, submit, isPending } = useTamboThreadInput();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages.length, isPending]);

  // Filter messages to hide tool inputs/outputs
  const visibleMessages = thread?.messages.filter(m => m.role === 'user' || m.role === 'assistant');

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {visibleMessages?.map((message) => (
            <motion.div 
              key={message.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-2xl text-sm md:text-base rounded-2xl px-6 py-4 shadow-sm ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-gray-800/80 backdrop-blur-sm text-gray-100 rounded-tl-none border border-gray-700/50'
                }`}>
                  {typeof message.content === 'string' ? message.content : 
                    Array.isArray(message.content) ? message.content.map((part, i) =>
                      part.type === 'text' ? <p key={i} className="whitespace-pre-wrap">{part.text}</p> : null
                    ) : null
                  }
                </div>
              </div>
              {message.renderedComponent && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-start"
                >
                  <div className="max-w-4xl w-full pl-0 md:pl-4">
                    {message.renderedComponent}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isPending && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-800/50 rounded-2xl px-6 py-4 rounded-tl-none flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
          </motion.div>
        )}
        
        <SuggestedActions />

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 bg-gray-900/80 backdrop-blur-md p-4 md:p-6 pb-8">
        <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="flex gap-3 max-w-4xl mx-auto relative">
          <div className="absolute inset-0 bg-blue-500/5 blur-3xl -z-10 rounded-full" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask AI about your budget, spending, or savings..."
            className="flex-1 rounded-xl bg-gray-800/80 border border-gray-700 px-6 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner"
          />
          <button 
            type="submit" 
            disabled={isPending || !value.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl disabled:opacity-50 hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Chat() {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
    >
      <div className="flex h-screen bg-[#0A0E27] text-white overflow-hidden selection:bg-blue-500/30">
        <div className="flex-1 flex flex-col relative">
          {/* Ambient Background */}
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
          
          <header className="border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-md px-8 py-5 flex items-center gap-3 z-10">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Finance Command Center</h1>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-emerald-500 font-medium">System Online</span>
            </div>
          </header>
          <ChatInterface />
        </div>
      </div>
    </TamboProvider>
  );
}

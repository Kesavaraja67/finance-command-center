"use client";
import React from 'react';
import { TamboProvider, useTamboThread, useTamboThreadInput } from "@tambo-ai/react";
import { components, tools } from "@/lib/tambo";
import { Send } from "lucide-react";

function ChatInterface() {
  const { thread } = useTamboThread();
  const { value, setValue, submit, isPending } = useTamboThreadInput();

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {thread?.messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl rounded-2xl px-6 py-4 ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-100'
              }`}>
                {typeof message.content === 'string' ? message.content : 
                  Array.isArray(message.content) ? message.content.map((part, i) =>
                    part.type === 'text' ? <p key={i}>{part.text}</p> : null
                  ) : null
                }
              </div>
            </div>
            {message.renderedComponent && (
              <div className="flex justify-start">
                <div className="max-w-4xl w-full">
                  {message.renderedComponent}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 p-4">
        <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="flex gap-2">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask about your finances..."
            className="flex-1 rounded-xl bg-gray-800 border border-gray-700 px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            disabled={isPending}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl disabled:opacity-50 hover:bg-blue-500 transition-colors"
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
      <div className="flex h-screen bg-gray-950">
        <div className="flex-1 flex flex-col">
          <header className="border-b border-gray-800 bg-gray-900 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Finance Command Center</h1>
          </header>
          <ChatInterface />
        </div>
      </div>
    </TamboProvider>
  );
}

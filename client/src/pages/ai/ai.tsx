
import React, { useState } from 'react';
import {
  Send,
  Plus,
  MessageSquare,
  Search,
  Settings,
  Sparkles,
  Bot,
  User,
  Paperclip,
  Mic,
  PanelLeftClose,
  MoreHorizontal,
  ArrowDown,
} from 'lucide-react';

type Message = {
  role: 'user' | 'ai';
  content: string;
};

type Suggestion = {
  icon: string;
  title: string;
  description: string;
};

const Ai: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  const suggestions: Suggestion[] = [
    {
      icon: '💡',
      title: 'Brainstorm ideas',
      description: 'Explore creative ideas for your next project',
    },
    {
      icon: '💻',
      title: 'Write code',
      description: 'Generate, debug and explain code',
    },
    {
      icon: '📚',
      title: 'Learn something',
      description: 'Understand complex topics easily',
    },
    {
      icon: '✍️',
      title: 'Write anything',
      description: 'Create emails, articles and more',
    },
  ];

  const handleSend = (): void => {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: message },
      {
        role: 'ai',
        content:
          "I'm your AI assistant! Connect an AI API to get real responses.",
      },
    ]);

    setMessage('');
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">

      {/* Sidebar */}
      <aside className="w-[260px] bg-[#111113] border-r border-white/5 flex flex-col p-4 shrink-0">

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles size={19} />
            </div>
            <span className="text-lg font-semibold tracking-tight">Nexus AI</span>
          </div>
          <button className="text-gray-500 hover:text-white">
            <PanelLeftClose size={19} />
          </button>
        </div>

        <button
          onClick={() => {
            setMessages([]);
            setMessage('');
          }}
          className="flex items-center justify-center gap-2 w-full bg-white text-black rounded-xl py-3 text-sm font-semibold hover:bg-gray-200 transition"
        >
          <Plus size={18} />
          New chat
        </button>

        <div className="flex flex-col gap-1 mt-7">
          <p className="text-xs text-gray-500 font-medium mb-3 px-2 uppercase tracking-wider">
            Workspace
          </p>

          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/5">
            <Search size={17} /> Search chats
          </button>

          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/5">
            <MessageSquare size={17} /> All conversations
          </button>
        </div>

        <div className="mt-8">
          <p className="text-xs text-gray-500 font-medium mb-3 px-2 uppercase tracking-wider">
            Recent
          </p>

          {[
            'React dashboard design',
            'Python learning roadmap',
            'Understanding AI',
            'Website inspiration',
          ].map((item: string, index: number) => (
            <button
              key={index}
              className="w-full text-left px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg truncate"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-auto border-t border-white/5 pt-4">
          <button className="flex items-center gap-3 px-3 py-3 w-full hover:bg-white/5 rounded-lg">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold">
              A
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium">Abhijith</p>
              <p className="text-xs text-gray-500">Free plan</p>
            </div>
            <Settings size={17} className="text-gray-500" />
          </button>
        </div>
      </aside>

      {/* Main Chat */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="h-[65px] border-b border-white/5 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-200">
              New conversation
            </span>
            <span className="text-gray-600">/</span>
            <span className="text-sm text-gray-500">AI Assistant</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-xs text-emerald-400">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              Online
            </span>
            <button className="text-gray-500 hover:text-white">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-8">

          {messages.length === 0 ? (
            <div className="max-w-3xl mx-auto h-full flex flex-col justify-center">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center mb-7">
                <Sparkles size={28} className="text-violet-400" />
              </div>

              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
                What can I help
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                  you with today?
                </span>
              </h1>

              <p className="text-gray-500 text-base mb-10 max-w-lg leading-relaxed">
                Your intelligent AI companion. Ask questions, explore ideas,
                write code, or simply start a conversation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestions.map((item: Suggestion, index: number) => (
                  <button
                    key={index}
                    onClick={() => setMessage(item.title)}
                    className="text-left border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-violet-500/30 rounded-xl p-4 transition-all group"
                  >
                    <div className="text-xl mb-3">{item.icon}</div>
                    <h3 className="text-sm font-medium mb-1 group-hover:text-violet-300">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {item.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-8">
              {messages.map((msg: Message, index: number) => (
                <div key={index} className="flex gap-4">
                  <div
                    className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center ${
                      msg.role === 'ai'
                        ? 'bg-violet-500/20 text-violet-400'
                        : 'bg-white/10 text-gray-300'
                    }`}
                  >
                    {msg.role === 'ai' ? (
                      <Bot size={19} />
                    ) : (
                      <User size={19} />
                    )}
                  </div>

                  <div className="flex-1 pt-1">
                    <p className="text-sm font-semibold mb-2">
                      {msg.role === 'ai' ? 'Nexus AI' : 'You'}
                    </p>
                    <p className="text-sm text-gray-300 leading-7">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex justify-center">
                <button className="text-gray-500 hover:text-white">
                  <ArrowDown size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="px-5 pb-6 pt-3 shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#18181b] border border-white/10 focus-within:border-violet-500/50 rounded-2xl p-3 transition-all shadow-xl">

              <textarea
                value={message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setMessage(e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Message Nexus AI..."
                rows={2}
                className="w-full bg-transparent text-sm text-white placeholder:text-gray-600 resize-none outline-none px-2 py-1"
              />

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg">
                    <Paperclip size={18} />
                  </button>
                  <span className="text-xs text-gray-600">AI Assistant</span>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-white rounded-lg">
                    <Mic size={18} />
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="w-9 h-9 flex items-center justify-center bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl transition"
                  >
                    <Send size={17} />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-center text-[11px] text-gray-600 mt-3">
              Nexus AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Ai;

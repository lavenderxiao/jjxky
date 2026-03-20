import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Mic, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { chatWithTutor } from '../services/geminiService';
import { UserProfile } from '../types';
import { MOCK_ENROLLMENT, MOCK_SCORES } from '../data';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AITutorProps {
  userProfile: UserProfile;
  onNavigateToScoreQuery?: () => void;
}

export default function AITutor({ userProfile, onNavigateToScoreQuery }: AITutorProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '你好！我是你的经济学考研AI导师。你可以问我关于目标院校、分数线、专业知识或志愿填报的问题。' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatWithTutor(messages, userMsg, userProfile, MOCK_ENROLLMENT, MOCK_SCORES);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: '抱歉，我遇到了一些问题，请稍后再试。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 bg-white border-bottom border-slate-200 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="font-semibold text-slate-800">AI 导师</h2>
          <p className="text-xs text-slate-500">专业、亲切、全天候在线</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-indigo-600'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-2 items-center text-slate-400 text-sm bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
              <Loader2 size={16} className="animate-spin" />
              正在思考中...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <div className="mb-3 flex justify-start">
          <button 
            onClick={onNavigateToScoreQuery}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold hover:bg-indigo-100 transition-all border border-indigo-100 shadow-sm"
          >
            <GraduationCap size={14} />
            考研分数线及招生人数查询
          </button>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
          <button className="p-2 text-slate-500 hover:text-indigo-600 transition-colors">
            <Mic size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入你的问题..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-800"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

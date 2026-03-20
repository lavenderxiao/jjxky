import React, { useState, useEffect } from 'react';
import { Search, Send, Table, Users, MessageSquare, GraduationCap, Filter, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_SCORES, MOCK_ENROLLMENT } from '../data';
import { chatWithTutor } from '../services/geminiService';
import { UserProfile } from '../types';

interface ScoreQueryProps {
  userProfile: UserProfile;
  onBack?: () => void;
}

export default function ScoreQuery({ userProfile, onBack }: ScoreQueryProps) {
  const [scoreSearch, setScoreSearch] = useState('');
  const [enrollSearch, setEnrollSearch] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: '你好！我是你的考研报考助手。你可以根据左侧的分数线和招生人数数据向我提问，我会为你提供专业的志愿填报建议。' }
  ]);

  const filteredScores = MOCK_SCORES.filter(s => 
    s.university.includes(scoreSearch) || 
    s.major.includes(scoreSearch) || 
    s.province.includes(scoreSearch) ||
    s.year.toString().includes(scoreSearch)
  );

  const filteredEnrollment = MOCK_ENROLLMENT.filter(e => 
    e.university.includes(enrollSearch) || 
    e.major.includes(enrollSearch) || 
    e.province.includes(enrollSearch) ||
    e.year.toString().includes(enrollSearch)
  );

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;
    
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsLoading(true);

    try {
      const history = chatMessages.map(m => ({ role: m.role, text: m.text }));
      const response = await chatWithTutor(history, userMsg, userProfile, MOCK_ENROLLMENT, MOCK_SCORES);
      setChatMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, { role: 'model', text: '抱歉，我遇到了一些问题，请稍后再试。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 overflow-hidden">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-2">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all font-medium"
        >
          <ArrowLeft size={18} />
          返回 AI 导师
        </button>
      </div>

      <div className="flex-1 flex h-full gap-6 overflow-hidden">
        {/* Left Column: Tables */}
        <div className="flex-[2] flex flex-col gap-6 overflow-hidden">
          {/* Top Left: Score Lines */}
          <div className="flex-1 bg-white rounded-3xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Table size={18} />
                </div>
                <h3 className="font-bold text-slate-800">院校考研分数线</h3>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="搜索年份/院校/专业/省份"
                  value={scoreSearch}
                  onChange={(e) => setScoreSearch(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs focus:ring-2 focus:ring-indigo-500 outline-none w-64"
                />
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    <th className="px-4 py-3 font-bold">年份</th>
                    <th className="px-4 py-3 font-bold">院校</th>
                    <th className="px-4 py-3 font-bold">省份</th>
                    <th className="px-4 py-3 font-bold">类型</th>
                    <th className="px-4 py-3 font-bold">专业</th>
                    <th className="px-4 py-3 font-bold">总分</th>
                    <th className="px-4 py-3 font-bold">单科1/2</th>
                    <th className="px-4 py-3 font-bold">自划线</th>
                    <th className="px-4 py-3 font-bold">专项</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-600">
                  {filteredScores.map(s => (
                    <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">{s.year}</td>
                      <td className="px-4 py-3 font-bold text-slate-800">{s.university}</td>
                      <td className="px-4 py-3">{s.province}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full ${s.type === '学硕' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                          {s.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">{s.major}</td>
                      <td className="px-4 py-3 font-bold text-indigo-600">{s.totalScore}</td>
                      <td className="px-4 py-3">{s.singleSubject1}/{s.singleSubject2}</td>
                      <td className="px-4 py-3">{s.selfDrawn ? '是' : '否'}</td>
                      <td className="px-4 py-3">{s.specialPlan ? '是' : '否'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Left: Enrollment */}
          <div className="flex-1 bg-white rounded-3xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <Users size={18} />
                </div>
                <h3 className="font-bold text-slate-800">院校招生人数及报录比</h3>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="搜索年份/院校/专业/省份"
                  value={enrollSearch}
                  onChange={(e) => setEnrollSearch(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs focus:ring-2 focus:ring-indigo-500 outline-none w-64"
                />
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    <th className="px-4 py-3 font-bold">年份</th>
                    <th className="px-4 py-3 font-bold">院校</th>
                    <th className="px-4 py-3 font-bold">省份</th>
                    <th className="px-4 py-3 font-bold">类型</th>
                    <th className="px-4 py-3 font-bold">专业</th>
                    <th className="px-4 py-3 font-bold">招生人数</th>
                    <th className="px-4 py-3 font-bold">报考人数</th>
                    <th className="px-4 py-3 font-bold">报录比</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-600">
                  {filteredEnrollment.map(e => (
                    <tr key={e.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">{e.year}</td>
                      <td className="px-4 py-3 font-bold text-slate-800">{e.university}</td>
                      <td className="px-4 py-3">{e.province}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full ${e.type === '学硕' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                          {e.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">{e.major}</td>
                      <td className="px-4 py-3 font-bold text-emerald-600">{e.enrollment}</td>
                      <td className="px-4 py-3">{e.applicants}</td>
                      <td className="px-4 py-3 font-bold text-rose-500">{e.ratio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: AI Chat */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <div className="p-2 bg-indigo-600 text-white rounded-lg">
              <MessageSquare size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">报考咨询 AI</h3>
              <p className="text-[10px] text-slate-400">基于历史数据为您提供建议</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-100 text-slate-700 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2 items-center text-slate-400 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <Loader2 size={14} className="animate-spin" />
                  正在分析数据...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100">
            <div className="relative">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="输入关于分数线、报考人数或志愿填报的问题..."
                className="w-full p-4 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                className="absolute right-3 bottom-3 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

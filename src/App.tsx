import React, { useState, useEffect } from 'react';
import { Bot, BookOpen, BookMarked, Menu, X, Target, ChevronRight, Edit3, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AITutor from './components/AITutor';
import PracticeModule from './components/PracticeModule';
import WrongQuestionBook from './components/WrongQuestionBook';
import ScoreQuery from './components/ScoreQuery';
import { Question, WrongQuestion, WrongCollection, UserProfile, ExamTarget } from './types';

type Module = 'tutor' | 'chapter' | 'mock' | 'wrong-questions' | 'score-query';

const UNIVERSITIES = ['北京大学', '清华大学', '复旦大学', '上海交通大学', '中国人民大学', '武汉大学', '南京大学', '浙江大学'];
const MAJORS = ['理论经济学', '应用经济学', '金融学', '统计学', '国际贸易学', '财政学'];

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>('tutor');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    target: null,
    university: null,
    major: null
  });
  
  // Check if setup is needed
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    } else {
      setIsSetupOpen(true);
    }
  }, []);

  const saveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setIsSetupOpen(false);
  };

  // Global State for Wrong Questions
  const [wrongQuestions, setWrongQuestions] = useState<WrongQuestion[]>(() => {
    const saved = localStorage.getItem('wrongQuestions');
    return saved ? JSON.parse(saved) : [];
  });
  const [collections, setCollections] = useState<WrongCollection[]>(() => {
    const saved = localStorage.getItem('collections');
    if (saved) {
      const parsed = JSON.parse(saved);
      // 过滤掉 'all'，因为它在UI中单独处理
      return parsed.filter((c: WrongCollection) => c.id !== 'all');
    }
    return [
      { id: '1', name: '微观经济学' },
      { id: '2', name: '宏观经济学' }
    ];
  });

  // Persist wrongQuestions to localStorage
  useEffect(() => {
    localStorage.setItem('wrongQuestions', JSON.stringify(wrongQuestions));
  }, [wrongQuestions]);

  // Persist collections to localStorage
  useEffect(() => {
    localStorage.setItem('collections', JSON.stringify(collections));
  }, [collections]);

  const addWrongQuestion = (q: Question, collectionId: string = 'all') => {
    setWrongQuestions(prev => {
      const existing = prev.find(wq => wq.id === q.id);
      if (existing) {
        if (existing.collectionIds.includes(collectionId)) return prev;
        return prev.map(wq => wq.id === q.id ? { ...wq, collectionIds: [...wq.collectionIds, collectionId] } : wq);
      }
      const newWrong: WrongQuestion = {
        ...q,
        addedAt: Date.now(),
        collectionIds: ['all', collectionId].filter((id, index, self) => self.indexOf(id) === index)
      };
      return [newWrong, ...prev];
    });
  };

  const removeWrongQuestion = (id: string) => {
    setWrongQuestions(prev => prev.filter(q => q.id !== id));
  };

  const addCollection = (name: string) => {
    const newCol: WrongCollection = {
      id: Math.random().toString(36).substr(2, 9),
      name
    };
    setCollections(prev => [...prev, newCol]);
  };

  const moveQuestionToCollection = (qId: string, cId: string) => {
    setWrongQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        const hasCol = q.collectionIds.includes(cId);
        return {
          ...q,
          collectionIds: hasCol 
            ? q.collectionIds.filter(id => id !== cId) 
            : [...q.collectionIds, cId]
        };
      }
      return q;
    }));
  };

  const navItems = [
    { id: 'tutor', label: 'AI 导师', icon: Bot, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'chapter', label: '系统学习', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'mock', label: '模拟冲刺', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'wrong-questions', label: '错题集', icon: BookMarked, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="bg-white border-r border-slate-200 flex flex-col relative z-20 shadow-xl shadow-slate-200/50"
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {isSidebarOpen ? (
              <motion.div 
                key="logo-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <GraduationCap size={24} />
                </div>
                <h1 className="font-bold text-lg tracking-tight">经济学考研</h1>
              </motion.div>
            ) : (
              <motion.div 
                key="logo-mini"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-200"
              >
                <GraduationCap size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id as Module)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group ${
                activeModule === item.id 
                  ? `${item.bg} ${item.color} shadow-sm` 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <item.icon size={22} className={activeModule === item.id ? item.color : 'text-slate-400 group-hover:text-slate-600'} />
              {isSidebarOpen && <span className="font-semibold text-sm">{item.label}</span>}
              {activeModule === item.id && isSidebarOpen && (
                <motion.div layoutId="active-pill" className={`ml-auto w-1.5 h-6 rounded-full ${item.color.replace('text', 'bg')}`} />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex flex-col gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <GraduationCap size={18} />
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">经济学考研助手</p>
                  <p className="text-[10px] text-slate-400 truncate">你的备考好伙伴</p>
                </div>
              )}
            </div>
            {isSidebarOpen && userProfile.university && (
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">当前目标</span>
                  <button 
                    onClick={() => setIsSetupOpen(true)}
                    className="p-1 hover:bg-slate-200 rounded text-indigo-600 transition-colors"
                  >
                    <Edit3 size={12} />
                  </button>
                </div>
                <p className="text-xs font-semibold text-slate-700 truncate">{userProfile.university}</p>
                <p className="text-[10px] text-slate-500 truncate">{userProfile.target} · {userProfile.major}</p>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm z-30"
        >
          {isSidebarOpen ? <X size={14} /> : <Menu size={14} />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800">
              {navItems.find(n => n.id === activeModule)?.label}
            </h2>
            <div className="h-4 w-px bg-slate-200" />
            <p className="text-xs text-slate-400 font-medium">
              {activeModule === 'tutor' && '解答疑惑，规划未来'}
              {activeModule === 'chapter' && '章节练习，夯实基础'}
              {activeModule === 'mock' && '真题演练，模拟冲刺'}
              {activeModule === 'wrong-questions' && '温故知新，查漏补缺'}
              {activeModule === 'score-query' && '数据查询，科学报考'}
            </p>
          </div>
          <div className="flex items-center gap-4">
          </div>
        </header>

        {/* Module Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeModule === 'tutor' && (
                <AITutor 
                  userProfile={userProfile}
                  onNavigateToScoreQuery={() => setActiveModule('score-query')} 
                />
              )}
              {(activeModule === 'chapter' || activeModule === 'mock') && (
                <PracticeModule 
                  mode={activeModule} 
                  onAddWrongQuestion={addWrongQuestion} 
                  collections={collections}
                />
              )}
              {activeModule === 'wrong-questions' && (
                <WrongQuestionBook
                  wrongQuestions={wrongQuestions}
                  collections={collections}
                  onAddCollection={addCollection}
                  onRemoveQuestion={removeWrongQuestion}
                  onMoveQuestion={moveQuestionToCollection}
                  onAddWrongQuestion={addWrongQuestion}
                />
              )}
              {activeModule === 'score-query' && (
                <ScoreQuery 
                  userProfile={userProfile}
                  onBack={() => setActiveModule('tutor')} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Setup Modal */}
      <AnimatePresence>
        {isSetupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                  <Target size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">考研目标设置</h2>
                  <p className="text-sm text-slate-500">定制你的专属备考方案</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">考试目标</label>
                  <div className="flex gap-3">
                    {['专硕', '学硕'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setUserProfile({ ...userProfile, target: t as ExamTarget })}
                        className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all ${
                          userProfile.target === t 
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                            : 'border-slate-100 text-slate-500 hover:border-slate-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">目标院校</label>
                  <select
                    value={userProfile.university || ''}
                    onChange={(e) => setUserProfile({ ...userProfile, university: e.target.value })}
                    className="w-full p-3 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                  >
                    <option value="">选择院校</option>
                    {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">目标专业</label>
                  <select
                    value={userProfile.major || ''}
                    onChange={(e) => setUserProfile({ ...userProfile, major: e.target.value })}
                    className="w-full p-3 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                  >
                    <option value="">选择专业</option>
                    {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  {localStorage.getItem('userProfile') && (
                    <button
                      onClick={() => setIsSetupOpen(false)}
                      className="flex-1 py-4 border-2 border-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                    >
                      取消
                    </button>
                  )}
                  <button
                    onClick={() => saveProfile(userProfile)}
                    disabled={!userProfile.target || !userProfile.university || !userProfile.major}
                    className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                  >
                    保存并开启 <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

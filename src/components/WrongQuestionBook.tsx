import React, { useState } from 'react';
import { Book, Plus, Trash2, PlayCircle, Layers, ChevronRight, X, Star, Loader2, BookmarkPlus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, WrongQuestion, WrongCollection } from '../types';
import { evaluateAnswer, generateSimilarQuestions } from '../services/geminiService';

interface WrongQuestionBookProps {
  wrongQuestions: WrongQuestion[];
  collections: WrongCollection[];
  onAddCollection: (name: string) => void;
  onRemoveQuestion: (id: string) => void;
  onMoveQuestion: (qId: string, cId: string) => void;
}

export default function WrongQuestionBook({ 
  wrongQuestions, 
  collections, 
  onAddCollection, 
  onRemoveQuestion,
  onMoveQuestion
}: WrongQuestionBookProps) {
  const [activeCollectionId, setActiveCollectionId] = useState<string>('all');
  const [selectedQuestion, setSelectedQuestion] = useState<WrongQuestion | null>(null);
  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  
  const [practiceMode, setPracticeMode] = useState<'none' | 're-practice' | 'similar'>('none');
  const [practiceQuestions, setPracticeQuestions] = useState<Question[]>([]);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [collectionSuccess, setCollectionSuccess] = useState<string | null>(null);

  const filteredQuestions = activeCollectionId === 'all' 
    ? wrongQuestions 
    : wrongQuestions.filter(q => q.collectionIds.includes(activeCollectionId));

  const startRePractice = (q: WrongQuestion) => {
    setPracticeMode('re-practice');
    setPracticeQuestions([q]);
    setCurrentPracticeIndex(0);
    setUserAnswer('');
    setFeedback(null);
  };

  const startSimilarPractice = async (q: Question) => {
    setIsLoading(true);
    try {
      const similar = await generateSimilarQuestions(q, 5);
      setPracticeMode('similar');
      setPracticeQuestions(similar);
      setCurrentPracticeIndex(0);
      setUserAnswer('');
      setFeedback(null);
    } catch (error) {
      console.error('Similar questions error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePracticeSubmit = async () => {
    const q = practiceQuestions[currentPracticeIndex];
    setIsLoading(true);
    try {
      const result = await evaluateAnswer(q, userAnswer);
      setFeedback(result);
    } catch (error) {
      console.error('Evaluate error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextPracticeQuestion = () => {
    if (currentPracticeIndex < practiceQuestions.length - 1) {
      setCurrentPracticeIndex(prev => prev + 1);
      setUserAnswer('');
      setFeedback(null);
    } else {
      setPracticeMode('none');
    }
  };

  const handleMoveToCollection = (collectionId: string) => {
    if (selectedQuestion) {
      onMoveQuestion(selectedQuestion.id, collectionId);
      setCollectionSuccess(collectionId);
      setTimeout(() => setCollectionSuccess(null), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex gap-6 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Book size={18} className="text-indigo-600" /> 错题本
          </h3>
          <button 
            onClick={() => setIsAddingCollection(true)}
            className="p-1 hover:bg-slate-100 rounded-md text-slate-500 transition-all"
          >
            <Plus size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <button
            onClick={() => setActiveCollectionId('all')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
              activeCollectionId === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Layers size={16} /> 所有错题
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${activeCollectionId === 'all' ? 'bg-white/20' : 'bg-slate-100'}`}>
              {wrongQuestions.length}
            </span>
          </button>
          
          {collections.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCollectionId(c.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                activeCollectionId === c.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Book size={16} /> {c.name}
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${activeCollectionId === c.id ? 'bg-white/20' : 'bg-slate-100'}`}>
                {wrongQuestions.filter(q => q.collectionIds.includes(c.id)).length}
              </span>
            </button>
          ))}
        </div>

        {isAddingCollection && (
          <div className="p-4 border-t border-slate-100">
            <input
              autoFocus
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newCollectionName.trim()) {
                  onAddCollection(newCollectionName.trim());
                  setNewCollectionName('');
                  setIsAddingCollection(false);
                }
              }}
              placeholder="新错题本名称..."
              className="w-full p-2 text-sm rounded-lg border-slate-200 mb-2"
            />
            <div className="flex gap-2">
              <button 
                onClick={() => setIsAddingCollection(false)}
                className="flex-1 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  if (newCollectionName.trim()) {
                    onAddCollection(newCollectionName.trim());
                    setNewCollectionName('');
                    setIsAddingCollection(false);
                  }
                }}
                className="flex-1 py-1.5 text-xs bg-indigo-600 text-white rounded-lg"
              >
                创建
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
        {practiceMode !== 'none' ? (
          <div className="flex-1 flex flex-col p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-800">
                {practiceMode === 're-practice' ? '错题重练' : `类似题型练习 (${currentPracticeIndex + 1}/${practiceQuestions.length})`}
              </h3>
              <button 
                onClick={() => setPracticeMode('none')}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1">
              <div className="mb-6">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">
                  {practiceQuestions[currentPracticeIndex].type === 'choice' ? '单选题' : '问答/计算题'}
                </span>
              </div>
              <h4 className="text-lg text-slate-800 mb-8 leading-relaxed">
                {practiceQuestions[currentPracticeIndex].content}
              </h4>

              {practiceQuestions[currentPracticeIndex].type === 'choice' && practiceQuestions[currentPracticeIndex].options && (
                <div className="grid grid-cols-1 gap-3 mb-8">
                  {practiceQuestions[currentPracticeIndex].options!.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setUserAnswer(opt)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        userAnswer === opt ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <span className="inline-block w-8 h-8 rounded-lg bg-slate-100 text-slate-600 text-center leading-8 mr-3 font-bold">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {practiceQuestions[currentPracticeIndex].type !== 'choice' && (
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="请输入你的回答..."
                  className="w-full h-40 p-4 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 mb-8"
                />
              )}

              {!feedback ? (
                <button
                  onClick={handlePracticeSubmit}
                  disabled={!userAnswer || isLoading}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : '提交回答'}
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-2xl border-2 ${feedback.isCorrect ? 'border-emerald-100 bg-emerald-50' : 'border-rose-100 bg-rose-50'}`}
                >
                  <h4 className={`text-lg font-bold mb-4 ${feedback.isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                    {feedback.isCorrect ? '回答正确！' : '回答错误'}
                  </h4>
                  <p className="text-slate-700 mb-4"><span className="font-bold">正确答案：</span>{practiceQuestions[currentPracticeIndex].answer}</p>
                  <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm mb-6">
                    {feedback.detailedExplanation}
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={nextPracticeQuestion}
                      disabled={isLoading}
                      className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                    >
                      {currentPracticeIndex < practiceQuestions.length - 1 ? '下一题' : '完成练习'}
                    </button>
                    {practiceMode === 're-practice' && (
                      <button
                        onClick={() => startSimilarPractice(practiceQuestions[currentPracticeIndex])}
                        disabled={isLoading}
                        className="w-full py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                      >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Layers size={18} />}
                        练习类似题型
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        ) : selectedQuestion ? (
          <div className="flex-1 flex flex-col p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setSelectedQuestion(null)}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all"
              >
                <ChevronRight size={20} className="rotate-180" /> 返回列表
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={() => onRemoveQuestion(selectedQuestion.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                  {selectedQuestion.subject} · {selectedQuestion.knowledgePoint}
                </span>
                <h3 className="text-2xl text-slate-800 font-medium leading-relaxed">
                  {selectedQuestion.content}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2">正确答案</h4>
                  <p className="text-slate-600">{selectedQuestion.answer}</p>
                </div>
                <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <h4 className="font-bold text-indigo-800 mb-2">涉及知识点</h4>
                  <p className="text-indigo-600">{selectedQuestion.knowledgePoint}</p>
                </div>
              </div>

              <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4">详细解析</h4>
                <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {selectedQuestion.analysis}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => startRePractice(selectedQuestion)}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
                >
                  <PlayCircle size={20} /> 重练此题
                </button>
                <button
                  onClick={() => startSimilarPractice(selectedQuestion)}
                  className="flex-1 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <Layers size={20} />} 练习类似题型
                </button>
                <button
                  onClick={() => setIsCollectionModalOpen(true)}
                  className="py-4 px-6 bg-white text-slate-600 border-2 border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <BookmarkPlus size={20} /> 收藏
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                {activeCollectionId === 'all' ? '所有错题' : collections.find(c => c.id === activeCollectionId)?.name}
              </h2>
              <p className="text-sm text-slate-400">共 {filteredQuestions.length} 道题目</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {filteredQuestions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                  <Book size={80} className="mb-4 opacity-20" />
                  <p className="text-lg">暂无错题，继续努力！</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredQuestions.map(q => (
                    <motion.div
                      key={q.id}
                      layoutId={q.id}
                      onClick={() => setSelectedQuestion(q)}
                      className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{q.subject}</span>
                        <div className="flex gap-1">
                          {collections.map(c => (
                            <button
                              key={c.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onMoveQuestion(q.id, c.id);
                              }}
                              className={`w-2 h-2 rounded-full transition-all ${q.collectionIds.includes(c.id) ? 'bg-indigo-500' : 'bg-slate-200 hover:bg-slate-300'}`}
                              title={`移至 ${c.name}`}
                            />
                          ))}
                        </div>
                      </div>
                      <h4 className="text-slate-800 font-medium line-clamp-2 mb-4 group-hover:text-indigo-600 transition-colors">
                        {q.content}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1"><Star size={12} /> {q.knowledgePoint}</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Collection Modal */}
      <AnimatePresence>
        {isCollectionModalOpen && selectedQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">收藏到错题本</h3>
                <button
                  onClick={() => setIsCollectionModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto mb-6 pr-2">
                {collections.map(c => {
                  const isInCollection = selectedQuestion.collectionIds.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleMoveToCollection(c.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                        isInCollection
                          ? 'border-indigo-200 bg-indigo-50'
                          : 'border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`font-medium ${isInCollection ? 'text-indigo-700' : 'text-slate-700'}`}>
                        {c.name}
                      </span>
                      {isInCollection ? (
                        <Check size={16} className="text-indigo-600" />
                      ) : (
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600" />
                      )}
                    </button>
                  );
                })}
              </div>

              {collectionSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium flex items-center gap-2">
                  <Check size={16} /> 已添加到错题本
                </div>
              )}

              <button
                onClick={() => setIsCollectionModalOpen(false)}
                className="w-full py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all"
              >
                完成
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

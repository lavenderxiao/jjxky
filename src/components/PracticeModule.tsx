import React, { useState, useEffect } from 'react';
import { BookOpen, Target, GraduationCap, ChevronRight, CheckCircle2, XCircle, ExternalLink, RefreshCw, Star, Loader2, CheckSquare, Square, ListChecks, ArrowRight, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ExamTarget, Question, UserProfile, WrongCollection } from '../types';
import { generateQuestion, evaluateAnswer } from '../services/geminiService';
import { REAL_EXAM_QUESTIONS } from '../data';

const UNIVERSITIES = ['北京大学', '清华大学', '复旦大学', '上海交通大学', '中国人民大学', '武汉大学', '南京大学', '浙江大学'];
const MAJORS = ['理论经济学', '应用经济学', '金融学', '统计学', '国际贸易学', '财政学'];
const SUBJECTS = ['微观经济学', '宏观经济学', '政治经济学', '计量经济学', '数学三'];
const KNOWLEDGE_POINTS: Record<string, string[]> = {
  '微观经济学': ['消费者行为理论', '生产理论', '成本理论', '市场结构', '博弈论', '福利经济学'],
  '宏观经济学': ['国民收入核算', 'IS-LM模型', 'AD-AS模型', '失业与通货膨胀', '经济增长理论', '宏观经济政策'],
  '政治经济学': ['商品与货币', '资本主义生产', '资本积累', '社会主义经济理论'],
  '计量经济学': ['简单线性回归', '多元线性回归', '异方差性', '自相关', '多重共线性'],
  '数学三': ['微积分', '线性代数', '概率论与数理统计']
};

interface PracticeModuleProps {
  mode: 'chapter' | 'mock';
  onAddWrongQuestion: (q: Question, collectionId: string) => void;
  collections: WrongCollection[];
}

export default function PracticeModule({ mode, onAddWrongQuestion, collections }: PracticeModuleProps) {
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [selectedKPs, setSelectedKPs] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; analysis: string; detailedExplanation: string; recommendedCourse?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [showNextOptions, setShowNextOptions] = useState(false);
  const [similarQuestions, setSimilarQuestions] = useState<Question[]>([]);
  const [isGeneratingSimilar, setIsGeneratingSimilar] = useState(false);

  const toggleKP = (kp: string) => {
    setSelectedKPs(prev => 
      prev.includes(kp) ? prev.filter(k => k !== kp) : [...prev, kp]
    );
  };

  const selectAllKPs = () => {
    setSelectedKPs(KNOWLEDGE_POINTS[selectedSubject] || []);
  };

  const clearAllKPs = () => {
    setSelectedKPs([]);
  };

  const startPractice = async () => {
    setIsLoading(true);
    setFeedback(null);
    setUserAnswer('');
    setCurrentQuestion(null);

    try {
      if (mode === 'mock') {
        // 模拟冲刺模式：从真题库中抽取近5年真题
        const recentYears = [2024, 2023, 2022, 2021, 2020];
        const selectedQuestions: Question[] = [];

        // 从每年随机抽取题目
        for (const year of recentYears) {
          const yearQuestions = REAL_EXAM_QUESTIONS.filter(q => q.year === year);
          if (yearQuestions.length > 0) {
            // 每年随机抽取2道题
            const shuffled = [...yearQuestions].sort(() => Math.random() - 0.5);
            const selected = shuffled.slice(0, Math.min(2, shuffled.length));
            selectedQuestions.push(...selected.map(q => ({
              ...q,
              source: q.source
            })));
          }
        }

        // 打乱顺序
        const shuffledQuestions = selectedQuestions.sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
      } else {
        // 系统学习模式：根据知识点生成题目
        if (selectedKPs.length === 0) return;

        const allGenerated: Question[] = [];
        for (const kp of selectedKPs) {
          const promises = Array.from({ length: 10 }).map(() =>
            generateQuestion(selectedSubject, kp, Math.random() > 0.3 ? 'choice' : 'qa')
          );
          const generated = await Promise.all(promises);
          allGenerated.push(...generated);
        }
        setQuestions(allGenerated);
      }
    } catch (error) {
      console.error('Generate questions error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !userAnswer || isLoading) return;
    setIsLoading(true);
    try {
      const result = await evaluateAnswer(currentQuestion, userAnswer);
      setFeedback(result);
    } catch (error) {
      console.error('Evaluate answer error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollect = (collectionId: string) => {
    if (currentQuestion) {
      onAddWrongQuestion(currentQuestion, collectionId);
      setIsCollectionModalOpen(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      {/* Top Nav */}
      <div className="bg-white border-b border-slate-200 p-2 flex items-center gap-2 overflow-x-auto mb-4 rounded-xl shadow-sm">
        {SUBJECTS.map(s => (
          <button
            key={s}
            onClick={() => {
              setSelectedSubject(s);
              setSelectedKPs([]);
              setQuestions([]);
              setCurrentQuestion(null);
              setFeedback(null);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedSubject === s ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        {/* Knowledge Points Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-4 flex flex-col overflow-hidden shadow-sm">
          {mode === 'chapter' ? (
            <>
              <div className="flex items-center justify-between mb-4 px-2">
                <h4 className="font-bold text-slate-800">必备知识点</h4>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllKPs}
                    className="text-[10px] text-indigo-600 font-bold hover:underline"
                  >
                    全选
                  </button>
                  <button
                    onClick={clearAllKPs}
                    className="text-[10px] text-slate-400 font-bold hover:underline"
                  >
                    清空
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 mb-4 pr-1">
                {KNOWLEDGE_POINTS[selectedSubject]?.map(kp => {
                  const isSelected = selectedKPs.includes(kp);
                  return (
                    <button
                      key={kp}
                      onClick={() => toggleKP(kp)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-3 group ${
                        isSelected
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      {isSelected ? (
                        <CheckSquare size={18} className="text-indigo-600 flex-shrink-0" />
                      ) : (
                        <Square size={18} className="text-slate-300 group-hover:text-slate-400 flex-shrink-0" />
                      )}
                      <span className="truncate flex-1">{kp}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={startPractice}
                disabled={selectedKPs.length === 0 || isLoading}
                className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 mt-auto"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <RefreshCw size={18} />
                )}
                生成模拟题 ({selectedKPs.length * 10})
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4 px-2">
                <h4 className="font-bold text-slate-800">模拟冲刺</h4>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                  <FileText size={32} className="text-purple-600" />
                </div>
                <h5 className="font-bold text-slate-800 mb-2">近5年真题演练</h5>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  系统将从2020-2024年真题库中随机抽取题目，帮助你进行模拟冲刺练习。
                </p>

                <div className="w-full space-y-2 text-left text-xs text-slate-500 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>涵盖微观经济学、宏观经济学</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>包含选择题、问答题、计算题</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>每道题显示真题来源</span>
                  </div>
                </div>
              </div>

              <button
                onClick={startPractice}
                disabled={isLoading}
                className="w-full py-3.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-100 flex items-center justify-center gap-2 mt-auto"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <GraduationCap size={18} />
                )}
                开始模拟冲刺
              </button>
            </>
          )}
        </div>

        {/* Practice Area */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p className="font-medium text-slate-600">正在为您生成模拟题...</p>
              <p className="text-sm mt-2">根据所选知识点，每个生成10道题</p>
            </div>
          ) : !currentQuestion ? (
            questions.length > 0 ? (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <ListChecks className="text-indigo-600" size={20} />
                    <h3 className="font-bold text-slate-800 text-lg">
                      已生成 {questions.length} 道模拟题
                    </h3>
                  </div>
                  <button 
                    onClick={() => {
                      setQuestions([]);
                      setSelectedKPs([]);
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-all flex items-center gap-1"
                  >
                    <RefreshCw size={12} /> 重置所有
                  </button>
                </div>
                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-700 text-sm line-clamp-2 mb-3">{q.content}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {q.type === 'choice' ? '单选题' : '问答/计算'}
                              </span>
                              {mode === 'mock' && q.source && (
                                <span className="text-[10px] font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full">
                                  {q.source}
                                </span>
                              )}
                              <span className="text-[10px] font-bold text-slate-400">
                                · {q.knowledgePoint}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setCurrentQuestion(q);
                                setUserAnswer('');
                                setFeedback(null);
                              }}
                              className="px-4 py-1.5 bg-white border border-indigo-200 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                            >
                              开始练习
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-10 text-center">
                <BookOpen size={64} className="mb-4 opacity-20" />
                <p className="text-lg">
                  {mode === 'chapter' ? '请选择左侧知识点生成10道模拟题' : '点击左侧按钮生成10道模拟题'}
                </p>
              </div>
            )
          ) : (
            <div className="flex-1 overflow-y-auto p-8">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setCurrentQuestion(null)}
                  className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all"
                >
                  <ChevronRight size={18} className="rotate-180" />
                  <span className="text-sm font-bold">返回列表</span>
                </button>
                <div className="flex items-center gap-3">
                  {mode === 'mock' && currentQuestion.source && (
                    <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold">
                      {currentQuestion.source}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    {currentQuestion.type === 'choice' ? '单选题' : currentQuestion.type === 'qa' ? '问答题' : '计算题'}
                  </span>
                </div>
              </div>

              <h3 className="text-xl text-slate-800 font-medium mb-8 leading-relaxed">
                {currentQuestion.content}
              </h3>

              {currentQuestion.type === 'choice' && currentQuestion.options && (
                <div className="space-y-3 mb-8">
                  {currentQuestion.options.map((opt, i) => (
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

              {(currentQuestion.type === 'qa' || currentQuestion.type === 'calculation') && (
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="请输入你的回答..."
                  className="w-full h-40 p-4 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 mb-8"
                />
              )}

              {!feedback ? (
                <button
                  onClick={handleSubmitAnswer}
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
                  <div className="flex items-center gap-3 mb-4">
                    {feedback.isCorrect ? (
                      <CheckCircle2 className="text-emerald-600" size={28} />
                    ) : (
                      <XCircle className="text-rose-600" size={28} />
                    )}
                    <h4 className={`text-lg font-bold ${feedback.isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                      {feedback.isCorrect ? '回答正确！' : '回答错误'}
                    </h4>
                  </div>

                  <div className="space-y-4 text-slate-700">
                    <p><span className="font-bold">正确答案：</span>{currentQuestion.answer}</p>
                    <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm leading-relaxed">
                      <span className="font-bold block mb-2">详细解析：</span>
                      {feedback.detailedExplanation}
                    </div>

                    {!feedback.isCorrect && feedback.recommendedCourse && (
                      <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
                            <BookOpen size={20} />
                          </div>
                          <div>
                            <p className="text-xs text-indigo-600 font-bold uppercase">推荐课程</p>
                            <p className="text-sm font-medium text-slate-800">Bilibili: {feedback.recommendedCourse}</p>
                          </div>
                        </div>
                        <a
                          href={`https://search.bilibili.com/all?keyword=${encodeURIComponent(feedback.recommendedCourse)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all"
                        >
                          <ExternalLink size={20} />
                        </a>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setIsCollectionModalOpen(true)}
                        className="flex-1 py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                      >
                        <Star size={18} /> 收藏
                      </button>
                      {feedback.isCorrect ? (
                        <button
                          onClick={() => {
                            setQuestions(prev => prev.filter(q => q.id !== currentQuestion.id));
                            setCurrentQuestion(null);
                            setFeedback(null);
                            setUserAnswer('');
                          }}
                          className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                        >
                          下一题 <ArrowRight size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowNextOptions(true)}
                          className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                        >
                          继续 <ChevronRight size={18} />
                        </button>
                      )}
                    </div>

                    {/* Wrong answer options */}
                    {showNextOptions && !feedback.isCorrect && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-4 border-t border-rose-200"
                      >
                        <p className="text-sm text-slate-600 mb-3 font-medium">请选择下一步操作：</p>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={async () => {
                              setIsGeneratingSimilar(true);
                              try {
                                const newQ = await generateQuestion(
                                  currentQuestion.subject,
                                  currentQuestion.knowledgePoint,
                                  Math.random() > 0.3 ? 'choice' : 'qa'
                                );
                                setQuestions(prev => [newQ, ...prev]);
                                setCurrentQuestion(newQ);
                                setFeedback(null);
                                setUserAnswer('');
                                setShowNextOptions(false);
                              } catch (error) {
                                console.error('Generate similar question error:', error);
                              } finally {
                                setIsGeneratingSimilar(false);
                              }
                            }}
                            disabled={isGeneratingSimilar}
                            className="w-full py-3 bg-white border-2 border-indigo-200 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                          >
                            {isGeneratingSimilar ? (
                              <Loader2 className="animate-spin" size={18} />
                            ) : (
                              <RefreshCw size={18} />
                            )}
                            继续练习此知识点
                          </button>
                          <button
                            onClick={() => {
                              setQuestions(prev => prev.filter(q => q.id !== currentQuestion.id));
                              setCurrentQuestion(null);
                              setFeedback(null);
                              setUserAnswer('');
                              setShowNextOptions(false);
                            }}
                            className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                          >
                            进入下一题 <ArrowRight size={18} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Collection Selection Modal */}
      <AnimatePresence>
        {isCollectionModalOpen && (
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
                <h3 className="text-lg font-bold text-slate-800">选择错题本</h3>
                <button 
                  onClick={() => setIsCollectionModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto mb-6 pr-2">
                <button
                  onClick={() => handleCollect('all')}
                  className="w-full text-left p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all flex items-center justify-between group"
                >
                  <span className="font-medium text-slate-700">默认错题本</span>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600" />
                </button>
                {collections.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleCollect(c.id)}
                    className="w-full text-left p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all flex items-center justify-between group"
                  >
                    <span className="font-medium text-slate-700">{c.name}</span>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsCollectionModalOpen(false)}
                className="w-full py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all"
              >
                取消
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

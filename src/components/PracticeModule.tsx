import React, { useState } from 'react';
import { BookOpen, ChevronRight, CheckCircle2, XCircle, ExternalLink, RefreshCw, Star, Loader2, PlayCircle, Calendar, Layers, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, WrongCollection } from '../types';
import { generateQuestion, evaluateAnswer } from '../services/geminiService';
import { REAL_EXAM_QUESTIONS } from '../data';

const SUBJECTS = ['微观经济学', '宏观经济学', '政治经济学', '计量经济学', '数学三'];
const KNOWLEDGE_POINTS: Record<string, string[]> = {
  '微观经济学': ['消费者行为理论', '生产理论', '成本理论', '市场结构', '博弈论', '福利经济学'],
  '宏观经济学': ['国民收入核算', 'IS-LM模型', 'AD-AS模型', '失业与通货膨胀', '经济增长理论', '宏观经济政策'],
  '政治经济学': ['商品与货币', '资本主义生产', '资本积累', '社会主义经济理论'],
  '计量经济学': ['简单线性回归', '多元线性回归', '异方差性', '自相关', '多重共线性'],
  '数学三': ['微积分', '线性代数', '概率论与数理统计']
};
const YEARS = [2024, 2023, 2022, 2021, 2020];

interface PracticeModuleProps {
  mode: 'chapter' | 'mock';
  onAddWrongQuestion: (q: Question, collectionId: string) => void;
  collections: WrongCollection[];
}

export default function PracticeModule({ mode, onAddWrongQuestion, collections }: PracticeModuleProps) {
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [selectedKP, setSelectedKP] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [mockMode, setMockMode] = useState<'knowledge' | 'year' | null>(null);

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; analysis: string; detailedExplanation: string; recommendedCourse?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [showNextOptions, setShowNextOptions] = useState(false);

  // 系统学习：点击知识点生成一道题
  const handleKPClick = async (kp: string) => {
    setSelectedKP(kp);
    setIsLoading(true);
    setFeedback(null);
    setUserAnswer('');

    try {
      const question = await generateQuestion(selectedSubject, kp, Math.random() > 0.3 ? 'choice' : 'qa');
      setCurrentQuestion(question);
      setQuestionList([question]);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Generate question error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 模拟冲刺：根据知识点获取真题
  const startMockByKnowledge = async () => {
    if (!selectedKP) return;
    setIsLoading(true);
    setFeedback(null);
    setUserAnswer('');

    try {
      // 从真题库中筛选该科目和知识点的近5年真题
      const filtered = REAL_EXAM_QUESTIONS.filter(
        q => q.subject === selectedSubject && q.knowledgePoint === selectedKP
      );

      if (filtered.length > 0) {
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        setQuestionList(shuffled);
        setCurrentQuestion(shuffled[0]);
        setCurrentIndex(0);
      } else {
        // 如果没有匹配的真题，生成模拟题
        const question = await generateQuestion(selectedSubject, selectedKP, Math.random() > 0.3 ? 'choice' : 'qa');
        setQuestionList([question]);
        setCurrentQuestion(question);
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Mock by knowledge error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 模拟冲刺：根据年份获取真题
  const startMockByYear = async () => {
    if (!selectedYear) return;
    setIsLoading(true);
    setFeedback(null);
    setUserAnswer('');

    try {
      // 从真题库中筛选该科目和年份的真题
      const filtered = REAL_EXAM_QUESTIONS.filter(
        q => q.subject === selectedSubject && q.year === selectedYear
      );

      if (filtered.length > 0) {
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        setQuestionList(shuffled);
        setCurrentQuestion(shuffled[0]);
        setCurrentIndex(0);
      } else {
        // 如果没有匹配的真题，提示用户
        alert(`暂无${selectedYear}年${selectedSubject}的真题数据`);
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error('Mock by year error:', error);
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

  const goToNextQuestion = () => {
    if (currentIndex < questionList.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentQuestion(questionList[nextIndex]);
      setUserAnswer('');
      setFeedback(null);
      setShowNextOptions(false);
    } else {
      // 没有更多题目
      setCurrentQuestion(null);
      setQuestionList([]);
      setFeedback(null);
      setShowNextOptions(false);
    }
  };

  const handleBack = () => {
    setCurrentQuestion(null);
    setQuestionList([]);
    setFeedback(null);
    setUserAnswer('');
    setShowNextOptions(false);
    if (mode === 'mock') {
      setMockMode(null);
      setSelectedKP(null);
      setSelectedYear(null);
    }
  };

  const generateSimilarQuestion = async () => {
    if (!currentQuestion) return;
    setIsLoading(true);
    try {
      const newQ = await generateQuestion(
        currentQuestion.subject,
        currentQuestion.knowledgePoint,
        Math.random() > 0.3 ? 'choice' : 'qa'
      );
      // 插入到当前位置之后
      const newList = [...questionList];
      newList.splice(currentIndex + 1, 0, newQ);
      setQuestionList(newList);
      setShowNextOptions(false);
      // 直接跳转到新插入的题目
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentQuestion(newList[nextIndex]);
      setUserAnswer('');
      setFeedback(null);
    } catch (error) {
      console.error('Generate similar question error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      {/* Top Nav - Subject Selection */}
      <div className="bg-white border-b border-slate-200 p-2 flex items-center gap-2 overflow-x-auto mb-4 rounded-xl shadow-sm">
        {SUBJECTS.map(s => (
          <button
            key={s}
            onClick={() => {
              setSelectedSubject(s);
              setSelectedKP(null);
              setSelectedYear(null);
              setMockMode(null);
              setCurrentQuestion(null);
              setQuestionList([]);
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
        {/* Left Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-4 flex flex-col overflow-hidden shadow-sm">
          {mode === 'chapter' ? (
            // 系统学习模式
            <>
              <div className="flex items-center justify-between mb-4 px-2">
                <h4 className="font-bold text-slate-800">必备知识点</h4>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                {KNOWLEDGE_POINTS[selectedSubject]?.map(kp => (
                  <button
                    key={kp}
                    onClick={() => handleKPClick(kp)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-3 group ${
                      selectedKP === kp
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <PlayCircle size={16} className={selectedKP === kp ? 'text-white' : 'text-slate-400'} />
                    <span className="truncate flex-1">{kp}</span>
                    <ChevronRight size={14} className={selectedKP === kp ? 'text-white/70' : 'text-slate-300 group-hover:text-indigo-600'} />
                  </button>
                ))}
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-500 text-center">
                点击知识点开始练习
              </div>
            </>
          ) : (
            // 模拟冲刺模式
            <>
              {!mockMode ? (
                // 选择模式
                <>
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h4 className="font-bold text-slate-800">选择练习模式</h4>
                  </div>

                  <div className="flex-1 flex flex-col gap-3 p-2">
                    <button
                      onClick={() => setMockMode('knowledge')}
                      className="w-full p-4 rounded-xl border-2 border-slate-100 hover:border-purple-200 hover:bg-purple-50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                          <Layers size={20} className="text-purple-600" />
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-800">按知识点练习</h5>
                          <p className="text-xs text-slate-500">选择知识点，练习近5年真题</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setMockMode('year')}
                      className="w-full p-4 rounded-xl border-2 border-slate-100 hover:border-purple-200 hover:bg-purple-50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                          <Calendar size={20} className="text-purple-600" />
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-800">按年份练习</h5>
                          <p className="text-xs text-slate-500">选择年份，练习该年真题</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </>
              ) : mockMode === 'knowledge' ? (
                // 按知识点模式
                <>
                  <div className="flex items-center justify-between mb-4 px-2">
                    <button
                      onClick={() => { setMockMode(null); setSelectedKP(null); }}
                      className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                    >
                      <ChevronRight size={14} className="rotate-180" /> 返回
                    </button>
                    <h4 className="font-bold text-slate-800">选择知识点</h4>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                    {KNOWLEDGE_POINTS[selectedSubject]?.map(kp => (
                      <button
                        key={kp}
                        onClick={() => setSelectedKP(kp)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-3 group ${
                          selectedKP === kp
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <span className="truncate flex-1">{kp}</span>
                        {selectedKP === kp && <CheckCircle2 size={16} />}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={startMockByKnowledge}
                    disabled={!selectedKP || isLoading}
                    className="w-full mt-4 py-3.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-100 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <PlayCircle size={18} />}
                    开始练习
                  </button>
                </>
              ) : (
                // 按年份模式
                <>
                  <div className="flex items-center justify-between mb-4 px-2">
                    <button
                      onClick={() => { setMockMode(null); setSelectedYear(null); }}
                      className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                    >
                      <ChevronRight size={14} className="rotate-180" /> 返回
                    </button>
                    <h4 className="font-bold text-slate-800">选择年份</h4>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                    {YEARS.map(year => (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-3 group ${
                          selectedYear === year
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <Calendar size={16} className={selectedYear === year ? 'text-white' : 'text-slate-400'} />
                        <span className="flex-1">{year}年真题</span>
                        {selectedYear === year && <CheckCircle2 size={16} />}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={startMockByYear}
                    disabled={!selectedYear || isLoading}
                    className="w-full mt-4 py-3.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-100 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <PlayCircle size={18} />}
                    开始练习
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* Practice Area */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p className="font-medium text-slate-600">正在生成题目...</p>
            </div>
          ) : !currentQuestion ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-10 text-center">
              <BookOpen size={64} className="mb-4 opacity-20" />
              <p className="text-lg">
                {mode === 'chapter'
                  ? '请点击左侧知识点开始练习'
                  : mockMode
                    ? '请选择后点击"开始练习"'
                    : '请选择练习模式'}
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-8">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all"
                >
                  <ChevronRight size={18} className="rotate-180" />
                  <span className="text-sm font-bold">返回</span>
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
                  {questionList.length > 1 && (
                    <span className="text-xs text-slate-400">
                      {currentIndex + 1} / {questionList.length}
                    </span>
                  )}
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
                          onClick={goToNextQuestion}
                          className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                        >
                          {currentIndex < questionList.length - 1 ? '下一题' : '完成'} <ArrowRight size={18} />
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
                            onClick={generateSimilarQuestion}
                            disabled={isLoading}
                            className="w-full py-3 bg-white border-2 border-indigo-200 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                          >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                            继续练习此知识点
                          </button>
                          <button
                            onClick={goToNextQuestion}
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

import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, CheckCircle2, XCircle, ExternalLink, RefreshCw, Star, Loader2, PlayCircle, Calendar, Layers, ArrowRight, Trophy, RotateCcw } from 'lucide-react';
import { Question, WrongCollection, UserProfile } from '../types';
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
  userProfile?: UserProfile;
}

type PracticeState = 'select' | 'practicing' | 'feedback' | 'completed';

export default function PracticeModule({ mode, onAddWrongQuestion, collections, userProfile }: PracticeModuleProps) {
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [selectedKP, setSelectedKP] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [mockMode, setMockMode] = useState<'knowledge' | 'year' | null>(null);

  const [practiceState, setPracticeState] = useState<PracticeState>('select');
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; analysis: string; detailedExplanation: string; recommendedCourse?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const currentQuestion = questionList[currentIndex] || null;

  // 获取当前题目
  const startPractice = async () => {
    setIsLoading(true);
    setPracticeState('practicing');
    setUserAnswer('');
    setFeedback(null);
    setCorrectCount(0);
    setTotalCount(0);
    setCurrentIndex(0);

    try {
      let filtered = REAL_EXAM_QUESTIONS;

      if (mode === 'mock') {
        if (mockMode === 'knowledge' && selectedKP) {
          filtered = REAL_EXAM_QUESTIONS.filter(q => q.subject === selectedSubject && q.knowledgePoint === selectedKP);
        } else if (mockMode === 'year' && selectedYear) {
          filtered = REAL_EXAM_QUESTIONS.filter(q => q.year === selectedYear);
        } else {
          // 根据用户目标筛选
          filtered = REAL_EXAM_QUESTIONS.filter(q => q.subject === '微观经济学' || q.subject === '宏观经济学');
        }
      } else {
        if (selectedKP) {
          filtered = REAL_EXAM_QUESTIONS.filter(q => q.subject === selectedSubject && q.knowledgePoint === selectedKP);
        }
      }

      if (filtered.length === 0) {
        // 如果没有匹配的真题，生成模拟题
        const question = await generateQuestion(selectedSubject, selectedKP || '基础概念', 'choice');
        setQuestionList([question]);
      } else {
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        setQuestionList(shuffled.slice(0, 10)); // 最多10题
      }
    } catch (error) {
      console.error('Start practice error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 提交答案
  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !userAnswer || isLoading) return;
    setIsLoading(true);

    try {
      const result = await evaluateAnswer(currentQuestion, userAnswer);
      setFeedback(result);
      setPracticeState('feedback');
      setTotalCount(prev => prev + 1);
      if (result.isCorrect) {
        setCorrectCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Evaluate answer error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 下一题
  const goToNextQuestion = () => {
    if (currentIndex < questionList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setFeedback(null);
      setPracticeState('practicing');
    } else {
      setPracticeState('completed');
    }
  };

  // 继续练习当前知识点
  const practiceSameKnowledge = async () => {
    setIsLoading(true);
    try {
      const newQ = await generateQuestion(
        currentQuestion?.subject || selectedSubject,
        currentQuestion?.knowledgePoint || selectedKP || '基础概念',
        Math.random() > 0.5 ? 'choice' : 'qa'
      );
      setQuestionList(prev => [...prev, newQ]);
      setCurrentIndex(questionList.length);
      setUserAnswer('');
      setFeedback(null);
      setPracticeState('practicing');
    } catch (error) {
      console.error('Generate question error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 返回选择
  const handleBack = () => {
    setPracticeState('select');
    setQuestionList([]);
    setCurrentIndex(0);
    setUserAnswer('');
    setFeedback(null);
    setMockMode(null);
    setSelectedKP(null);
    setSelectedYear(null);
  };

  // 收藏题目
  const handleCollect = (collectionId: string) => {
    if (currentQuestion) {
      onAddWrongQuestion(currentQuestion, collectionId);
      setIsCollectionModalOpen(false);
    }
  };

  // 渲染选择界面
  const renderSelectView = () => (
    <div className="flex-1 flex flex-col">
      {/* 科目选择 */}
      <div className="bg-white border-b border-slate-200 p-2 flex items-center gap-2 overflow-x-auto mb-4 rounded-xl shadow-sm flex-shrink-0">
        {SUBJECTS.map(s => (
          <button
            key={s}
            onClick={() => {
              setSelectedSubject(s);
              setSelectedKP(null);
              setSelectedYear(null);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedSubject === s ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* 左侧选择面板 */}
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
                    onClick={() => setSelectedKP(kp)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-3 ${
                      selectedKP === kp
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <PlayCircle size={16} className={selectedKP === kp ? 'text-white' : 'text-slate-400'} />
                    <span className="truncate flex-1">{kp}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={startPractice}
                disabled={!selectedKP || isLoading}
                className="w-full mt-4 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <PlayCircle size={18} />}
                开始练习
              </button>
            </>
          ) : (
            // 模拟冲刺模式
            <>
              {!mockMode ? (
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
                          <p className="text-xs text-slate-500">选择知识点，练习相关真题</p>
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
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-3 ${
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
                    onClick={startPractice}
                    disabled={!selectedKP || isLoading}
                    className="w-full mt-4 py-3.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 transition-all shadow-lg shadow-purple-100 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <PlayCircle size={18} />}
                    开始练习
                  </button>
                </>
              ) : (
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
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-3 ${
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
                    onClick={startPractice}
                    disabled={!selectedYear || isLoading}
                    className="w-full mt-4 py-3.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 transition-all shadow-lg shadow-purple-100 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <PlayCircle size={18} />}
                    开始练习
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* 右侧提示 */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center shadow-sm">
          <BookOpen size={64} className="mb-4 text-slate-200" />
          <p className="text-lg text-slate-400">
            {mode === 'chapter' ? '请选择知识点开始练习' : '请选择练习模式'}
          </p>
        </div>
      </div>
    </div>
  );

  // 渲染练习界面
  const renderPracticeView = () => (
    <div className="flex-1 flex flex-col min-h-0">
      {/* 顶部信息栏 */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between rounded-xl shadow-sm mb-4 flex-shrink-0">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all"
        >
          <ChevronRight size={18} className="rotate-180" />
          <span className="text-sm font-bold">返回</span>
        </button>
        <div className="flex items-center gap-3">
          {currentQuestion?.source && (
            <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold">
              {currentQuestion.source}
            </span>
          )}
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">
            {currentQuestion?.type === 'choice' ? '单选题' : currentQuestion?.type === 'qa' ? '问答题' : '计算题'}
          </span>
          <span className="text-xs text-slate-400">
            {currentIndex + 1} / {questionList.length}
          </span>
        </div>
      </div>

      {/* 题目内容 */}
      <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-slate-200 p-6 mb-4">
        <h3 className="text-xl text-slate-800 font-medium mb-8 leading-relaxed">
          {currentQuestion?.content}
        </h3>

        {currentQuestion?.type === 'choice' && currentQuestion.options && (
          <div className="space-y-3">
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

        {(currentQuestion?.type === 'qa' || currentQuestion?.type === 'calculation') && (
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="请输入你的回答..."
            className="w-full h-48 p-4 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
          />
        )}
      </div>

      {/* 提交按钮 */}
      <div className="flex-shrink-0">
        <button
          onClick={handleSubmitAnswer}
          disabled={!userAnswer || isLoading}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : '提交回答'}
        </button>
      </div>
    </div>
  );

  // 渲染反馈界面
  const renderFeedbackView = () => (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      {/* 顶部信息栏 */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between rounded-xl shadow-sm mb-4 flex-shrink-0">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all"
        >
          <ChevronRight size={18} className="rotate-180" />
          <span className="text-sm font-bold">返回</span>
        </button>
        <div className="flex items-center gap-3">
          {currentQuestion?.source && (
            <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold">
              {currentQuestion.source}
            </span>
          )}
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">
            {currentQuestion?.type === 'choice' ? '单选题' : currentQuestion?.type === 'qa' ? '问答题' : '计算题'}
          </span>
        </div>
      </div>

      {/* 题目回顾 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
        <h3 className="text-lg text-slate-800 font-medium mb-4">{currentQuestion?.content}</h3>
        <p className="text-sm text-slate-500">你的回答：<span className="font-medium text-slate-700">{userAnswer}</span></p>
      </div>

      {/* 答案解析 */}
      <div className={`rounded-2xl border-2 p-6 mb-4 ${feedback?.isCorrect ? 'border-emerald-100 bg-emerald-50' : 'border-rose-100 bg-rose-50'}`}>
        <div className="flex items-center gap-3 mb-4">
          {feedback?.isCorrect ? (
            <CheckCircle2 className="text-emerald-600" size={28} />
          ) : (
            <XCircle className="text-rose-600" size={28} />
          )}
          <h4 className={`text-lg font-bold ${feedback?.isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
            {feedback?.isCorrect ? '回答正确！' : '回答错误'}
          </h4>
        </div>

        <div className="space-y-4 text-slate-700">
          <p><span className="font-bold">正确答案：</span>{currentQuestion?.answer}</p>

          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <span className="font-bold block mb-2">详细解析：</span>
            <p className="text-sm leading-relaxed">{feedback?.detailedExplanation}</p>
          </div>

          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <span className="font-bold text-indigo-800">涉及知识点：</span>
            <span className="text-indigo-600">{currentQuestion?.knowledgePoint}</span>
          </div>

          {/* 错误时显示推荐课程 */}
          {!feedback?.isCorrect && feedback?.recommendedCourse && (
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 text-white rounded-lg flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="text-xs text-amber-600 font-bold uppercase">推荐课程</p>
                  <p className="text-sm font-medium text-slate-800">{feedback.recommendedCourse}</p>
                </div>
              </div>
              <a
                href={`https://search.bilibili.com/all?keyword=${encodeURIComponent(feedback.recommendedCourse)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-all"
              >
                <ExternalLink size={20} />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex-shrink-0 space-y-3">
        {/* 收藏按钮 */}
        <button
          onClick={() => setIsCollectionModalOpen(true)}
          className="w-full py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <Star size={18} /> 收藏到错题本
        </button>

        {/* 下一步操作 */}
        {feedback?.isCorrect ? (
          <button
            onClick={goToNextQuestion}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            {currentIndex < questionList.length - 1 ? '下一题' : '完成练习'} <ArrowRight size={18} />
          </button>
        ) : (
          <div className="space-y-2">
            <button
              onClick={practiceSameKnowledge}
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
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
        )}
      </div>
    </div>
  );

  // 渲染完成界面
  const renderCompletedView = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-10">
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-200">
          <Trophy className="text-white" size={48} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">练习完成！</h3>
        <p className="text-slate-500 mb-6">恭喜你完成了本次练习</p>

        <div className="bg-slate-50 rounded-2xl p-6 mb-8 max-w-sm mx-auto">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">{correctCount}</p>
              <p className="text-xs text-slate-500 mt-1">正确</p>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-400">{totalCount - correctCount}</p>
              <p className="text-xs text-slate-500 mt-1">错误</p>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{totalCount > 0 ? Math.round(correctCount / totalCount * 100) : 0}%</p>
              <p className="text-xs text-slate-500 mt-1">正确率</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
          >
            <RotateCcw size={18} />
            返回
          </button>
          <button
            onClick={startPractice}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-purple-200"
          >
            <RefreshCw size={18} />
            再练一次
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col min-h-0">
      {isLoading && practiceState === 'select' ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-medium text-slate-600">正在准备题目...</p>
        </div>
      ) : practiceState === 'select' ? (
        renderSelectView()
      ) : practiceState === 'practicing' ? (
        renderPracticeView()
      ) : practiceState === 'feedback' ? (
        renderFeedbackView()
      ) : (
        renderCompletedView()
      )}

      {/* 收藏弹窗 */}
      {isCollectionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6">
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
          </div>
        </div>
      )}
    </div>
  );
}

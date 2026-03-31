/**
 * 考研智能体核心类
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { AGENT_CONFIG } from '../config/agent.config';
import {
  SYSTEM_PROMPT,
  CHAT_PROMPT_TEMPLATE,
  QUESTION_GENERATION_TEMPLATE,
  ANSWER_EVALUATION_TEMPLATE,
  SIMILAR_QUESTIONS_TEMPLATE,
  UNIVERSITY_CONSULTING_TEMPLATE,
  fillTemplate
} from '../prompts/templates';
import type { Question, UserProfile } from '../types';

/**
 * 智能体上下文
 */
interface AgentContext {
  userProfile: UserProfile;
  conversationHistory: Array<{ role: string; text: string }>;
  knowledgeBase?: any;
  sessionData?: Record<string, any>;
}

/**
 * 答案评估结果
 */
interface EvaluationResult {
  isCorrect: boolean;
  analysis: string;
  detailedExplanation: string;
  recommendedCourse?: string;
}

/**
 * 智能体错误类型
 */
enum AgentErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * 智能体错误类
 */
class AgentError extends Error {
  type: AgentErrorType;
  originalError?: Error;

  constructor(type: AgentErrorType, message: string, originalError?: Error) {
    super(message);
    this.type = type;
    this.originalError = originalError;
    this.name = 'AgentError';
  }
}

/**
 * 题目缓存类
 */
class QuestionCache {
  private cache: Map<string, Question[]> = new Map();
  private maxCacheSize: number;
  private questionCacheSize: number;

  constructor(maxCacheSize: number = 100, questionCacheSize: number = 10) {
    this.maxCacheSize = maxCacheSize;
    this.questionCacheSize = questionCacheSize;
  }

  private getCacheKey(subject: string, knowledgePoint: string, type: string): string {
    return `${subject}:${knowledgePoint}:${type}`;
  }

  get(subject: string, knowledgePoint: string, type: string): Question | null {
    const key = this.getCacheKey(subject, knowledgePoint, type);
    const questions = this.cache.get(key);

    if (questions && questions.length > 0) {
      const index = Math.floor(Math.random() * questions.length);
      return questions[index];
    }

    return null;
  }

  set(subject: string, knowledgePoint: string, type: string, question: Question): void {
    const key = this.getCacheKey(subject, knowledgePoint, type);
    const questions = this.cache.get(key) || [];

    questions.push(question);

    if (questions.length > this.questionCacheSize) {
      questions.shift();
    }

    this.cache.set(key, questions);

    if (this.cache.size > this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

/**
 * 考研智能体类
 */
class ExamAgent {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private cache: QuestionCache;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: AGENT_CONFIG.model,
    });
    this.cache = new QuestionCache(
      AGENT_CONFIG.cache.maxSize,
      AGENT_CONFIG.cache.questionCacheSize
    );
  }

  /**
   * 构建系统Prompt
   */
  private buildSystemPrompt(context: AgentContext): string {
    const { userProfile } = context;

    return `${SYSTEM_PROMPT}

# 用户信息
- 目标院校：${userProfile.university || '未设置'}
- 目标专业：${userProfile.major || '未设置'}
- 考试类型：${userProfile.target || '未设置'}

现在，请以专业、耐心、鼓励的态度，开始你的辅导工作。`;
  }

  /**
   * 提取JSON
   */
  private extractJSON(text: string): any {
    // 尝试提取代码块中的JSON
    const codeBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      return JSON.parse(codeBlockMatch[1]);
    }

    // 尝试提取纯JSON
    const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }

    throw new AgentError(
      AgentErrorType.PARSE_ERROR,
      'Failed to extract JSON from response'
    );
  }

  /**
   * 验证题目质量
   */
  private validateQuestion(question: Question): boolean {
    const { quality } = AGENT_CONFIG;

    // 必填字段检查
    if (!question.content || !question.answer || !question.analysis) {
      return false;
    }

    // 单选题选项检查
    if (question.type === 'choice') {
      if (!question.options || question.options.length !== 4) {
        return false;
      }
      if (!question.options.includes(question.answer)) {
        return false;
      }
    }

    // 内容长度检查
    if (
      question.content.length < quality.minQuestionLength ||
      question.content.length > quality.maxQuestionLength
    ) {
      return false;
    }

    // 解析长度检查
    if (question.analysis.length < quality.minAnalysisLength) {
      return false;
    }

    return true;
  }

  /**
   * 带超时的生成
   */
  private async generateWithTimeout(
    prompt: string,
    timeout: number
  ): Promise<string> {
    return Promise.race([
      this.model.generateContent(prompt).then((result: any) => result.response.text()),
      new Promise<string>((_, reject) =>
        setTimeout(
          () => reject(new AgentError(AgentErrorType.TIMEOUT_ERROR, 'Request timeout')),
          timeout
        )
      )
    ]);
  }

  /**
   * 知识问答
   */
  async chat(question: string, context: AgentContext): Promise<string> {
    try {
      const systemPrompt = this.buildSystemPrompt(context);
      const conversationHistory = context.conversationHistory
        .map(msg => `${msg.role === 'user' ? '学生' : '导师'}: ${msg.text}`)
        .join('\n');

      const prompt = fillTemplate(CHAT_PROMPT_TEMPLATE, {
        university: context.userProfile.university || '未设置',
        major: context.userProfile.major || '未设置',
        examType: context.userProfile.target || '未设置',
        conversationHistory: conversationHistory || '（首次对话）',
        userQuestion: question
      });

      const fullPrompt = `${systemPrompt}\n\n${prompt}`;
      const response = await this.generateWithTimeout(
        fullPrompt,
        AGENT_CONFIG.limits.chatTimeout
      );

      return response;
    } catch (error: any) {
      if (error instanceof AgentError) {
        throw error;
      }
      throw new AgentError(
        AgentErrorType.UNKNOWN_ERROR,
        'Chat failed',
        error
      );
    }
  }

  /**
   * 生成题目
   */
  async generateQuestion(
    subject: string,
    knowledgePoint: string,
    questionType: 'choice' | 'qa' | 'calculation'
  ): Promise<Question> {
    // 检查缓存
    if (AGENT_CONFIG.cache.enabled) {
      const cached = this.cache.get(subject, knowledgePoint, questionType);
      if (cached) {
        return cached;
      }
    }

    // 生成新题目
    const { maxRetries } = AGENT_CONFIG.retry;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const optionsField = questionType === 'choice'
          ? '"options": ["A选项", "B选项", "C选项", "D选项"],'
          : '';

        const prompt = fillTemplate(QUESTION_GENERATION_TEMPLATE, {
          subject,
          knowledgePoint,
          questionType,
          optionsField
        });

        const response = await this.generateWithTimeout(
          prompt,
          AGENT_CONFIG.limits.questionGenerationTimeout
        );

        const questionData = this.extractJSON(response);
        const question: Question = {
          ...questionData,
          id: `gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };

        // 验证题目质量
        if (!this.validateQuestion(question)) {
          console.warn(`Question validation failed, retry ${i + 1}/${maxRetries}`);
          continue;
        }

        // 添加到缓存
        if (AGENT_CONFIG.cache.enabled) {
          this.cache.set(subject, knowledgePoint, questionType, question);
        }

        return question;
      } catch (error: any) {
        console.error(`Question generation error, retry ${i + 1}/${maxRetries}`, error);
        if (i === maxRetries - 1) {
          throw new AgentError(
            AgentErrorType.UNKNOWN_ERROR,
            'Failed to generate question after retries',
            error
          );
        }
        // 等待后重试
        await new Promise(resolve =>
          setTimeout(resolve, AGENT_CONFIG.retry.retryDelay * Math.pow(AGENT_CONFIG.retry.backoffMultiplier, i))
        );
      }
    }

    throw new AgentError(
      AgentErrorType.UNKNOWN_ERROR,
      'Failed to generate question'
    );
  }

  /**
   * 评估答案
   */
  async evaluateAnswer(
    question: Question,
    userAnswer: string
  ): Promise<EvaluationResult> {
    try {
      const prompt = fillTemplate(ANSWER_EVALUATION_TEMPLATE, {
        questionContent: question.content,
        correctAnswer: question.answer,
        knowledgePoint: question.knowledgePoint,
        subject: question.subject,
        userAnswer
      });

      const response = await this.generateWithTimeout(
        prompt,
        AGENT_CONFIG.limits.answerEvaluationTimeout
      );

      const result = this.extractJSON(response);
      return result as EvaluationResult;
    } catch (error: any) {
      if (error instanceof AgentError) {
        throw error;
      }
      throw new AgentError(
        AgentErrorType.UNKNOWN_ERROR,
        'Answer evaluation failed',
        error
      );
    }
  }

  /**
   * 生成相似题
   */
  async generateSimilarQuestions(
    originalQuestion: Question,
    count: number = 5
  ): Promise<Question[]> {
    try {
      const optionsField = originalQuestion.type === 'choice'
        ? '"options": ["A", "B", "C", "D"],'
        : '';

      const prompt = fillTemplate(SIMILAR_QUESTIONS_TEMPLATE, {
        originalQuestion: originalQuestion.content,
        knowledgePoint: originalQuestion.knowledgePoint,
        questionType: originalQuestion.type,
        subject: originalQuestion.subject,
        count: count.toString(),
        optionsField
      });

      const response = await this.generateWithTimeout(
        prompt,
        AGENT_CONFIG.limits.questionGenerationTimeout * 2
      );

      const questionsData = this.extractJSON(response);

      if (!Array.isArray(questionsData)) {
        throw new AgentError(
          AgentErrorType.PARSE_ERROR,
          'Expected array of questions'
        );
      }

      const questions: Question[] = questionsData.map((q: any, index: number) => ({
        ...q,
        id: `sim-${Date.now()}-${index}`
      }));

      return questions;
    } catch (error: any) {
      if (error instanceof AgentError) {
        throw error;
      }
      throw new AgentError(
        AgentErrorType.UNKNOWN_ERROR,
        'Similar questions generation failed',
        error
      );
    }
  }

  /**
   * 清空缓存
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export default ExamAgent;
export { AgentError, AgentErrorType };
export type { AgentContext, EvaluationResult };

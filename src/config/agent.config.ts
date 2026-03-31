/**
 * 考研智能体配置
 */

export const AGENT_CONFIG = {
  // 基础配置
  name: "经济学考研AI导师",
  displayName: "小研",
  model: "gemini-1.5-pro",
  temperature: 0.7,
  maxTokens: 2048,

  // 功能开关
  features: {
    knowledgeQA: true,              // 知识问答
    questionGeneration: true,        // 题目生成
    answerEvaluation: true,          // 答案评估
    similarQuestions: true,          // 相似题生成
    studyPlanning: true,             // 学习规划
    universityConsulting: true,      // 院校咨询
    courseRecommendation: true,      // 课程推荐
    emotionalSupport: true           // 情感支持
  },

  // 限制配置
  limits: {
    maxQuestionsPerSession: 50,      // 每次会话最多生成题目数
    maxConversationTurns: 20,        // 最大对话轮数
    maxSimilarQuestions: 10,         // 最多相似题数量
    questionGenerationTimeout: 10000, // 题目生成超时（ms）
    answerEvaluationTimeout: 8000,   // 答案评估超时（ms）
    chatTimeout: 15000               // 对话超时（ms）
  },

  // 缓存配置
  cache: {
    enabled: true,                   // 是否启用缓存
    maxSize: 100,                    // 最大缓存条目数
    ttl: 3600,                       // 缓存过期时间（秒）
    questionCacheSize: 10            // 每个知识点缓存题目数
  },

  // 重试配置
  retry: {
    maxRetries: 3,                   // 最大重试次数
    retryDelay: 1000,                // 重试延迟（ms）
    backoffMultiplier: 2             // 退避倍数
  },

  // 质量控制
  quality: {
    minQuestionLength: 10,           // 题目最小长度
    maxQuestionLength: 500,          // 题目最大长度
    minAnalysisLength: 20,           // 解析最小长度
    minQualityScore: 50              // 最低质量分数
  }
};

export type AgentConfig = typeof AGENT_CONFIG;

/**
 * 院校咨询分析器
 */

import ExamAgent from './aiAgent'
import type { UserProfile } from '../types'
import type { EnrollmentData, ScoreLine } from '../data'

export interface UniversityAnalysis {
  university: string
  major: string
  competitiveness: 'low' | 'medium' | 'high' | 'very_high'
  score: number
  analysis: string
  recommendations: string[]
  risks: string[]
  advantages: string[]
}

/**
 * 院校咨询服务
 */
export class UniversityConsultant {
  private agent: ExamAgent

  constructor(agent: ExamAgent) {
    this.agent = agent
  }

  /**
   * 分析目标院校
   */
  async analyzeUniversity(params: {
    userProfile: UserProfile
    enrollmentData: EnrollmentData[]
    scoreData: ScoreLine[]
    userScore?: {
      politics: number
      english: number
      math: number
      professional: number
    }
  }): Promise<UniversityAnalysis> {
    const targetEnroll = params.enrollmentData.find(
      (e) =>
        e.university === params.userProfile.university &&
        e.major === params.userProfile.major &&
        e.type === params.userProfile.target
    )

    const targetScore = params.scoreData.find(
      (s) =>
        s.university === params.userProfile.university &&
        s.major === params.userProfile.major &&
        s.type === params.userProfile.target
    )

    const prompt = `# 院校分析任务

## 目标院校信息
- 院校：${params.userProfile.university}
- 专业：${params.userProfile.major}
- 类型：${params.userProfile.target}

## 历年数据
${targetEnroll ? `- 招生人数：${targetEnroll.enrollment}人\n- 报录比：${targetEnroll.ratio}\n- 推免人数：${targetEnroll.exempt}人` : '- 暂无招生数据'}
${targetScore ? `- 复试线：${targetScore.totalScore}分\n- 政治：${targetScore.politics}分\n- 英语：${targetScore.english}分\n- 数学：${targetScore.math}分\n- 专业课：${targetScore.professional}分` : '- 暂无分数线数据'}

${params.userScore ? `## 用户成绩\n- 政治：${params.userScore.politics}分\n- 英语：${params.userScore.english}分\n- 数学：${params.userScore.math}分\n- 专业课：${params.userScore.professional}分\n- 总分：${params.userScore.politics + params.userScore.english + params.userScore.math + params.userScore.professional}分` : ''}

## 任务要求
基于以上数据，进行全面的院校分析，包括：
1. 竞争激烈程度评估（low/medium/high/very_high）
2. 综合评分（0-100）
3. 详细分析
4. 报考建议
5. 风险提示
6. 优势分析

## 输出格式（JSON）
\`\`\`json
{
  "competitiveness": "high",
  "score": 75,
  "analysis": "详细分析内容",
  "recommendations": ["建议1", "建议2"],
  "risks": ["风险1", "风险2"],
  "advantages": ["优势1", "优势2"]
}
\`\`\`

请分析：`

    const response = await this.agent.chat(prompt, {
      userProfile: params.userProfile,
      conversationHistory: [],
      knowledgeBase: {
        enrollmentData: params.enrollmentData,
        scoreData: params.scoreData,
      },
    })

    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/)
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[1])
      return {
        university: params.userProfile.university || '',
        major: params.userProfile.major || '',
        ...result,
      }
    }

    throw new Error('Failed to parse university analysis')
  }

  /**
   * 推荐备选院校
   */
  async recommendAlternatives(params: {
    userProfile: UserProfile
    enrollmentData: EnrollmentData[]
    scoreData: ScoreLine[]
    count?: number
  }): Promise<Array<{
    university: string
    major: string
    reason: string
    matchScore: number
  }>> {
    const prompt = `# 备选院校推荐任务

## 用户目标
- 目标院校：${params.userProfile.university}
- 目标专业：${params.userProfile.major}
- 考试类型：${params.userProfile.target}

## 任务要求
基于用户的目标，推荐${params.count || 5}所备选院校，要求：
1. 专业方向相近
2. 难度梯度合理（冲刺、稳妥、保底）
3. 地理位置考虑
4. 就业前景分析

## 输出格式（JSON）
\`\`\`json
[
  {
    "university": "院校名称",
    "major": "专业名称",
    "reason": "推荐理由",
    "matchScore": 85
  }
]
\`\`\`

请推荐：`

    const response = await this.agent.chat(prompt, {
      userProfile: params.userProfile,
      conversationHistory: [],
      knowledgeBase: {
        enrollmentData: params.enrollmentData,
        scoreData: params.scoreData,
      },
    })

    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1])
    }

    throw new Error('Failed to parse alternatives')
  }
}

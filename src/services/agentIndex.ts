/**
 * 智能体服务统一导出
 */

export { default as ExamAgent } from './aiAgent'
export { AgentError, AgentErrorType } from './aiAgent'
export type { AgentContext, EvaluationResult } from './aiAgent'

export { StudyPlanner } from './studyPlanner'
export { UniversityConsultant } from './universityConsultant'
export type { UniversityAnalysis } from './universityConsultant'

export { agentMonitor, AgentMonitor } from './agentMonitor'

export {
  generateQuestion,
  evaluateAnswer,
  generateSimilarQuestions,
  chatWithTutor,
  clearAgentCache,
} from './geminiService'

import { Question, UserProfile } from "../types";
import { EnrollmentData, ScoreLine } from "../data";

// 模拟延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const aiModel = "mock-model";

export async function generateQuestion(subject: string, knowledgePoint: string, type: string): Promise<Question> {
  await delay(800);
  
  const mockQuestions: Record<string, Question[]> = {
    '微观经济学': [
      {
        id: 'mock-micro-1',
        type: 'choice',
        content: '当某种商品的价格上升时，其替代品的（ ）。',
        options: ['需求增加', '需求减少', '需求不变', '价格下降'],
        answer: '需求增加',
        analysis: '替代品是指功能相同或相似，可以满足消费者同一需要的商品。当一种商品价格上升，消费者会减少对该商品的需求，转而增加对其替代品的需求。',
        knowledgePoint: '需求理论',
        subject: '微观经济学'
      },
      {
        id: 'mock-micro-2',
        type: 'choice',
        content: '在完全竞争市场上，厂商短期均衡的条件是（ ）。',
        options: ['P=MC', 'P=AC', 'P=AVC', 'P=MR'],
        answer: 'P=MC',
        analysis: '在完全竞争市场，厂商是价格的接受者，P=MR。利润最大化条件MR=MC即演变为P=MC。',
        knowledgePoint: '市场结构',
        subject: '微观经济学'
      }
    ],
    '宏观经济学': [
      {
        id: 'mock-macro-1',
        type: 'choice',
        content: '在IS-LM模型中，政府支出增加会导致（ ）。',
        options: ['IS曲线右移', 'IS曲线左移', 'LM曲线右移', 'LM曲线左移'],
        answer: 'IS曲线右移',
        analysis: '政府支出是IS曲线的移动因素。政府支出增加属于扩张性财政政策，会使IS曲线向右上方移动。',
        knowledgePoint: 'IS-LM模型',
        subject: '宏观经济学'
      }
    ]
  };

  const subjectQuestions = mockQuestions[subject] || mockQuestions['微观经济学'];
  const randomQ = subjectQuestions[Math.floor(Math.random() * subjectQuestions.length)];
  
  return {
    ...randomQ,
    id: Math.random().toString(36).substr(2, 9),
    knowledgePoint: knowledgePoint || randomQ.knowledgePoint
  };
}

export async function evaluateAnswer(question: Question, userAnswer: string): Promise<{
  isCorrect: boolean;
  analysis: string;
  detailedExplanation: string;
  recommendedCourse?: string;
}> {
  await delay(1000);
  
  const isCorrect = userAnswer.trim() === question.answer.trim() || 
                    (question.type !== 'choice' && userAnswer.length > 5);

  return {
    isCorrect,
    analysis: isCorrect ? "回答正确！表现不错。" : "回答有误，需要加强练习。",
    detailedExplanation: `这道题考察的是“${question.knowledgePoint}”。${question.analysis}`,
    recommendedCourse: isCorrect ? undefined : `${question.subject}精讲 - ${question.knowledgePoint}`
  };
}

export async function generateSimilarQuestions(question: Question, count: number = 5): Promise<Question[]> {
  await delay(1200);
  
  const similarQuestions: Question[] = [];
  for (let i = 0; i < count; i++) {
    similarQuestions.push({
      id: `similar-${i}-${Math.random().toString(36).substr(2, 5)}`,
      type: question.type,
      content: `[模拟相似题 ${i+1}] 关于“${question.knowledgePoint}”的延伸思考：在${i % 2 === 0 ? '长期' : '短期'}情况下，${question.content.substring(0, 10)}...会有什么变化？`,
      options: question.options ? ['选项A', '选项B', '选项C', '选项D'] : undefined,
      answer: question.options ? '选项A' : '这是一个模拟的详细参考答案。',
      analysis: `这是针对知识点“${question.knowledgePoint}”生成的第${i+1}道相似练习题的模拟解析。`,
      knowledgePoint: question.knowledgePoint,
      subject: question.subject
    });
  }
  return similarQuestions;
}

export async function chatWithTutor(
  history: {role: string, text: string}[], 
  message: string,
  userProfile?: UserProfile,
  enrollmentData?: EnrollmentData[],
  scoreData?: ScoreLine[]
): Promise<string> {
  await delay(1500);
  
  const isVolunteering = message.includes('志愿') || message.includes('填报') || message.includes('报考');
  const isAdjustment = message.includes('调剂');

  if (isVolunteering || isAdjustment) {
    let contextAdvice = "";
    if (userProfile?.university && userProfile?.major) {
      const targetEnroll = enrollmentData?.find(e => 
        e.university === userProfile.university && 
        e.major === userProfile.major &&
        e.type === userProfile.target
      );
      
      const targetScore = scoreData?.find(s => 
        s.university === userProfile.university && 
        s.major === userProfile.major &&
        s.type === userProfile.target
      );

      if (targetEnroll) {
        contextAdvice = `针对你设置的目标：${userProfile.university}${userProfile.major}（${userProfile.target}）。根据最新数据，该专业招生人数为 ${targetEnroll.enrollment} 人，报录比高达 ${targetEnroll.ratio}，竞争压力较大。`;
        if (targetScore) {
          contextAdvice += ` 近年分数线在 ${targetScore.totalScore} 分左右。`;
        }
      } else {
        contextAdvice = `你目前的目标是 ${userProfile.university}${userProfile.major}（${userProfile.target}）。虽然我这里暂时没有该校该专业的精确报录比数据，但作为热门院校，建议你稳扎稳打。`;
      }
    }

    if (isAdjustment) {
      return `${contextAdvice}\n\n关于调剂建议：调剂的核心是“快”和“准”。如果你的预估分数接近往年复试线但排名靠后，建议立即开始搜集二区院校或相关交叉专业的缺额信息。利用好研招网调剂意向采集系统，主动联系导师。`;
    } else {
      return `${contextAdvice}\n\n关于志愿填报建议：建议采取“稳、保、垫”的梯度策略。你的目标院校属于顶尖梯队，如果平时模拟成绩波动较大，可以考虑在填报时预留一些调剂空间，或者关注该校是否有相关的校内调剂机会。`;
    }
  }
  
  if (message.includes('分数线') || message.includes('科目')) {
    return "关于你询问的目标院校信息：通常经济学学硕考察政治、英语一、数学三和专业课（如801经济学）；专硕则可能考察英语二和431金融学综合。具体分数线建议参考该校研招网近三年的复试线，一般名校在360-400分之间。你需要我针对某个具体学校进行分析吗？";
  }
  
  return "你好！我是你的经济学考研助手。目前的回复是模拟数据模式。我可以为你解答专业课难点、分析院校选择策略或提供复试调剂建议。请问今天有什么我可以帮你的？";
}

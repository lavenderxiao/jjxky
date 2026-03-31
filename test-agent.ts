/**
 * 智能体功能测试脚本
 *
 * 使用方法：
 * 1. 确保已配置 VITE_GEMINI_API_KEY
 * 2. 运行：npm run test:agent
 */

import ExamAgent from './src/services/aiAgent';
import type { Question } from './src/types';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color: keyof typeof colors, message: string) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAgent() {
  log('cyan', '\n=== 考研智能体功能测试 ===\n');

  // 检查API密钥
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    log('red', '❌ 错误：未找到 VITE_GEMINI_API_KEY');
    log('yellow', '请在 .env 文件中配置 Gemini API 密钥');
    process.exit(1);
  }

  log('green', '✓ API密钥已配置');

  // 初始化智能体
  const agent = new ExamAgent(apiKey);
  log('green', '✓ 智能体初始化成功\n');

  // 测试1：题目生成
  log('blue', '【测试1】题目生成');
  try {
    const question = await agent.generateQuestion(
      '微观经济学',
      '消费者行为理论',
      'choice'
    );
    log('green', '✓ 题目生成成功');
    console.log('  题目：', question.content);
    console.log('  选项：', question.options);
    console.log('  答案：', question.answer);
    console.log('  解析：', question.analysis.substring(0, 50) + '...\n');

    // 测试2：答案评估
    log('blue', '【测试2】答案评估');
    const evaluation = await agent.evaluateAnswer(question, question.answer);
    log('green', '✓ 答案评估成功');
    console.log('  正确性：', evaluation.isCorrect ? '正确' : '错误');
    console.log('  分析：', evaluation.analysis);
    console.log('  详细解析：', evaluation.detailedExplanation.substring(0, 50) + '...\n');

    // 测试3：相似题生成
    log('blue', '【测试3】相似题生成');
    const similarQuestions = await agent.generateSimilarQuestions(question, 3);
    log('green', `✓ 相似题生成成功（${similarQuestions.length}道）`);
    similarQuestions.forEach((q, i) => {
      console.log(`  题目${i + 1}：`, q.content.substring(0, 40) + '...');
    });
    console.log();

    // 测试4：AI对话
    log('blue', '【测试4】AI对话');
    const response = await agent.chat(
      '请简单解释一下边际效用递减规律',
      {
        userProfile: {
          university: '北京大学',
          major: '理论经济学',
          target: '学硕'
        },
        conversationHistory: []
      }
    );
    log('green', '✓ AI对话成功');
    console.log('  回复：', response.substring(0, 100) + '...\n');

    log('green', '\n=== 所有测试通过 ✓ ===\n');
  } catch (error: any) {
    log('red', `\n❌ 测试失败：${error.message}`);
    if (error.originalError) {
      console.error('原始错误：', error.originalError);
    }
    process.exit(1);
  }
}

// 运行测试
testAgent().catch(error => {
  log('red', `\n❌ 未捕获的错误：${error.message}`);
  console.error(error);
  process.exit(1);
});

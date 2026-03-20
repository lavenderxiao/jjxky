export interface ScoreLine {
  id: string;
  year: number;
  university: string;
  province: string;
  type: '学硕' | '专硕';
  major: string;
  totalScore: number;
  singleSubject1: number;
  singleSubject2: number;
  selfDrawn: boolean;
  specialPlan: boolean;
}

export interface EnrollmentData {
  id: string;
  year: number;
  university: string;
  province: string;
  type: '学硕' | '专硕';
  major: string;
  enrollment: number;
  applicants: number;
  ratio: string;
}

export interface RealExamQuestion {
  id: string;
  year: number;
  source: string; // 如 "北京大学2024年真题"
  type: 'choice' | 'qa' | 'calculation';
  content: string;
  options?: string[];
  answer: string;
  analysis: string;
  knowledgePoint: string;
  subject: string;
}

export const MOCK_SCORES: ScoreLine[] = [
  { id: '1', year: 2024, university: '北京大学', province: '北京', type: '学硕', major: '理论经济学', totalScore: 380, singleSubject1: 55, singleSubject2: 90, selfDrawn: true, specialPlan: false },
  { id: '2', year: 2024, university: '清华大学', province: '北京', type: '学硕', major: '应用经济学', totalScore: 385, singleSubject1: 60, singleSubject2: 90, selfDrawn: true, specialPlan: false },
  { id: '3', year: 2023, university: '复旦大学', province: '上海', type: '专硕', major: '金融学', totalScore: 400, singleSubject1: 60, singleSubject2: 90, selfDrawn: true, specialPlan: false },
  { id: '4', year: 2023, university: '上海交通大学', province: '上海', type: '学硕', major: '应用经济学', totalScore: 375, singleSubject1: 55, singleSubject2: 90, selfDrawn: true, specialPlan: false },
  { id: '5', year: 2022, university: '中国人民大学', province: '北京', type: '学硕', major: '理论经济学', totalScore: 370, singleSubject1: 55, singleSubject2: 90, selfDrawn: true, specialPlan: false },
  { id: '6', year: 2024, university: '中央财经大学', province: '北京', type: '专硕', major: '应用统计', totalScore: 395, singleSubject1: 60, singleSubject2: 90, selfDrawn: false, specialPlan: false },
];

export const MOCK_ENROLLMENT: EnrollmentData[] = [
  { id: '1', year: 2024, university: '北京大学', province: '北京', type: '学硕', major: '理论经济学', enrollment: 25, applicants: 450, ratio: '18:1' },
  { id: '2', year: 2024, university: '清华大学', province: '北京', type: '学硕', major: '应用经济学', enrollment: 15, applicants: 380, ratio: '25:1' },
  { id: '3', year: 2023, university: '复旦大学', province: '上海', type: '专硕', major: '金融学', enrollment: 80, applicants: 1200, ratio: '15:1' },
  { id: '4', year: 2023, university: '上海交通大学', province: '上海', type: '学硕', major: '应用经济学', enrollment: 20, applicants: 300, ratio: '15:1' },
  { id: '5', year: 2022, university: '中国人民大学', province: '北京', type: '学硕', major: '理论经济学', enrollment: 40, applicants: 800, ratio: '20:1' },
];

// 近5年真题库
export const REAL_EXAM_QUESTIONS: RealExamQuestion[] = [
  // 2024年真题
  {
    id: 'real-2024-1',
    year: 2024,
    source: '北京大学2024年真题',
    type: 'choice',
    content: '在完全竞争市场上，厂商实现利润最大化的条件是（ ）。',
    options: ['P=MC', 'P=AC', 'P=AVC', 'MR=AC'],
    answer: 'P=MC',
    analysis: '在完全竞争市场，厂商是价格接受者，P=MR。利润最大化条件MR=MC，因此P=MC。当P>MC时，增加产量可增加利润；当P<MC时，减少产量可增加利润。',
    knowledgePoint: '市场结构',
    subject: '微观经济学'
  },
  {
    id: 'real-2024-2',
    year: 2024,
    source: '清华大学2024年真题',
    type: 'qa',
    content: '简述IS-LM模型中财政政策和货币政策的效果比较。',
    answer: '在IS-LM模型中，财政政策通过移动IS曲线影响均衡收入和利率，货币政策通过移动LM曲线影响均衡收入和利率。当IS曲线较陡峭时，财政政策效果较好；当LM曲线较陡峭时，货币政策效果较好。在流动性陷阱中，货币政策无效，财政政策效果最大。',
    analysis: '此题考察IS-LM模型的政策分析。需要从IS和LM曲线的斜率角度分析，并结合特殊情况如流动性陷阱进行讨论。',
    knowledgePoint: 'IS-LM模型',
    subject: '宏观经济学'
  },
  {
    id: 'real-2024-3',
    year: 2024,
    source: '复旦大学2024年真题',
    type: 'choice',
    content: '根据凯恩斯的货币需求理论，货币需求的三大动机不包括（ ）。',
    options: ['交易动机', '预防动机', '投机动机', '消费动机'],
    answer: '消费动机',
    analysis: '凯恩斯货币需求理论认为，人们持有货币的动机包括：交易动机（日常交易需要）、预防动机（应对意外支出）、投机动机（把握投资机会）。消费动机不属于货币需求的动机。',
    knowledgePoint: '货币需求理论',
    subject: '宏观经济学'
  },
  // 2023年真题
  {
    id: 'real-2023-1',
    year: 2023,
    source: '中国人民大学2023年真题',
    type: 'choice',
    content: '当边际成本曲线位于平均成本曲线下方时，平均成本曲线（ ）。',
    options: ['向上倾斜', '向下倾斜', '达到最低点', '水平'],
    answer: '向下倾斜',
    analysis: '当MC<AC时，MC会将AC拉低，因此AC曲线向下倾斜。当MC>AC时，AC曲线向上倾斜。当MC=AC时，AC达到最低点。',
    knowledgePoint: '成本理论',
    subject: '微观经济学'
  },
  {
    id: 'real-2023-2',
    year: 2023,
    source: '上海交通大学2023年真题',
    type: 'calculation',
    content: '已知某消费者的效用函数为U=X·Y，收入为120元，商品X的价格为2元，商品Y的价格为3元。求消费者均衡时的商品组合和最大效用。',
    answer: 'X=30，Y=20，最大效用U=600',
    analysis: '消费者均衡条件：MUx/Px = MUy/Py。MUx=∂U/∂X=Y，MUy=∂U/∂Y=X。因此Y/2=X/3，即3Y=2X。预算约束：2X+3Y=120。联立解得X=30，Y=20，U=600。',
    knowledgePoint: '消费者行为理论',
    subject: '微观经济学'
  },
  {
    id: 'real-2023-3',
    year: 2023,
    source: '中央财经大学2023年真题',
    type: 'choice',
    content: '在国民收入核算中，下列哪项不计入GDP？（ ）',
    options: ['政府购买', '企业投资', '二手商品交易', '净出口'],
    answer: '二手商品交易',
    analysis: 'GDP核算的是当期生产的最终产品和服务的市场价值。二手商品交易只是所有权转移，不涉及当期生产，因此不计入GDP。',
    knowledgePoint: '国民收入核算',
    subject: '宏观经济学'
  },
  // 2022年真题
  {
    id: 'real-2022-1',
    year: 2022,
    source: '北京大学2022年真题',
    type: 'qa',
    content: '试述垄断的效率损失及其治理对策。',
    answer: '垄断的效率损失表现为：1）产量低于社会最优水平，造成无谓损失；2）价格高于边际成本，消费者剩余减少；3）寻租行为造成资源浪费。治理对策包括：1）反垄断立法与执法；2）价格管制；3）国有化或公共管制；4）促进竞争。',
    analysis: '此题需要从效率损失的经济学原理出发，结合图形分析无谓损失，然后提出综合性的治理措施。',
    knowledgePoint: '市场结构',
    subject: '微观经济学'
  },
  {
    id: 'real-2022-2',
    year: 2022,
    source: '清华大学2022年真题',
    type: 'choice',
    content: '菲利普斯曲线描述的是（ ）之间的关系。',
    options: ['通货膨胀率与失业率', '经济增长率与失业率', '通货膨胀率与经济增长率', '货币供给量与利率'],
    answer: '通货膨胀率与失业率',
    analysis: '菲利普斯曲线最初由新西兰经济学家菲利普斯提出，描述通货膨胀率与失业率之间存在负相关关系。短期内，低失业率伴随着高通胀率，高失业率伴随着低通胀率。',
    knowledgePoint: '失业与通货膨胀',
    subject: '宏观经济学'
  },
  // 2021年真题
  {
    id: 'real-2021-1',
    year: 2021,
    source: '复旦大学2021年真题',
    type: 'calculation',
    content: '某垄断厂商面临的市场需求函数为P=100-Q，其边际成本MC=20。求垄断厂商的均衡价格、产量和利润。',
    answer: '均衡产量Q=40，均衡价格P=60，利润π=1600',
    analysis: '垄断厂商均衡条件：MR=MC。由P=100-Q得TR=PQ=100Q-Q²，MR=dTR/dQ=100-2Q。令MR=MC：100-2Q=20，解得Q=40。P=100-40=60。利润π=TR-TC=60×40-20×40=1600。',
    knowledgePoint: '市场结构',
    subject: '微观经济学'
  },
  {
    id: 'real-2021-2',
    year: 2021,
    source: '中国人民大学2021年真题',
    type: 'choice',
    content: '下列哪种情况会导致IS曲线向右移动？（ ）',
    options: ['政府支出增加', '税收增加', '货币供给增加', '投资减少'],
    answer: '政府支出增加',
    analysis: 'IS曲线表示产品市场均衡时收入与利率的关系。政府支出增加属于扩张性财政政策，会增加总需求，使IS曲线向右移动。税收增加和投资减少会使IS曲线左移。货币供给增加影响的是LM曲线。',
    knowledgePoint: 'IS-LM模型',
    subject: '宏观经济学'
  },
  // 2020年真题
  {
    id: 'real-2020-1',
    year: 2020,
    source: '上海交通大学2020年真题',
    type: 'qa',
    content: '试比较完全竞争市场与垄断竞争市场的异同。',
    answer: '相同点：1）厂商数量众多；2）厂商自由进入退出；3）厂商是价格接受者（完全竞争）或有一定定价能力（垄断竞争）。不同点：1）产品同质性与差异性；2）完全竞争厂商面临水平需求曲线，垄断竞争厂商面临向下倾斜的需求曲线；3）长期均衡时，完全竞争厂商P=MC=AC最低点，垄断竞争厂商P>MC，AC未达最低点；4）垄断竞争存在产品多样化收益与效率损失的权衡。',
    analysis: '此题需要从市场结构的四个维度（厂商数量、产品差异、进入壁垒、信息完全性）进行比较分析，并结合长期均衡条件说明效率差异。',
    knowledgePoint: '市场结构',
    subject: '微观经济学'
  },
  {
    id: 'real-2020-2',
    year: 2020,
    source: '中央财经大学2020年真题',
    type: 'choice',
    content: '根据索洛增长模型，长期经济增长的源泉是（ ）。',
    options: ['资本积累', '技术进步', '人口增长', '政府投资'],
    answer: '技术进步',
    analysis: '索洛模型表明，资本积累和人口增长只能带来暂时的经济增长，长期稳态时人均产出的增长仅来源于技术进步。技术进步是长期经济增长的唯一源泉。',
    knowledgePoint: '经济增长理论',
    subject: '宏观经济学'
  },
];

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
  // 南京审计大学2024年真题（811经济学）
  {
    id: 'nau-2024-1',
    year: 2024,
    source: '南京审计大学2024年真题（811经济学）',
    type: 'qa',
    content: '简述需求价格弹性的含义及其影响因素。',
    answer: '需求价格弹性是指需求量变动对价格变动的反应程度，用公式表示为Ed=ΔQ/Q÷ΔP/P。影响因素包括：1）替代品的可获得性：替代品越多，弹性越大；2）商品的必需程度：必需品弹性小，奢侈品弹性大；3）商品支出占收入比重：比重越大，弹性越大；4）时间长短：时间越长，弹性越大；5）商品用途的广泛性：用途越广，弹性越大。',
    analysis: '此题考察需求价格弹性的基本概念和影响因素，需要从消费者行为和市场特征两个角度分析。',
    knowledgePoint: '需求理论',
    subject: '微观经济学'
  },
  {
    id: 'nau-2024-2',
    year: 2024,
    source: '南京审计大学2024年真题（811经济学）',
    type: 'qa',
    content: '试述边际效用递减规律及其对消费者均衡的意义。',
    answer: '边际效用递减规律是指在一定时间内，随着消费者连续消费某种商品数量的增加，从每增加一单位商品中获得的满足程度逐渐减少。对消费者均衡的意义：1）解释了需求曲线向右下方倾斜的原因；2）消费者均衡条件MUx/Px=MUy/Py成立的基础；3）解释了消费者剩余的存在；4）为价格歧视提供了理论依据。',
    analysis: '此题需要阐述边际效用递减规律的内容，并分析其在消费者行为理论中的重要地位。',
    knowledgePoint: '消费者行为理论',
    subject: '微观经济学'
  },
  {
    id: 'nau-2024-3',
    year: 2024,
    source: '南京审计大学2024年真题（811经济学）',
    type: 'qa',
    content: '简述GDP的核算方法及其局限性。',
    answer: 'GDP核算方法包括：1）生产法：计算各行业增加值之和；2）收入法：计算各生产要素获得的收入之和；3）支出法：计算最终产品和服务的支出总额。局限性：1）不能反映非市场交易活动；2）不能反映产品质量变化；3）不能反映收入分配状况；4）不能反映经济活动的环境成本；5）不能反映闲暇的价值。',
    analysis: '此题考察GDP核算的三种方法及其在衡量经济福利方面的不足。',
    knowledgePoint: '国民收入核算',
    subject: '宏观经济学'
  },
  {
    id: 'nau-2024-4',
    year: 2024,
    source: '南京审计大学2024年真题（811经济学）',
    type: 'qa',
    content: '试述通货膨胀对经济的影响。',
    answer: '通货膨胀对经济的影响包括：1）收入再分配效应：有利于债务人，不利于债权人；有利于浮动收入者，不利于固定收入者。2）资源配置效应：价格信号失真，资源错配。3）经济增长效应：温和通胀可能刺激经济，恶性通胀破坏经济。4）国际收支效应：本国商品竞争力下降，贸易逆差扩大。5）社会心理效应：预期不稳定，投机行为增加。',
    analysis: '此题需要从多个角度分析通货膨胀的经济效应，包括分配效应、资源配置效应和宏观效应。',
    knowledgePoint: '失业与通货膨胀',
    subject: '宏观经济学'
  },
  {
    id: 'nau-2024-5',
    year: 2024,
    source: '南京审计大学2024年真题（811经济学）',
    type: 'qa',
    content: '简述市场失灵的原因及政府干预的必要性。',
    answer: '市场失灵的原因包括：1）垄断：市场势力导致资源配置低效；2）外部性：私人成本与社会成本不一致；3）公共物品：非排他性和非竞争性导致供给不足；4）信息不对称：逆向选择和道德风险。政府干预的必要性：市场机制无法实现帕累托最优，需要政府通过反垄断政策、庇古税、公共供给、信息披露等措施纠正市场失灵，提高资源配置效率。',
    analysis: '此题考察市场失灵的各种情形及政府干预的理论依据。',
    knowledgePoint: '福利经济学',
    subject: '微观经济学'
  },
  {
    id: 'nau-2023-1',
    year: 2023,
    source: '南京审计大学2023年真题（811经济学）',
    type: 'qa',
    content: '试述完全竞争市场的特征及其效率。',
    answer: '完全竞争市场的特征：1）厂商数量众多；2）产品同质；3）完全信息；4）自由进入退出。效率表现：1）生产效率：长期均衡时P=AC最低点，实现最低成本生产；2）配置效率：P=MC，实现社会最优产出；3）帕累托最优：消费者剩余和生产者剩余最大化。局限性：忽略了规模经济、产品差异化和动态效率。',
    analysis: '此题需要阐述完全竞争市场的四个基本假设，并分析其静态效率。',
    knowledgePoint: '市场结构',
    subject: '微观经济学'
  },
  {
    id: 'nau-2023-2',
    year: 2023,
    source: '南京审计大学2023年真题（811经济学）',
    type: 'qa',
    content: '简述IS曲线的推导过程及其移动因素。',
    answer: 'IS曲线推导：从产品市场均衡条件Y=C+I+G出发，消费函数C=C(Y-T)，投资函数I=I(r)，得到Y=C(Y-T)+I(r)+G。在Y-r平面上，满足产品市场均衡的Y与r的组合形成IS曲线。移动因素：1）政府支出增加，IS右移；2）税收增加，IS左移；3）投资预期改善，IS右移；4）消费倾向提高，IS右移。',
    analysis: '此题需要从产品市场均衡条件出发，推导IS曲线并分析其移动因素。',
    knowledgePoint: 'IS-LM模型',
    subject: '宏观经济学'
  },
  {
    id: 'nau-2022-1',
    year: 2022,
    source: '南京审计大学2022年真题（811经济学）',
    type: 'qa',
    content: '试述财政政策的挤出效应及其影响因素。',
    answer: '挤出效应是指政府支出增加导致利率上升，从而挤占私人投资的现象。影响因素：1）IS曲线斜率：越陡峭，挤出效应越小；2）LM曲线斜率：越陡峭，挤出效应越大；3）投资对利率的敏感程度：越敏感，挤出效应越大；4）货币需求对利率的敏感程度：越敏感，挤出效应越小。在流动性陷阱中，挤出效应为零。',
    analysis: '此题需要解释挤出效应的机制，并从IS-LM模型角度分析影响因素。',
    knowledgePoint: '宏观经济政策',
    subject: '宏观经济学'
  },
  {
    id: 'nau-2021-1',
    year: 2021,
    source: '南京审计大学2021年真题（811经济学）',
    type: 'qa',
    content: '简述科斯定理及其在解决外部性问题中的应用。',
    answer: '科斯定理：在交易成本为零、产权明确的情况下，无论初始产权如何分配，市场交易都能实现资源的有效配置。应用：1）明确产权是解决外部性的前提；2）降低交易成本有助于市场自发解决外部性；3）排污权交易制度的理论基础；4）为环境治理提供市场化思路。局限性：现实中交易成本往往不为零。',
    analysis: '此题考察科斯定理的内容及其在外部性治理中的实践意义。',
    knowledgePoint: '福利经济学',
    subject: '微观经济学'
  },
  {
    id: 'nau-2020-1',
    year: 2020,
    source: '南京审计大学2020年真题（811经济学）',
    type: 'qa',
    content: '试述经济增长的源泉及促进经济增长的政策。',
    answer: '经济增长源泉：1）资本积累：物质资本和人力资本增加；2）劳动力增长：人口增加和劳动参与率提高；3）技术进步：生产效率提升和创新。促进政策：1）提高储蓄率和投资率；2）发展教育和培训，提升人力资本；3）鼓励技术创新和研发投入；4）完善市场机制，优化资源配置；5）对外开放，引进先进技术和管理经验。',
    analysis: '此题需要从生产要素角度分析增长源泉，并提出相应的政策建议。',
    knowledgePoint: '经济增长理论',
    subject: '宏观经济学'
  },
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
    knowledgePoint: '宏观经济政策',
    subject: '宏观经济学'
  },
  {
    id: 'real-2024-4',
    year: 2024,
    source: '中国人民大学2024年真题',
    type: 'choice',
    content: '商品的边际替代率递减规律决定了无差异曲线（ ）。',
    options: ['凸向原点', '凹向原点', '是一条直线', '向右上方倾斜'],
    answer: '凸向原点',
    analysis: '边际替代率递减意味着消费者为保持相同的满足程度，增加一单位X商品所愿意放弃的Y商品数量递减，这使得无差异曲线凸向原点。',
    knowledgePoint: '消费者行为理论',
    subject: '微观经济学'
  },
  {
    id: 'real-2024-5',
    year: 2024,
    source: '上海交通大学2024年真题',
    type: 'qa',
    content: '试述经济增长的索洛模型及其政策含义。',
    answer: '索洛模型假设生产函数Y=F(K,L)，资本积累方程为ΔK=sY-δK。稳态时，人均资本k*满足s·f(k*)=(n+δ)k*。模型表明：1）储蓄率影响稳态人均产出水平，但不影响长期增长率；2）人口增长率影响稳态人均产出水平；3）技术进步是长期人均产出增长的唯一源泉。政策含义：提高储蓄率可提高人均收入水平，促进技术进步是实现长期增长的关键。',
    analysis: '此题需要完整阐述索洛模型的基本假设、核心方程、稳态条件及政策含义。',
    knowledgePoint: '经济增长理论',
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
  {
    id: 'real-2023-4',
    year: 2023,
    source: '北京大学2023年真题',
    type: 'choice',
    content: '在博弈论中，纳什均衡是指（ ）。',
    options: ['所有参与者的最优策略组合', '每个参与者在给定其他参与者策略下选择的最优策略组合', '使社会总福利最大化的策略组合', '参与者合作时的策略组合'],
    answer: '每个参与者在给定其他参与者策略下选择的最优策略组合',
    analysis: '纳什均衡是博弈论的核心概念，指在给定其他参与者策略的情况下，每个参与者都选择了使自己效用最大化的策略，没有人有动机单方面改变策略。',
    knowledgePoint: '博弈论',
    subject: '微观经济学'
  },
  {
    id: 'real-2023-5',
    year: 2023,
    source: '清华大学2023年真题',
    type: 'qa',
    content: '简述通货膨胀的成因及其治理对策。',
    answer: '通货膨胀成因：1）需求拉动：总需求超过总供给；2）成本推动：工资、原材料价格上涨；3）结构性因素：部门发展不平衡；4）货币因素：货币供给过多。治理对策：1）紧缩性财政政策：减少政府支出、增加税收；2）紧缩性货币政策：提高利率、减少货币供给；3）收入政策：控制工资和物价；4）供给管理：提高生产效率、增加供给。',
    analysis: '此题需要从需求和供给两个角度分析通货膨胀成因，并提出相应的治理措施。',
    knowledgePoint: '失业与通货膨胀',
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
  {
    id: 'real-2022-3',
    year: 2022,
    source: '复旦大学2022年真题',
    type: 'choice',
    content: '等成本线绕着它与横轴的交点向外移动表明（ ）。',
    options: ['劳动价格下降', '资本价格下降', '总成本增加', '劳动和资本价格都下降'],
    answer: '资本价格下降',
    analysis: '等成本线与横轴的交点表示全部成本用于购买劳动的数量。等成本线绕此点向外移动，说明同样的成本可以购买更多的资本，即资本价格下降。',
    knowledgePoint: '生产理论',
    subject: '微观经济学'
  },
  {
    id: 'real-2022-4',
    year: 2022,
    source: '中国人民大学2022年真题',
    type: 'qa',
    content: '试述AD-AS模型及其对经济波动的解释。',
    answer: 'AD-AS模型通过总需求曲线和总供给曲线分析宏观经济均衡。AD曲线向右下方倾斜，源于财富效应、利率效应和汇率效应；AS曲线分为短期和长期，短期向右上方倾斜，长期垂直于潜在产出水平。经济波动可由AD冲击（如财政货币政策变化、消费投资变化）或AS冲击（如石油价格冲击、技术进步）解释。AD增加导致短期产出增加、价格上升；AS左移导致滞胀。',
    analysis: '此题需要阐述AD曲线和AS曲线的推导、形状及移动因素，并用模型解释经济波动。',
    knowledgePoint: 'AD-AS模型',
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
  {
    id: 'real-2021-3',
    year: 2021,
    source: '上海交通大学2021年真题',
    type: 'choice',
    content: '科斯定理表明，在交易成本为零时，产权的初始分配（ ）。',
    options: ['影响资源配置效率', '不影响资源配置效率', '决定收入分配', '导致市场失灵'],
    answer: '不影响资源配置效率',
    analysis: '科斯定理指出，在交易成本为零、产权明确的情况下，无论初始产权如何分配，市场交易都能实现资源的有效配置。但产权分配会影响收入分配。',
    knowledgePoint: '福利经济学',
    subject: '微观经济学'
  },
  {
    id: 'real-2021-4',
    year: 2021,
    source: '中央财经大学2021年真题',
    type: 'qa',
    content: '简述货币政策工具及其传导机制。',
    answer: '货币政策工具包括：1）公开市场操作：买卖政府债券调节基础货币；2）法定存款准备金率：调整商业银行的准备金约束；3）再贴现率：调整商业银行向央行借款的成本。传导机制：1）利率渠道：货币供给增加→利率下降→投资增加→产出增加；2）信贷渠道：货币供给增加→银行贷款增加→投资消费增加；3）资产价格渠道：货币供给增加→资产价格上涨→财富效应→消费增加。',
    analysis: '此题需要介绍三大货币政策工具及其作用机制，并阐述货币政策的传导渠道。',
    knowledgePoint: '宏观经济政策',
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
  {
    id: 'real-2020-3',
    year: 2020,
    source: '北京大学2020年真题',
    type: 'choice',
    content: '规模报酬递增是指（ ）。',
    options: ['所有要素投入增加1倍，产出增加超过1倍', '所有要素投入增加1倍，产出增加1倍', '所有要素投入增加1倍，产出增加不足1倍', '边际产量递增'],
    answer: '所有要素投入增加1倍，产出增加超过1倍',
    analysis: '规模报酬描述的是所有要素同比例增加时产出的变化。规模报酬递增意味着要素投入增加的比例小于产出增加的比例。注意与边际报酬递减区分。',
    knowledgePoint: '生产理论',
    subject: '微观经济学'
  },
  {
    id: 'real-2020-4',
    year: 2020,
    source: '清华大学2020年真题',
    type: 'qa',
    content: '试述市场失灵的原因及其矫正措施。',
    answer: '市场失灵原因：1）垄断：市场势力导致资源配置低效；2）外部性：私人成本与社会成本不一致；3）公共物品：非排他性和非竞争性导致供给不足；4）信息不对称：逆向选择和道德风险。矫正措施：1）反垄断政策、价格管制；2）庇古税、产权界定、外部性内部化；3）政府提供公共物品；4）信息披露制度、信号发送机制。',
    analysis: '此题需要系统阐述市场失灵的各种原因，并提出相应的政府干预措施。',
    knowledgePoint: '福利经济学',
    subject: '微观经济学'
  },
];

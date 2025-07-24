import { mastra } from './src/mastra/index.js';

// 获取不同模式的Agents
const reactAgent = mastra.getAgent('universalCodeAgent');
const cotAgent = mastra.getAgent('chainOfThoughtAgent');
const totAgent = mastra.getAgent('treeOfThoughtsAgent');

async function testAgentPatterns() {
  console.log('🤖 Agent Design Patterns Comparison Test\n');
  console.log('Testing different agent design patterns with the same problem...');
  console.log('=' .repeat(80));

  // 定义一个复杂的问题来测试不同模式
  const complexProblem = `
  我们需要为一个快速增长的电商网站设计缓存策略。当前问题：
  - 每日活跃用户100万+，高峰时段并发访问量很大
  - 商品信息经常更新（价格、库存、促销信息）
  - 用户个性化推荐数据需要实时性
  - 现有数据库查询响应时间2-3秒，用户体验差
  - 预算有限，需要考虑成本效益
  - 团队技术栈主要是Java Spring Boot + MySQL + Redis
  
  请给出最佳的缓存架构设计方案。
  `;

  // 测试1: ReAct模式 - 推理与行动结合
  console.log('\n🔄 Test 1: ReAct Pattern (Reasoning + Acting)');
  console.log('-' .repeat(60));
  console.log('特点: 推理和行动交替，使用工具辅助决策\n');

  try {
    const reactResult = await reactAgent.generate(complexProblem, {
      memory: {
        resource: 'pattern-test',
        thread: 'react-caching'
      },
      maxSteps: 8
    });

    console.log('✅ ReAct Agent 完成分析');
    console.log('💡 工作方式: 分析问题 → 使用工具 → 观察结果 → 调整策略');
    console.log('🎯 擅长: 需要工具支持的复杂任务，可以生成实际代码和配置');
  } catch (error) {
    console.error('❌ ReAct模式测试失败:', error);
  }

  await new Promise(resolve => setTimeout(resolve, 2000)); // 避免请求过快

  // 测试2: Chain of Thought模式 - 逐步推理
  console.log('\n🧠 Test 2: Chain of Thought Pattern');
  console.log('-' .repeat(60));
  console.log('特点: 逐步推理，展示完整思考过程，不使用外部工具\n');

  try {
    const cotResult = await cotAgent.generate(complexProblem, {
      memory: {
        resource: 'pattern-test',
        thread: 'cot-caching'
      },
      maxSteps: 3
    });

    console.log('✅ Chain of Thought Agent 完成分析');
    console.log('💡 工作方式: 问题分解 → 逐步推理 → 逻辑链条 → 最终结论');
    console.log('🎯 擅长: 逻辑分析、决策推理、理论分析');
  } catch (error) {
    console.error('❌ Chain of Thought模式测试失败:', error);
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  // 测试3: Tree of Thoughts模式 - 多路径探索
  console.log('\n🌳 Test 3: Tree of Thoughts Pattern');
  console.log('-' .repeat(60));
  console.log('特点: 生成多个候选方案，并行探索，量化评估选择最优\n');

  try {
    const totResult = await totAgent.generate(complexProblem, {
      memory: {
        resource: 'pattern-test',
        thread: 'tot-caching'
      },
      maxSteps: 12
    });

    console.log('✅ Tree of Thoughts Agent 完成分析');
    console.log('💡 工作方式: 生成多方案 → 并行探索 → 量化评估 → 选择最优');
    console.log('🎯 擅长: 复杂决策、方案比较、创新思维');
  } catch (error) {
    console.error('❌ Tree of Thoughts模式测试失败:', error);
  }

  // 测试4: 对比不同模式的数学问题处理
  console.log('\n📊 Test 4: Mathematical Problem Solving Comparison');
  console.log('-' .repeat(60));

  const mathProblem = `
  一家公司的月收入增长遵循以下模式：
  - 第1个月：10万元
  - 第2个月：12万元  
  - 第3个月：14.4万元
  - 第4个月：17.28万元
  
  请分析这个增长模式，并预测第12个月的收入。同时分析如果这个趋势持续一年，总收入会是多少？
  `;

  console.log('\n🧮 数学问题: 公司收入增长分析');

  // CoT最适合数学推理
  try {
    console.log('\n📈 Chain of Thought处理数学问题:');
    const mathCotResult = await cotAgent.generate(mathProblem, {
      memory: {
        resource: 'pattern-test',
        thread: 'math-cot'
      }
    });

    console.log('✅ CoT数学分析完成');
    console.log('💡 优势: 清晰的推理步骤，适合逻辑性强的问题');
  } catch (error) {
    console.error('❌ CoT数学分析失败:', error);
  }

  // 测试5: 模式选择建议
  console.log('\n🎯 Test 5: Pattern Selection Guidelines');
  console.log('-' .repeat(60));

  const patternGuide = `
  ## 📋 何时使用不同的Agent模式？

  ### 🔄 ReAct模式 - 适用场景
  ✅ 需要使用外部工具的任务
  ✅ 代码生成和文件操作
  ✅ 数据查询和API调用
  ✅ 多步骤操作任务
  ✅ 需要验证和迭代的工作

  ### 🧠 Chain of Thought模式 - 适用场景  
  ✅ 数学计算和逻辑推理
  ✅ 理论分析和概念解释
  ✅ 文本理解和推理
  ✅ 不需要外部工具的问题
  ✅ 需要展示思考过程的场景

  ### 🌳 Tree of Thoughts模式 - 适用场景
  ✅ 复杂决策和方案选择
  ✅ 创意问题和头脑风暴
  ✅ 架构设计和技术选型
  ✅ 需要比较多个方案的场景
  ✅ 探索性和创新性任务

  ## 🔄 模式组合使用
  
  ### 分阶段使用
  1. **探索阶段**: 使用ToT生成多个创意方案
  2. **分析阶段**: 使用CoT深入分析选定方案  
  3. **实施阶段**: 使用ReAct进行具体实现

  ### 并行使用
  - 同时运行不同模式的Agent
  - 比较不同视角的分析结果
  - 综合各种模式的优势

  ## 💡 选择建议
  
  | 任务类型 | 推荐模式 | 备选模式 |
  |---------|----------|----------|
  | 代码开发 | ReAct | - |
  | 数学计算 | CoT | - |
  | 架构设计 | ToT | ReAct |
  | 逻辑推理 | CoT | ToT |
  | 创意思维 | ToT | - |
  | 工具使用 | ReAct | - |
  | 决策分析 | ToT | CoT |
  | 问题诊断 | CoT | ReAct |
  `;

  console.log(patternGuide);

  console.log('\n🎉 Agent Design Patterns Test Completed!');
  console.log('\n📊 测试总结:');
  console.log('   ✓ ReAct: 工具驱动，适合实际操作');
  console.log('   ✓ CoT: 推理驱动，适合逻辑分析');  
  console.log('   ✓ ToT: 创意驱动，适合方案比较');
  console.log('\n💡 根据具体任务选择最合适的模式，或组合使用获得更好效果！');
}

// 运行测试
testAgentPatterns().catch(console.error); 
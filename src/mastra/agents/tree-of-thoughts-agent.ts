import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// 方案评估工具
const evaluateSolutionTool = createTool({
  id: 'evaluate-solution',
  description: 'Evaluate a solution candidate based on multiple criteria',
  inputSchema: z.object({
    solution: z.string().describe('The solution to evaluate'),
    criteria: z.array(z.string()).describe('Evaluation criteria'),
    context: z.string().describe('Problem context'),
  }),
  outputSchema: z.object({
    overallScore: z.number().min(0).max(10).describe('Overall score out of 10'),
    criteriaScores: z.record(z.number()).describe('Scores for each criterion'),
    strengths: z.array(z.string()).describe('Solution strengths'),
    weaknesses: z.array(z.string()).describe('Solution weaknesses'),
    feasibility: z.enum(['high', 'medium', 'low']).describe('Implementation feasibility'),
  }),
  execute: async ({ context }) => {
    const { solution, criteria, context: problemContext } = context;
    
    // 简化的评估逻辑（实际应用中可以更复杂）
    const criteriaScores: Record<string, number> = {};
    let totalScore = 0;
    
    for (const criterion of criteria) {
      // 基于关键词的简单评分（实际应用中应该使用更智能的评估）
      let score = 5; // 基础分数
      
      if (criterion.includes('成本') || criterion.includes('cost')) {
        score = solution.includes('便宜') || solution.includes('低成本') ? 8 : 4;
      } else if (criterion.includes('质量') || criterion.includes('quality')) {
        score = solution.includes('高质量') || solution.includes('优化') ? 8 : 5;
      } else if (criterion.includes('速度') || criterion.includes('efficiency')) {
        score = solution.includes('快速') || solution.includes('高效') ? 8 : 5;
      } else if (criterion.includes('可维护') || criterion.includes('maintainable')) {
        score = solution.includes('模块化') || solution.includes('标准') ? 8 : 5;
      }
      
      criteriaScores[criterion] = score;
      totalScore += score;
    }
    
    const overallScore = Math.min(10, totalScore / criteria.length);
    
    const strengths = [];
    const weaknesses = [];
    
    if (overallScore >= 7) {
      strengths.push('整体方案评分较高');
    }
    if (overallScore < 6) {
      weaknesses.push('需要进一步优化');
    }
    
    const feasibility: 'high' | 'medium' | 'low' = overallScore >= 7 ? 'high' : overallScore >= 5 ? 'medium' : 'low';
    
    return {
      overallScore,
      criteriaScores,
      strengths,
      weaknesses,
      feasibility,
    };
  },
});

export const treeOfThoughtsAgent = new Agent({
  name: 'Tree of Thoughts Agent',
  description: 'An agent that explores multiple solution paths simultaneously and selects the best approach using tree-like reasoning.',
  instructions: `
你是一个多路径思考专家，使用Tree of Thoughts (ToT)模式工作。

## 🌳 工作流程

### 第一阶段：方案生成 (Solution Generation)
当收到复杂问题时，你必须：

1. **深度分析问题**: 理解问题的核心需求和约束条件
2. **生成多个候选方案**: 至少创建3-5个不同的解决思路
3. **确保方案多样性**: 每个方案应该采用不同的策略或角度

### 第二阶段：并行探索 (Parallel Exploration)
对每个候选方案：

1. **详细阐述方案**: 完整描述实施步骤和技术细节
2. **分析优缺点**: 客观评估方案的强项和弱点
3. **识别风险点**: 预见可能的实施障碍和风险
4. **评估资源需求**: 分析所需的时间、成本、技能等资源

### 第三阶段：评估与选择 (Evaluation & Selection)
1. **使用evaluate-solution工具**: 对每个方案进行量化评估
2. **多维度比较**: 从可行性、成本、质量、维护性等角度比较
3. **选择最佳方案**: 基于评估结果选择最优解
4. **考虑混合方案**: 如果合适，可以结合多个方案的优点

## 📋 输出格式

### 🎯 问题理解
简要重述问题的核心需求和关键约束。

### 🌟 候选方案

#### 方案A: [方案名称]
**核心思路**: [简要描述]
**实施步骤**: 
1. 步骤一
2. 步骤二
3. 步骤三

**优势**: 
- 优势1
- 优势2

**劣势**:
- 劣势1
- 劣势2

**适用场景**: [何时选择此方案]

#### 方案B: [方案名称]
[同样的结构...]

#### 方案C: [方案名称]
[同样的结构...]

### 📊 评估结果
[使用工具评估每个方案的具体评分]

### 🏆 最终推荐
**推荐方案**: [选择的方案]
**推荐理由**: [详细解释为什么选择这个方案]
**实施建议**: [具体的实施指导]
**风险缓解**: [如何降低关键风险]

## 💡 创新思维技巧

### 多角度思考
- **技术角度**: 考虑不同的技术实现路径
- **商业角度**: 评估成本效益和商业价值
- **用户角度**: 从用户体验和需求出发
- **运维角度**: 考虑部署、维护和扩展性

### 创意方法
- **逆向思维**: 从问题的反面思考解决方案
- **类比思考**: 参考其他领域的成功案例
- **组合创新**: 将不同的解决思路进行组合
- **边界探索**: 考虑极端情况下的解决方案

### 方案多样性确保
- **保守方案**: 基于成熟技术的稳妥解决方案
- **创新方案**: 采用新技术或新思路的前沿方案
- **混合方案**: 结合多种方法的综合解决方案
- **简化方案**: 追求简洁和易实现的最小可行方案

## 🎯 适用场景

### 架构设计决策
- 系统架构选型
- 数据库设计方案
- 微服务拆分策略
- 技术栈选择

### 业务问题解决
- 产品功能设计
- 用户体验优化
- 业务流程改进
- 市场策略制定

### 创意和创新
- 新产品概念设计
- 创意营销方案
- 问题创新解决
- 流程优化创新

### 复杂决策
- 投资决策分析
- 风险管理策略
- 资源分配优化
- 项目规划方案

## ⚠️ 重要原则

### 确保方案质量
- 每个方案都必须具有可行性
- 避免为了数量牺牲质量
- 方案之间应该有明显的差异化

### 客观评估
- 使用量化工具进行评估
- 承认每个方案的局限性
- 避免主观偏好影响判断

### 实用性优先
- 考虑实际实施的可能性
- 评估资源和时间约束
- 关注长期可维护性

记住：Tree of Thoughts的价值在于系统性地探索问题空间，发现常规思维可能遗漏的优秀解决方案。
`,
  model: openai('gpt-4o'),
  tools: {
    evaluateSolution: evaluateSolutionTool,
  },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
  // ToT需要更多步骤来探索多个方案
  defaultGenerateOptions: {
    maxSteps: 15,
  },
}); 
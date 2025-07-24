# 🤖 Agent设计模式快速指南

## 📋 核心模式对比

| 模式 | 核心特征 | 主要优势 | 最佳场景 | 示例用途 |
|------|----------|----------|----------|----------|
| **ReAct** | 推理+行动循环 | 工具使用、可纠错 | 需要外部工具 | 代码生成、API调用 |
| **Chain of Thought** | 逐步推理 | 思路清晰、逻辑性强 | 逻辑推理 | 数学计算、理论分析 |
| **Tree of Thoughts** | 多方案探索 | 全面比较、创新性 | 复杂决策 | 架构设计、方案选择 |
| **Plan-Execute** | 规划后执行 | 结构化、可跟踪 | 大型项目 | 项目管理、部署流程 |
| **Multi-Agent** | 专家协作 | 专业分工、并行处理 | 复杂系统 | 团队协作、跨领域任务 |

## 🎯 快速选择指南

### 🔄 选择ReAct模式，当你需要：
- ✅ 生成代码或配置文件
- ✅ 调用API或查询数据
- ✅ 操作文件系统
- ✅ 多步骤验证和迭代

**示例**: "创建一个Python FastAPI项目，包含数据库集成和Docker配置"

### 🧠 选择Chain of Thought模式，当你需要：
- ✅ 解决数学问题
- ✅ 逻辑推理和分析
- ✅ 理论解释和概念阐述
- ✅ 不需要外部工具的纯思考任务

**示例**: "分析这个算法的时间复杂度，并解释每一步的推理过程"

### 🌳 选择Tree of Thoughts模式，当你需要：
- ✅ 比较多个解决方案
- ✅ 架构设计决策
- ✅ 创意问题解决
- ✅ 复杂的技术选型

**示例**: "为高并发系统设计缓存策略，比较不同方案的优缺点"

## 🛠️ 在Mastra中使用

### 基础用法
```typescript
// 获取不同模式的Agent
const reactAgent = mastra.getAgent('universalCodeAgent');
const cotAgent = mastra.getAgent('chainOfThoughtAgent');
const totAgent = mastra.getAgent('treeOfThoughtsAgent');

// 使用ReAct模式生成代码
const codeResult = await reactAgent.generate("创建一个Node.js Express服务器");

// 使用CoT模式进行推理
const analysisResult = await cotAgent.generate("分析这个问题的根本原因");

// 使用ToT模式比较方案
const solutionResult = await totAgent.generate("设计数据库架构，比较不同方案");
```

### 组合使用策略
```typescript
// 三阶段组合使用
async function solveComplexProblem(problem: string) {
  // 阶段1: 用ToT探索多个方案
  const options = await totAgent.generate(`探索解决方案: ${problem}`);
  
  // 阶段2: 用CoT深入分析选定方案
  const analysis = await cotAgent.generate(`深入分析最佳方案: ${options.text}`);
  
  // 阶段3: 用ReAct实现具体方案
  const implementation = await reactAgent.generate(`实现方案: ${analysis.text}`);
  
  return { options, analysis, implementation };
}
```

## 📊 性能和成本考虑

| 模式 | 计算成本 | 响应时间 | 输出质量 | 推荐频率 |
|------|----------|----------|----------|----------|
| CoT | 低 | 快 | 高(逻辑类) | 高频使用 |
| ReAct | 中等 | 中等 | 高(实操类) | 中频使用 |
| ToT | 高 | 慢 | 很高(决策类) | 低频使用 |

## 🎨 实际应用场景

### 软件开发项目
```
1. 需求分析 → CoT (逻辑分析)
2. 架构设计 → ToT (方案比较)  
3. 代码实现 → ReAct (工具使用)
4. 测试验证 → ReAct (执行测试)
```

### 业务决策分析
```
1. 问题诊断 → CoT (根因分析)
2. 方案生成 → ToT (多方案探索)
3. 数据收集 → ReAct (工具查询)
4. 决策建议 → CoT (综合推理)
```

### 学习和研究
```
1. 概念理解 → CoT (逐步推理)
2. 方法比较 → ToT (多角度分析)
3. 实验验证 → ReAct (工具实验)
4. 总结归纳 → CoT (逻辑总结)
```

## 🚀 开始使用

### 1. 启动Mastra服务
```bash
mastra dev
```

### 2. 访问Web界面
- 浏览器打开: `http://localhost:4111`
- 选择对应的Agent模式

### 3. 或运行测试
```bash
# 测试不同模式的对比
node test-agent-patterns.ts
```

### 4. 根据需求选择模式
参考上面的选择指南，选择最适合你当前任务的Agent模式。

---

## 💡 最佳实践建议

### ✅ 推荐做法
- **明确任务类型**: 根据任务特点选择合适的模式
- **组合使用**: 复杂项目可以分阶段使用不同模式
- **利用记忆**: 使用memory参数维持上下文
- **适度复杂**: 避免为简单任务使用复杂模式

### ❌ 避免做法
- **盲目选择**: 不分析任务特点就选择模式
- **过度复杂**: 简单问题使用Tree of Thoughts
- **忽视成本**: 频繁使用高成本模式
- **缺乏测试**: 不验证模式效果就投入使用

---

🎯 **记住**: 没有最好的模式，只有最适合的模式。根据具体任务需求选择，必要时组合使用多种模式！ 
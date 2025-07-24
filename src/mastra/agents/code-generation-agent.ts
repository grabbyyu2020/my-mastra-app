import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { 
  generateHTMLTool, 
  generateCSSTool, 
  generateJavaScriptTool, 
  createProjectTool,
  analyzeCodeTool 
} from '../tools/code-generation-tools';

export const codeGenerationAgent = new Agent({
  name: 'Code Generation Agent',
  description: 'A ReAct agent that can generate complete web applications with HTML, CSS, and JavaScript. Specializes in creating modern, responsive, and accessible web projects.',
  instructions: `
你是一个专业的代码生成助手，具有ReAct（推理-行动）能力。你可以：

## 核心能力
1. **HTML生成**: 创建语义化、可访问的HTML结构
2. **CSS生成**: 编写现代CSS，支持响应式设计和深色模式
3. **JavaScript生成**: 生成ES6+代码，包含交互功能和表单验证
4. **项目创建**: 生成完整的网页项目结构
5. **代码分析**: 分析现有代码并提供优化建议

## ReAct工作模式
你应该按照以下步骤工作：

### 1. 思考（Reasoning）
- 仔细分析用户的需求
- 确定需要什么类型的功能和设计
- 规划生成步骤和使用哪些工具

### 2. 行动（Action）
- 使用适当的工具生成代码
- 根据需要调用多个工具来完成任务
- 基于工具结果调整策略

### 3. 观察和迭代
- 检查生成的代码质量
- 根据需要进行优化和改进
- 提供建议和最佳实践

## 工作原则
- **用户体验优先**: 总是考虑最终用户的体验
- **现代标准**: 使用最新的Web标准和最佳实践
- **可访问性**: 确保生成的代码符合无障碍访问标准
- **性能优化**: 关注代码性能和加载速度
- **响应式设计**: 确保在所有设备上都能良好显示
- **代码质量**: 生成清晰、可维护的代码

## 与用户交互指南
1. **理解需求**: 如果需求不明确，主动询问具体细节
2. **提供选择**: 给出不同的设计和技术选项
3. **解释决策**: 说明为什么选择特定的技术或方法
4. **教育用户**: 分享相关的Web开发知识和最佳实践

## 工具使用策略
- 对于简单页面：HTML → CSS → JavaScript → 项目创建
- 对于复杂需求：先分析 → 分步生成 → 最终整合
- 对于代码改进：先分析 → 提供建议 → 重新生成

记住：你不仅是代码生成器，更是用户的编程伙伴和顾问。
`,
  model: openai('gpt-4o'),
  tools: {
    generateHTML: generateHTMLTool,
    generateCSS: generateCSSTool,
    generateJavaScript: generateJavaScriptTool,
    createProject: createProjectTool,
    analyzeCode: analyzeCodeTool,
  },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
  // 允许agent进行多步推理和行动
  defaultGenerateOptions: {
    maxSteps: 10, // 允许多次工具调用来完成复杂任务
  },
  defaultStreamOptions: {
    maxSteps: 10,
  },
}); 
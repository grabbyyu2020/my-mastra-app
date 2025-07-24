# 🤖 Mastra ReAct 代码生成 Agent 使用指南

这是一个具有 ReAct（Reasoning + Acting）能力的智能代码生成助手，可以自动生成现代网页的 HTML、CSS 和 JavaScript 代码。

## 🌟 核心特性

### ReAct 能力
- **推理（Reasoning）**: 深度分析用户需求，制定代码生成策略
- **行动（Action）**: 智能使用工具生成高质量代码
- **观察与迭代**: 基于结果优化和改进代码

### 代码生成能力
- 🏗️ **HTML 生成**: 语义化、可访问的 HTML 结构
- 🎨 **CSS 生成**: 现代 CSS，支持响应式设计和深色模式
- ⚡ **JavaScript 生成**: ES6+ 代码，包含交互功能和表单验证
- 📁 **项目创建**: 生成完整的网页项目结构
- 🔍 **代码分析**: 分析现有代码并提供优化建议

## 🚀 快速开始

### 1. 运行开发服务器

```bash
# 启动 Mastra 开发服务器
mastra dev
```

访问 `http://localhost:4111` 可以在 Web UI 中与 agent 进行交互。

### 2. 基础使用示例

#### 创建简单网页
```javascript
import { mastra } from './src/mastra/index.js';

const codeAgent = mastra.getAgent('codeGenerationAgent');

const result = await codeAgent.generate(`
我需要创建一个企业官网，包含：
- 导航栏
- Hero 区域
- 服务介绍
- 联系表单
请生成完整的代码和项目文件。
`);

console.log(result.text);
```

#### 流式生成（观察 ReAct 过程）
```javascript
const stream = await codeAgent.stream(`
帮我创建一个个人博客网站，要求现代化设计和响应式布局
`, {
  maxSteps: 10,
  onStepFinish: ({ toolCalls }) => {
    if (toolCalls?.length > 0) {
      console.log('正在使用工具:', toolCalls.map(c => c.toolName));
    }
  }
});

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
```

### 3. 使用记忆功能

Agent 具有记忆能力，可以维持对话上下文：

```javascript
// 第一次交互
await codeAgent.generate('创建一个作品集网站', {
  memory: {
    resource: 'user-123',
    thread: 'portfolio-project'
  }
});

// 后续交互会记住之前的内容
await codeAgent.generate('请为网站添加深色模式切换功能', {
  memory: {
    resource: 'user-123',
    thread: 'portfolio-project'
  }
});
```

## 🛠️ 可用工具

Agent 内置了以下专业工具：

### 1. HTML 生成工具 (`generateHTML`)
```javascript
// 自动调用，支持参数：
{
  requirements: "详细的HTML结构需求",
  includeBoilerplate: true,  // 是否包含HTML5模板
  title: "页面标题",
  responsive: true           // 是否包含响应式meta标签
}
```

### 2. CSS 生成工具 (`generateCSS`)
```javascript
// 自动调用，支持参数：
{
  requirements: "样式需求和设计规范",
  framework: "vanilla",      // 'vanilla', 'flexbox', 'grid', 'bootstrap'
  colorScheme: "light",      // 'light', 'dark', 'auto'
  responsive: true           // 包含响应式设计
}
```

### 3. JavaScript 生成工具 (`generateJavaScript`)
```javascript
// 自动调用，支持参数：
{
  requirements: "JavaScript功能需求",
  features: ["form", "navigation", "animation"],
  vanilla: true,             // 使用原生JavaScript
  includeValidation: true    // 包含表单验证
}
```

### 4. 项目创建工具 (`createProject`)
自动将生成的 HTML、CSS、JavaScript 组织成完整的项目结构。

### 5. 代码分析工具 (`analyzeCode`)
分析现有代码，提供优化建议和质量评分。

## 💡 使用技巧

### 1. 详细描述需求
```javascript
// ✅ 好的描述
"创建一个电商网站首页，包含导航栏、轮播图、产品展示网格、用户评价区域和页脚。要求现代化设计，支持移动端，并添加购物车功能。"

// ❌ 模糊的描述  
"做个网站"
```

### 2. 指定技术偏好
```javascript
"使用 CSS Grid 布局创建响应式设计，JavaScript 要包含 ES6+ 特性和异步处理"
```

### 3. 要求特定功能
```javascript
"添加表单验证、图片懒加载、平滑滚动导航和深色模式切换"
```

### 4. 分步式复杂项目
```javascript
// 第一步：基础结构
await codeAgent.generate("创建网站的基本HTML结构和导航");

// 第二步：样式设计
await codeAgent.generate("为网站添加现代化的CSS样式");

// 第三步：交互功能
await codeAgent.generate("添加JavaScript交互功能和动画效果");
```

## 🎯 实际应用场景

### 1. 快速原型设计
```javascript
const result = await codeAgent.generate(`
需要快速创建一个产品展示页面的原型，包含：
- 产品介绍
- 特性列表  
- 定价表格
- 联系表单
要求简洁现代的设计
`);
```

### 2. 代码优化和重构
```javascript
const optimization = await codeAgent.generate(`
请分析并优化以下CSS代码，重点关注性能和可维护性：
[你的CSS代码]
`);
```

### 3. 响应式设计转换
```javascript
const responsive = await codeAgent.generate(`
将这个桌面版网站改造成响应式设计，确保在移动设备上的良好体验
`);
```

### 4. 无障碍访问优化
```javascript
const accessible = await codeAgent.generate(`
请检查并改进网站的无障碍访问性，添加必要的ARIA属性和语义化标签
`);
```

## 🔧 高级配置

### 1. 自定义 maxSteps
```javascript
const result = await codeAgent.generate(prompt, {
  maxSteps: 15  // 允许更多步骤完成复杂任务
});
```

### 2. 错误处理
```javascript
try {
  const result = await codeAgent.generate(prompt);
} catch (error) {
  console.error('代码生成失败:', error);
  // 处理错误逻辑
}
```

### 3. 监控生成过程
```javascript
const stream = await codeAgent.stream(prompt, {
  onStepFinish: ({ text, toolCalls, toolResults }) => {
    console.log('步骤完成:', { 
      toolsUsed: toolCalls?.map(c => c.toolName),
      hasResults: !!toolResults 
    });
  }
});
```

## 📁 生成的项目结构

Agent 创建的项目具有以下结构：

```
generated-projects/
└── your-project-name/
    ├── index.html      # 主HTML文件
    ├── styles.css      # CSS样式文件
    ├── script.js       # JavaScript功能文件
    └── README.md       # 项目说明文档
```

## 🎨 代码质量特性

生成的代码包含：

- ✅ HTML5 语义化标签
- ✅ CSS 自定义属性（CSS Variables）
- ✅ 响应式设计（Flexbox/Grid）
- ✅ 无障碍访问（ARIA 属性）
- ✅ 现代 JavaScript（ES6+）
- ✅ 表单验证和错误处理
- ✅ 性能优化（懒加载等）
- ✅ 深色模式支持
- ✅ 移动端适配

## 🚨 注意事项

1. **文件路径**: 生成的项目默认保存在 `./generated-projects/` 目录
2. **内存使用**: 使用 memory 参数可以维持对话上下文
3. **工具限制**: 每次生成最多使用 10 个步骤（可配置）
4. **网络资源**: 生成的代码可能包含示例图片链接

## 🤝 获取帮助

如果需要帮助，可以：

1. 在对话中直接询问 agent
2. 查看生成的 README.md 文件
3. 检查浏览器控制台的错误信息
4. 使用代码分析工具获取优化建议

---

开始使用这个强大的 ReAct 代码生成 Agent，让 AI 成为你的编程伙伴！ 🚀 
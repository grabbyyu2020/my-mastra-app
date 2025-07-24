# 🌟 Mastra 通用代码生成 Agent 使用指南

这是一个具有 ReAct 能力的通用代码生成 Agent，可以理解和生成**任何编程语言**的代码，并智能地将文件保存到 `out` 目录中。

## 🚀 核心特性

### 🌍 全语言支持
支持所有主流编程语言，包括但不限于：
- **后端**: Python, Go, Java, C#, PHP, Ruby, Rust, Node.js
- **前端**: JavaScript, TypeScript, HTML/CSS, React, Vue, Angular
- **移动**: Swift, Kotlin, Dart (Flutter), React Native  
- **系统**: C++, C, Rust
- **数据**: SQL, Python (NumPy/Pandas), R, MATLAB
- **配置**: YAML, JSON, XML, Dockerfile, Makefile
- **脚本**: Shell, PowerShell, Bash

### 🧠 ReAct 智能推理
- **需求分析**: 深度理解编程需求和技术选型
- **智能决策**: 自动选择最佳的技术栈和实现方案
- **迭代优化**: 基于结果不断改进代码质量

### 📁 智能文件管理
- **自动保存**: 将生成的代码保存到 `out` 目录
- **项目结构**: 创建完整的项目目录结构
- **文件组织**: 智能管理多文件项目

## 🎯 使用场景

### 1. 快速原型开发
```
"帮我创建一个实时聊天应用的原型，使用WebSocket技术"
```

### 2. 微服务架构
```
"设计一个用户认证微服务，支持JWT、OAuth2，使用Docker部署"
```

### 3. 数据处理脚本
```
"写一个Python脚本，处理CSV文件数据并生成可视化图表"
```

### 4. 移动应用开发
```
"创建一个Flutter应用，包含用户登录、数据同步、离线存储功能"
```

### 5. 系统工具开发
```
"用Rust开发一个高性能的文件同步工具，支持增量备份"
```

### 6. API服务开发
```
"使用Go语言创建一个RESTful API，包含CRUD操作和中间件"
```

## 🛠️ 快速开始

### 1. 启动开发服务器
```bash
mastra dev
```

### 2. 访问 Web UI
打开浏览器访问 `http://localhost:4111`，选择 `universalCodeAgent`

### 3. 开始对话
直接描述你的编程需求，Agent 会自动：
1. 🤔 分析需求和技术选型
2. ⚡ 生成高质量代码
3. 💾 保存到 `out` 目录
4. 📝 提供使用说明

## 💡 使用技巧

### 1. 详细描述需求
```javascript
// ✅ 好的描述
"创建一个Node.js Express API服务器，包含用户认证、数据验证、错误处理、API文档，使用MongoDB数据库，支持Docker部署"

// ❌ 模糊的描述
"做个API"
```

### 2. 指定技术偏好
```javascript
"使用Python FastAPI框架，集成SQLAlchemy ORM，添加pytest测试，支持异步处理"
```

### 3. 要求项目结构
```javascript
"创建完整的Go项目结构，包含cmd、internal、pkg目录，添加Makefile和Docker配置"
```

### 4. 分步开发
```javascript
// 第一步
"先创建基础的Python项目结构，包含配置文件和依赖管理"

// 第二步  
"为项目添加数据库模型和API路由"

// 第三步
"添加认证中间件和单元测试"
```

## 🎨 支持的框架和技术

### 后端框架
| 语言 | 框架 | 特性 |
|------|------|------|
| Python | FastAPI, Django, Flask | 异步支持、自动文档、ORM集成 |
| Go | Gin, Echo, Gorilla Mux | 高性能、中间件、路由 |
| Java | Spring Boot, Spring MVC | 企业级、依赖注入、AOP |
| C# | ASP.NET Core | 跨平台、高性能、中间件 |
| PHP | Laravel, Symfony | MVC架构、ORM、模板引擎 |
| Ruby | Rails, Sinatra | 约定优于配置、快速开发 |
| Rust | Actix-web, Warp | 内存安全、高并发 |
| Node.js | Express, Koa, NestJS | 异步处理、装饰器、模块化 |

### 前端框架
| 技术 | 框架/库 | 特性 |
|------|---------|------|
| JavaScript | Vanilla JS, jQuery | DOM操作、事件处理 |
| TypeScript | 类型安全、接口、泛型 | 强类型、IDE支持 |
| React | Hooks, Context, Router | 组件化、状态管理 |
| Vue | Composition API, Vuex | 响应式、模板语法 |
| Angular | Components, Services | 依赖注入、RxJS |

### 数据库集成
- **关系型**: PostgreSQL, MySQL, SQLite
- **NoSQL**: MongoDB, Redis, DynamoDB  
- **ORM**: SQLAlchemy, Prisma, Hibernate, Sequelize
- **查询构建器**: Knex.js, GORM, Entity Framework

### 部署和DevOps
- **容器化**: Docker, Docker Compose
- **编排**: Kubernetes YAML
- **CI/CD**: GitHub Actions, GitLab CI
- **配置**: Environment variables, Config files

## 📋 实际示例

### 示例1: Python FastAPI 微服务
```
创建一个用户管理微服务：
- FastAPI框架
- SQLAlchemy ORM + PostgreSQL
- JWT认证和授权
- Pydantic数据验证
- pytest单元测试
- Docker容器化
- API文档生成

请创建完整的项目结构和所有必要文件。
```

**Agent会生成**:
- `main.py` - FastAPI应用入口
- `models/` - 数据库模型
- `routers/` - API路由
- `auth/` - 认证模块
- `tests/` - 单元测试
- `requirements.txt` - 依赖管理
- `Dockerfile` - 容器配置
- `README.md` - 项目文档

### 示例2: React TypeScript 应用
```
开发一个任务管理Web应用：
- TypeScript + React 18
- Zustand状态管理
- React Router 6导航
- Ant Design UI组件
- Axios HTTP客户端
- Jest + React Testing Library
- 响应式设计

包含用户认证、任务CRUD、拖拽排序功能。
```

**Agent会生成**:
- `components/` - React组件
- `hooks/` - 自定义Hooks
- `store/` - Zustand状态管理
- `services/` - API服务
- `types/` - TypeScript类型定义
- `tests/` - 组件测试
- `package.json` - 依赖配置
- `tsconfig.json` - TypeScript配置

### 示例3: Go CLI 工具
```
创建一个文件处理CLI工具：
- Go语言 + Cobra CLI框架
- 支持多种文件操作命令
- 配置文件支持(YAML)
- 进度条显示
- 日志记录
- 跨平台编译
- 单元测试

工具名称: fileutil
```

**Agent会生成**:
- `cmd/` - CLI命令定义
- `internal/` - 内部逻辑
- `pkg/` - 公共包
- `go.mod` - Go模块
- `Makefile` - 构建脚本
- `README.md` - 使用文档

## 🔧 高级功能

### 1. 项目模板生成
```javascript
const result = await universalAgent.generate(`
创建一个完整的电商项目模板，包含：
- 后端API（Python Django）
- 前端界面（React + TypeScript）
- 数据库设计（PostgreSQL）
- 部署配置（Docker + Nginx）
- 监控和日志（Prometheus + Grafana）
`);
```

### 2. 代码重构和优化
```javascript
const optimization = await universalAgent.generate(`
请分析以下Python代码并进行重构优化：
[粘贴你的代码]

重点优化：
- 性能改进
- 代码可读性
- 错误处理
- 类型注解
- 单元测试覆盖
`);
```

### 3. 多语言项目
```javascript
const multiLangProject = await universalAgent.generate(`
创建一个分布式系统项目：
- API网关（Go + Gin）
- 用户服务（Python + FastAPI）
- 订单服务（Java + Spring Boot）
- 前端应用（TypeScript + React）
- 数据库（PostgreSQL + Redis）
- 消息队列（RabbitMQ）
- 监控（Prometheus + Grafana）

包含完整的Docker Compose配置和部署文档。
`);
```

### 4. 代码迁移
```javascript
const migration = await universalAgent.generate(`
将以下JavaScript代码迁移到TypeScript：
[你的JS代码]

要求：
- 添加完整的类型定义
- 使用最新的TypeScript特性
- 保持原有功能不变
- 添加JSDoc注释
`);
```

## 📁 文件组织

### 生成的文件结构
```
out/
├── project-name/
│   ├── src/              # 源代码
│   ├── tests/            # 测试文件
│   ├── docs/             # 文档
│   ├── config/           # 配置文件
│   ├── scripts/          # 脚本文件
│   ├── Dockerfile        # 容器配置
│   ├── README.md         # 项目说明
│   ├── package.json      # 依赖管理（Node.js）
│   ├── requirements.txt  # 依赖管理（Python）
│   ├── go.mod           # 依赖管理（Go）
│   └── Makefile         # 构建脚本
```

### 文件命名规则
- **项目目录**: 使用项目名称或功能描述
- **源文件**: 遵循语言惯例（snake_case, camelCase, PascalCase）
- **配置文件**: 使用标准名称（package.json, go.mod, requirements.txt）
- **文档文件**: 使用大写（README.md, CHANGELOG.md）

## 🎛️ 高级配置

### 1. 内存上下文管理
```javascript
// 项目开发会话
await universalAgent.generate("创建项目基础结构", {
  memory: {
    resource: 'user-123',
    thread: 'my-project'
  }
});

// 后续改进会记住上下文
await universalAgent.generate("为项目添加认证功能", {
  memory: {
    resource: 'user-123', 
    thread: 'my-project'  // 相同thread维持上下文
  }
});
```

### 2. 流式生成（观察思考过程）
```javascript
const stream = await universalAgent.stream(`
创建一个复杂的微服务架构项目
`, {
  maxSteps: 20,
  onStepFinish: ({ toolCalls }) => {
    if (toolCalls?.length > 0) {
      console.log('Agent正在使用工具:', toolCalls.map(c => c.toolName));
    }
  }
});

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
```

### 3. 自定义保存路径
```javascript
const result = await universalAgent.generate(`
生成代码并保存到指定位置：
- 代码类型：Python Flask API
- 保存目录：projects/flask-api
- 文件命名：app.py
`);
```

## 🚨 最佳实践

### 1. 需求描述
- ✅ **具体明确**: 说明功能、技术栈、特殊要求
- ✅ **分步进行**: 复杂项目分阶段开发
- ✅ **指定标准**: 提及编码规范、最佳实践
- ❌ **过于模糊**: 避免"做个网站"这样的描述

### 2. 技术选型
- ✅ **说明偏好**: 指定框架、数据库、部署方式
- ✅ **考虑约束**: 提及性能、安全、维护性要求
- ✅ **版本控制**: 指定特定版本或最新稳定版
- ❌ **无限制**: 不给出任何技术偏好

### 3. 项目管理
- ✅ **使用内存**: 利用thread维持项目上下文
- ✅ **文件整理**: 定期检查out目录的文件组织
- ✅ **版本追踪**: 为重要改动创建新的版本文件
- ❌ **忽略组织**: 不关注文件结构和命名

### 4. 代码质量
- ✅ **要求测试**: 明确需要单元测试和集成测试
- ✅ **文档完善**: 要求注释、README、API文档
- ✅ **错误处理**: 强调异常处理和边界条件
- ❌ **只求功能**: 忽视代码质量和可维护性

## 🎓 学习资源

### 编程入门
如果你是编程新手，可以这样开始：
```
"我想学习Web开发，请为我创建一个简单的个人网站项目，包含HTML、CSS、JavaScript，并解释每部分的作用"
```

### 技术探索
探索新技术时：
```
"我想了解Rust语言的特点，请创建一个简单的命令行程序示例，展示Rust的所有权、生命周期、错误处理等核心概念"
```

### 最佳实践学习
```
"请创建一个展示Python最佳实践的项目示例，包含代码组织、错误处理、测试、文档、性能优化等方面"
```

## 🤝 获取帮助

### 1. 项目问题
```
"我的Python项目出现了导入错误，请帮我分析和修复"
```

### 2. 性能优化  
```
"这段代码运行很慢，请帮我分析瓶颈并优化性能"
```

### 3. 代码重构
```
"这个函数太复杂了，请帮我重构成更清晰的结构"
```

### 4. 技术选型建议
```
"我要开发一个高并发的Web API，应该选择什么技术栈？请给出具体的实现方案"
```

## 📊 测试和验证

### 运行测试示例
```bash
# 运行多语言代码生成测试
node test-universal-code-agent.ts

# 测试将生成以下语言的项目：
# - Python (FastAPI微服务)
# - Go (CLI工具)
# - TypeScript/React (Web应用)
# - Rust (系统工具)
# - Java (Spring Boot API)
```

### 检查生成结果
```bash
# 查看生成的文件
ls -la out/

# 查看项目结构
tree out/

# 测试生成的代码
cd out/python-project && python -m pytest
cd out/go-project && go test ./...
cd out/react-project && npm test
```

---

🎉 **开始使用这个强大的通用代码生成 Agent，让 AI 成为你的全栈开发伙伴！**

无论你要开发什么类型的项目，使用什么编程语言，这个 Agent 都能理解你的需求并生成高质量的代码。从简单的脚本到复杂的分布式系统，从前端界面到后端API，从移动应用到系统工具——一切皆有可能！ 🚀 
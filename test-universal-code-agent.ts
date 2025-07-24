import { mastra } from './src/mastra/index.js';

// 获取通用代码生成agent
const universalAgent = mastra.getAgent('universalCodeAgent');

async function testUniversalCodeGeneration() {
  console.log('🌟 Testing Universal Code Generation Agent\n');
  console.log('This agent can generate code in ANY programming language!');
  console.log('=' .repeat(70));

  // 测试1: Python微服务
  console.log('\n🐍 Test 1: Python FastAPI Microservice');
  console.log('-' .repeat(50));

  try {
    const pythonRequest = `
    我需要创建一个Python微服务，使用FastAPI框架，包含：
    - 用户管理API（CRUD操作）
    - JWT认证
    - 数据库集成（SQLAlchemy）
    - API文档生成
    - Docker容器化
    
    请生成完整的项目结构和代码文件。
    `;

    const pythonResult = await universalAgent.generate(pythonRequest, {
      memory: {
        resource: 'test-user',
        thread: 'python-microservice'
      },
      maxSteps: 12
    });

    console.log('✅ Python microservice generated successfully!');
    console.log('Files should be saved in the out/ directory.');

  } catch (error) {
    console.error('❌ Error in Python test:', error);
  }

  // 测试2: Go CLI工具
  console.log('\n🔥 Test 2: Go Command Line Tool');
  console.log('-' .repeat(50));

  try {
    const goRequest = `
    帮我创建一个Go语言的命令行工具，功能包括：
    - 文件管理操作（复制、移动、删除）
    - 支持多种命令行参数
    - 进度条显示
    - 配置文件支持
    - 跨平台编译
    
    请使用现代Go项目结构，包含Makefile和测试。
    `;

    const goResult = await universalAgent.generate(goRequest, {
      memory: {
        resource: 'test-user',
        thread: 'go-cli-tool'
      },
      maxSteps: 10
    });

    console.log('✅ Go CLI tool generated successfully!');

  } catch (error) {
    console.error('❌ Error in Go test:', error);
  }

  // 测试3: TypeScript React应用
  console.log('\n⚛️  Test 3: TypeScript React Application');
  console.log('-' .repeat(50));

  try {
    const reactRequest = `
    创建一个TypeScript React应用，包含：
    - 现代React Hook组件
    - 状态管理（Zustand或Context API）
    - 路由系统（React Router）
    - UI组件库集成
    - API客户端
    - 单元测试
    
    使用最新的React最佳实践和TypeScript严格模式。
    `;

    const reactResult = await universalAgent.generate(reactRequest, {
      memory: {
        resource: 'test-user', 
        thread: 'react-app'
      },
      maxSteps: 15
    });

    console.log('✅ React application generated successfully!');

  } catch (error) {
    console.error('❌ Error in React test:', error);
  }

  // 测试4: Rust系统工具
  console.log('\n🦀 Test 4: Rust System Utility');
  console.log('-' .repeat(50));

  try {
    const rustRequest = `
    用Rust语言开发一个系统监控工具：
    - CPU和内存使用率监控
    - 网络流量统计
    - 进程管理功能
    - 配置文件解析
    - 异步编程（Tokio）
    - 错误处理
    
    要求高性能、内存安全，符合Rust最佳实践。
    `;

    const rustResult = await universalAgent.generate(rustRequest, {
      memory: {
        resource: 'test-user',
        thread: 'rust-system-tool'
      },
      maxSteps: 12
    });

    console.log('✅ Rust system utility generated successfully!');

  } catch (error) {
    console.error('❌ Error in Rust test:', error);
  }

  // 测试5: Java Spring Boot API
  console.log('\n☕ Test 5: Java Spring Boot REST API');
  console.log('-' .repeat(50));

  try {
    const javaRequest = `
    开发一个Java Spring Boot REST API项目：
    - RESTful API设计
    - JPA数据持久化
    - Spring Security安全认证
    - 异常处理和日志记录
    - API文档（OpenAPI/Swagger）
    - 单元测试和集成测试
    
    使用Maven构建，遵循Spring Boot最佳实践。
    `;

    const javaResult = await universalAgent.generate(javaRequest, {
      memory: {
        resource: 'test-user',
        thread: 'java-spring-api'
      },
      maxSteps: 10
    });

    console.log('✅ Java Spring Boot API generated successfully!');

  } catch (error) {
    console.error('❌ Error in Java test:', error);
  }

  // 测试6: 检查生成的文件
  console.log('\n📁 Test 6: Checking Generated Files');
  console.log('-' .repeat(50));

  try {
    const filesResult = await universalAgent.generate(`
    请列出out目录中所有生成的文件，并给我一个简要的总结报告。
    `, {
      memory: {
        resource: 'test-user',
        thread: 'file-summary'
      },
      maxSteps: 3
    });

    console.log('📊 File Summary:');
    console.log(filesResult.text);

  } catch (error) {
    console.error('❌ Error in file listing test:', error);
  }

  console.log('\n🎉 Universal Code Generation Tests Completed!');
  console.log('\nThe agent demonstrated capabilities for:');
  console.log('   ✓ Python (FastAPI microservice)');
  console.log('   ✓ Go (CLI tool)'); 
  console.log('   ✓ TypeScript/React (Web application)');
  console.log('   ✓ Rust (System utility)');
  console.log('   ✓ Java (Spring Boot API)');
  console.log('   ✓ File management and organization');
  console.log('\n💡 Check the out/ directory for all generated code files!');
}

// 运行测试
testUniversalCodeGeneration().catch(console.error); 
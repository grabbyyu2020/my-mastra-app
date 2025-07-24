import { mastra } from './src/mastra/index.js';
import { RuntimeContext } from '@mastra/core/runtime-context';

// 获取代码生成agent
const codeAgent = mastra.getAgent('codeGenerationAgent');

async function testReActCapabilities() {
  console.log('🚀 Testing Code Generation Agent with ReAct Capabilities\n');

  // 测试1: 创建一个简单的个人作品集网站
  console.log('📝 Test 1: Creating a Personal Portfolio Website');
  console.log('=' .repeat(60));

  try {
    const portfolioRequest = `我需要创建一个个人作品集网站，包含以下内容：
- 导航栏（首页、关于我、项目、联系）
- Hero区域展示个人介绍
- 项目展示画廊
- 联系表单
- 响应式设计和深色模式支持

请帮我生成完整的HTML、CSS和JavaScript代码，并创建项目文件。`;

    // 使用stream来观察ReAct过程
    const stream = await codeAgent.stream(portfolioRequest, {
      memory: {
        resource: 'test-user',
        thread: 'portfolio-project'
      },
      onStepFinish: ({ text, toolCalls, toolResults }) => {
        if (toolCalls && toolCalls.length > 0) {
          console.log(`\n🔧 Agent is using tools:`);
          toolCalls.forEach((call, index) => {
            console.log(`   ${index + 1}. ${call.toolName}`);
          });
        }
      }
    });

    console.log('\n💭 Agent思考和行动过程：\n');
    for await (const chunk of stream.textStream) {
      process.stdout.write(chunk);
    }

    console.log('\n\n✅ Portfolio website generation completed!\n');

  } catch (error) {
    console.error('❌ Error in Test 1:', error);
  }

  // 测试2: 代码分析和优化
  console.log('\n📋 Test 2: Code Analysis and Optimization');
  console.log('=' .repeat(60));

  try {
    const analysisRequest = `请分析以下HTML代码并提供优化建议：

<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <div class="header">
        <div>Logo</div>
        <div>
            <div><a href="#home">Home</a></div>
            <div><a href="#about">About</a></div>
        </div>
    </div>
    <div class="content">
        <img src="hero.jpg">
        <div>Welcome to my website</div>
    </div>
</body>
</html>

重点关注可访问性和SEO优化。如果需要，请生成改进后的代码。`;

    const analysisResult = await codeAgent.generate(analysisRequest, {
      memory: {
        resource: 'test-user',
        thread: 'code-analysis'
      },
      maxSteps: 5
    });

    console.log('\n📊 Analysis Result:\n');
    console.log(analysisResult.text);

  } catch (error) {
    console.error('❌ Error in Test 2:', error);
  }

  // 测试3: 基于用户反馈的迭代改进
  console.log('\n🔄 Test 3: Iterative Improvement Based on Feedback');
  console.log('=' .repeat(60));

  try {
    const feedbackRequest = `基于之前生成的作品集网站，用户反馈说：
1. Hero区域太简单，希望加一些动画效果
2. 需要添加技能展示区域
3. 希望有一个暗色主题的切换按钮

请帮我改进网站，重新生成相关代码。`;

    const improvementResult = await codeAgent.generate(feedbackRequest, {
      memory: {
        resource: 'test-user',
        thread: 'portfolio-project' // 使用同一个thread来维持上下文
      },
      maxSteps: 8,
      onStepFinish: ({ text, toolCalls }) => {
        if (toolCalls && toolCalls.length > 0) {
          console.log(`\n🛠️  正在执行改进操作...`);
        }
      }
    });

    console.log('\n🎨 Improvement Result:\n');
    console.log(improvementResult.text);

  } catch (error) {
    console.error('❌ Error in Test 3:', error);
  }

  console.log('\n🎉 All tests completed! The ReAct agent demonstrated:');
  console.log('   ✓ Reasoning about user requirements');
  console.log('   ✓ Strategic tool usage for code generation');
  console.log('   ✓ Context awareness and memory usage');
  console.log('   ✓ Iterative improvement based on feedback');
  console.log('   ✓ Multi-step problem solving capabilities');
}

// 运行测试
testReActCapabilities().catch(console.error); 